"use client";

import React, { useRef, useState, useEffect } from "react";
import { dayTheme, pixelGrid, zIndex } from "../../lib/theme";
import { useSound } from "../../hooks/use-sound";
import {
  capDeltaTime,
  applyGravity,
  resolveAABBCollision,
  clampX,
} from "../../lib/game/physics";
import {
  type PlayerState,
  applyHorizontalInput,
  applyJump,
  updatePlayerAnimation,
  createPlayer,
} from "../../lib/game/player";
import {
  type Platform,
  type Coin,
  type Enemy,
  aabb,
  layoutLevel,
} from "../../lib/game/utils";
// ---------------------------------------------------------------------------
// SUPABASE — commented out until Supabase is connected.
// To re-enable: uncomment the import below and the _supabaseInstance block,
// then replace the localStorage helpers with the Supabase implementations.
// ---------------------------------------------------------------------------
// import { supabase } from "../../lib/supabaseClient";
//
// let _supabaseInstance: typeof supabase | null = null;
// let _supabaseConfigError: string | null = null;
// try {
//   _supabaseInstance = supabase;
// } catch (e) {
//   _supabaseConfigError = e instanceof Error ? e.message : "Supabase configuration error";
// }

// ---------------------------------------------------------------------------
// LOCAL STORAGE — temporary persistence until Supabase is connected
// ---------------------------------------------------------------------------

const LS_KEY = "mario_game_scores";

interface ScoreEntry {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
}

function lsGetScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as ScoreEntry[]) : [];
  } catch {
    return [];
  }
}

function lsSaveScore(player_name: string, score: number): void {
  const scores = lsGetScores();
  scores.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    player_name,
    score,
    created_at: new Date().toISOString(),
  });
  localStorage.setItem(LS_KEY, JSON.stringify(scores));
}

function lsGetTopScores(limit = 10): ScoreEntry[] {
  return lsGetScores()
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Local Interfaces
// ---------------------------------------------------------------------------

interface InputState {
  left: boolean;
  right: boolean;
  /** Milliseconds remaining in the jump buffer window (set to 150 on Space press). */
  jumpBufferMs: number;
}

interface GameState {
  status: "idle" | "running" | "paused" | "dead" | "levelComplete" | "gameOver";
  player: PlayerState;
  platforms: Platform[];
  coins: Coin[];
  enemies: Enemy[];
  score: number;
  lives: number;
  canvasWidth: number;
  canvasHeight: number;
  lastTimestamp: number | null;
  inputState: InputState;
}

type OverlayState =
  | { type: "none" }
  | { type: "start" }
  | { type: "respawn"; livesLeft: number }
  | { type: "submitScore"; finalScore: number }
  | { type: "gameOver"; finalScore: number };

interface SubmitState {
  playerName: string;
  loading: boolean;
  error: string | null;
  submitted: boolean;
}

// ---------------------------------------------------------------------------
// Module-level helpers
// ---------------------------------------------------------------------------

// ScoreRow is an alias for ScoreEntry (same shape, kept for component state typing)
type ScoreRow = ScoreEntry;

export function sanitizeName(s: string): string {
  return s.slice(0, 20);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function initGameState(canvasWidth: number, canvasHeight: number): GameState {
  const layout = layoutLevel(canvasWidth, canvasHeight);
  const player = createPlayer(canvasWidth, canvasHeight);
  return {
    status: "idle",
    player,
    platforms: layout.platforms,
    coins: layout.coins,
    enemies: layout.enemies,
    score: 0,
    lives: 3,
    canvasWidth,
    canvasHeight,
    lastTimestamp: null,
    inputState: { left: false, right: false, jumpBufferMs: 0 },
  };
}

// ---------------------------------------------------------------------------
// Render stub (full rendering implemented in Task 8)
// ---------------------------------------------------------------------------

function renderFrame(ctx: CanvasRenderingContext2D, gs: GameState): void {
  const { canvasWidth, canvasHeight, player, platforms, coins, enemies, score, lives } = gs;

  // 1. Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 2. Sky background
  ctx.fillStyle = dayTheme.colors.sky;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 3. Platforms
  for (const platform of platforms) {
    ctx.fillStyle = platform.isGround ? dayTheme.colors.ground : dayTheme.colors.brick;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    // Pixel-art border
    ctx.fillStyle = dayTheme.colors.border;
    ctx.fillRect(platform.x, platform.y, platform.width, 2); // top border
  }

  // 4. Coins — spinning square animation (toggle width based on animTimer)
  for (const coin of coins) {
    if (coin.collected) continue;
    const spinWidth = coin.animTimer < 0.15 ? coin.width : Math.max(4, coin.width * 0.3);
    const spinOffsetX = (coin.width - spinWidth) / 2;
    ctx.fillStyle = dayTheme.colors.coin;
    ctx.fillRect(coin.x + spinOffsetX, coin.y, spinWidth, coin.height);
    // Coin shine
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(coin.x + spinOffsetX + 2, coin.y + 2, 4, 4);
  }

  // 5. Enemies — rectangle with simple face
  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    // Body
    ctx.fillStyle = dayTheme.colors.pipe;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    // Eyes (white)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(enemy.x + 4, enemy.y + 8, 8, 8);
    ctx.fillRect(enemy.x + enemy.width - 12, enemy.y + 8, 8, 8);
    // Pupils (black)
    ctx.fillStyle = "#000000";
    const eyeOffsetX = enemy.vx > 0 ? 4 : 2; // pupils shift toward movement direction
    ctx.fillRect(enemy.x + 4 + eyeOffsetX, enemy.y + 10, 4, 4);
    ctx.fillRect(enemy.x + enemy.width - 12 + eyeOffsetX, enemy.y + 10, 4, 4);
    // Angry brow
    ctx.fillStyle = "#000000";
    ctx.fillRect(enemy.x + 4, enemy.y + 6, 8, 2);
    ctx.fillRect(enemy.x + enemy.width - 12, enemy.y + 6, 8, 2);
  }

  // 6. Player — rectangle with pixel-art face
  const px = player.x;
  const py = player.y;
  const pw = player.width;
  const ph = player.height;

  // Body
  ctx.fillStyle = dayTheme.colors.mario;
  ctx.fillRect(px, py, pw, ph);

  // Cap brim (darker red)
  ctx.fillStyle = "#b00040";
  ctx.fillRect(px - 2, py + 4, pw + 4, 6);

  // Face (skin tone)
  ctx.fillStyle = "#f4a460";
  ctx.fillRect(px + 4, py + 10, pw - 8, 14);

  // Eyes (white + pupil)
  const eyeX = player.facingRight ? px + pw - 12 : px + 4;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(eyeX, py + 12, 6, 6);
  ctx.fillStyle = "#000000";
  ctx.fillRect(eyeX + (player.facingRight ? 2 : 0), py + 14, 3, 3);

  // Mustache
  ctx.fillStyle = "#4a2800";
  ctx.fillRect(px + 4, py + 20, pw - 8, 3);

  // Walk animation — legs alternate based on animFrame
  ctx.fillStyle = "#0000aa"; // blue overalls
  if (player.animFrame === 0) {
    ctx.fillRect(px + 2, py + ph - 14, 10, 14);
    ctx.fillRect(px + pw - 12, py + ph - 10, 10, 10);
  } else {
    ctx.fillRect(px + 2, py + ph - 10, 10, 10);
    ctx.fillRect(px + pw - 12, py + ph - 14, 10, 14);
  }

  // 7. HUD overlay — score and lives (font size scales with canvas width)
  const hudFontSize = Math.max(6, Math.round(canvasWidth / 80));
  ctx.font = `${hudFontSize}px "Press Start 2P", monospace`;
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "top";
  ctx.fillText(`SCORE ${String(score).padStart(6, "0")}`, 8, 8);
  ctx.fillText(`\u2665 \u00d7 ${lives}`, canvasWidth - hudFontSize * 5.5, 8);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MarioGame(): React.ReactElement {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef<GameState>(
    initGameState(800, 450)
  ) as React.MutableRefObject<GameState>;
  const rafRef = useRef<number | null>(null);
  const tickRef = useRef<((ts: number) => void) | null>(null);
  const respawnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sound — captured in a ref to avoid stale closure issues in the game loop
  const sound = useSound();
  const soundRef = useRef(sound);
  soundRef.current = sound;

  // React state (UI only — never mutated inside RAF callback)
  const [overlayState, setOverlayState] = useState<OverlayState>({ type: "start" });
  const [leaderboard, setLeaderboard] = useState<ScoreRow[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>({
    playerName: "",
    loading: false,
    error: null,
    submitted: false,
  });
  const [isMobile, setIsMobile] = useState(false);

  // Keep setOverlayState accessible inside the tick closure via a ref
  const setOverlayStateRef = useRef(setOverlayState);
  setOverlayStateRef.current = setOverlayState;

  // Keep handleRespawn accessible inside the tick closure via a ref
  // (defined below, ref updated after definition)
  const handleRespawnRef = useRef<(livesLeft: number) => void>(() => {});

  const setInput = (key: "left" | "right", value: boolean): void => {
    gameStateRef.current.inputState[key] = value;
  };

  const handleSubmitScore = async (playerName: string, finalScore: number): Promise<void> => {
    // Validate: name must not be empty
    if (!playerName.trim()) {
      setSubmitState((prev) => ({ ...prev, error: "Please enter your name." }));
      return;
    }

    const sanitized = sanitizeName(playerName);

    setSubmitState((prev) => ({ ...prev, loading: true, error: null }));

    // --- LOCAL STORAGE (temporary) ---
    // TODO: Replace with Supabase when connected:
    // const { error } = await _supabaseInstance!
    //   .from("scores")
    //   .insert({ player_name: sanitized, score: finalScore });
    // if (error) {
    //   setSubmitState((prev) => ({ ...prev, loading: false, error: error.message }));
    //   return;
    // }
    try {
      lsSaveScore(sanitized, finalScore);
      setSubmitState({ playerName: "", loading: false, error: null, submitted: true });
      setOverlayState({ type: "none" });
      void fetchLeaderboard();
    } catch (err) {
      setSubmitState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Submission failed. Please try again.",
      }));
    }
  };

  const fetchLeaderboard = async (): Promise<void> => {
    setLeaderboardLoading(true);
    setLeaderboardError(null);

    // --- LOCAL STORAGE (temporary) ---
    // TODO: Replace with Supabase when connected:
    // try {
    //   const { data, error } = await _supabaseInstance!
    //     .from("scores")
    //     .select("id, player_name, score, created_at")
    //     .order("score", { ascending: false })
    //     .limit(10);
    //   if (error) { setLeaderboardError(error.message); }
    //   else { setLeaderboard(data ?? []); }
    // } catch (err) {
    //   setLeaderboardError(err instanceof Error ? err.message : "Failed to load scores.");
    // } finally {
    //   setLeaderboardLoading(false);
    // }
    try {
      const scores = lsGetTopScores(10);
      setLeaderboard(scores);
    } catch (err) {
      setLeaderboardError(err instanceof Error ? err.message : "Failed to load scores.");
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const handlePlayAgain = (): void => {
    setOverlayState({ type: "none" });
    setSubmitState({ playerName: "", loading: false, error: null, submitted: false });
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const logicalWidth = container.clientWidth;
    const logicalHeight = container.clientHeight || Math.round(logicalWidth * (9 / 16));
    const gs = initGameState(logicalWidth, logicalHeight);
    gameStateRef.current = gs;
    gameStateRef.current.status = "running";
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (tickRef.current) {
      rafRef.current = requestAnimationFrame(tickRef.current);
    }
  };

  const handleStart = (): void => {
    setOverlayState({ type: "none" });
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const logicalWidth = container.clientWidth;
    const logicalHeight = container.clientHeight || Math.round(logicalWidth * (9 / 16));
    const gs = initGameState(logicalWidth, logicalHeight);
    gameStateRef.current = gs;
    gameStateRef.current.status = "running";
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (tickRef.current) {
      rafRef.current = requestAnimationFrame(tickRef.current);
    }
  };

  // Respawn: reset the level but keep the current lives count, then restart the loop
  const handleRespawn = (livesLeft: number): void => {
    setOverlayState({ type: "none" });
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const logicalWidth = container.clientWidth;
    const logicalHeight = container.clientHeight || Math.round(logicalWidth * (9 / 16));
    const gs = initGameState(logicalWidth, logicalHeight);
    gs.lives = livesLeft; // carry over remaining lives
    gameStateRef.current = gs;
    gameStateRef.current.status = "running";
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (tickRef.current) {
      rafRef.current = requestAnimationFrame(tickRef.current);
    }
  };
  handleRespawnRef.current = handleRespawn;  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let resizeTimeout: ReturnType<typeof setTimeout>;

    function setupCanvas(startImmediately = false): void {
      const logicalWidth = container!.clientWidth;
      const logicalHeight = container!.clientHeight || Math.round(logicalWidth * (9 / 16));
      const dpr = window.devicePixelRatio ?? 1;

      canvas!.width = logicalWidth * dpr;
      canvas!.height = logicalHeight * dpr;
      canvas!.style.width = `${logicalWidth}px`;
      canvas!.style.height = `${logicalHeight}px`;

      const ctx = canvas!.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);

      const gs = initGameState(logicalWidth, logicalHeight);
      gameStateRef.current = gs;

      if (startImmediately) {
        gameStateRef.current.status = "running";
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Draw a static idle frame so the canvas isn't blank on the start screen
        const idleCtx = canvas!.getContext("2d");
        if (idleCtx) renderFrame(idleCtx, gs);
      }
    }

    // ---------------------------------------------------------------------------
    // Game loop — 12-step tick function
    // ---------------------------------------------------------------------------
    function tick(timestamp: number): void {
      try {
        const gs = gameStateRef.current;
        if (gs.status !== "running") return;

        const rawDt = gs.lastTimestamp
          ? (timestamp - gs.lastTimestamp) / 1000
          : 0;
        const dt = capDeltaTime(rawDt);
        gs.lastTimestamp = timestamp;

        // Physics scale — keeps jump arc proportional to canvas height.
        // Reference height is 450px; on larger canvases everything scales up.
        const physScale = gs.canvasHeight / 450;

        // 1. Process input → update player velocity/direction
        const direction = gs.inputState.left ? -1 : gs.inputState.right ? 1 : 0;
        // Scale move speed proportionally to canvas width (reference: 800px)
        const moveSpeed = 160 * (gs.canvasWidth / 800);
        gs.player = {
          ...gs.player,
          x: gs.player.x + direction * moveSpeed * dt,
          facingRight: direction === 1 ? true : direction === -1 ? false : gs.player.facingRight,
        };

        // Handle jump — buffer-based so a Space press slightly before landing still registers
        if (gs.inputState.jumpBufferMs > 0) {
          if (gs.player.isGrounded) {
            // Scale jump velocity with canvas height so platforms stay reachable
            gs.player = { ...applyJump(gs.player), vy: -550 * physScale };
            gs.inputState.jumpBufferMs = 0; // consumed
          } else {
            gs.inputState.jumpBufferMs -= dt * 1000; // tick down (ms)
            if (gs.inputState.jumpBufferMs < 0) gs.inputState.jumpBufferMs = 0;
          }
        }

        // 2. Apply gravity (if not grounded) — scaled to match jump arc
        if (!gs.player.isGrounded) {
          gs.player = { ...gs.player, vy: gs.player.vy + 1200 * physScale * dt };
        }

        // 3. Integrate player position
        gs.player = {
          ...gs.player,
          x: gs.player.x + gs.player.vx * dt,
          y: gs.player.y + gs.player.vy * dt,
          isGrounded: false, // reset each frame; collision will set it back
        };

        // 4. Resolve player vs platform collisions
        for (const platform of gs.platforms) {
          const result = resolveAABBCollision(gs.player, platform);
          if (result.resolved) {
            gs.player = result.player;
          }
        }

        // 5. Clamp player x to canvas bounds
        gs.player = {
          ...gs.player,
          x: clampX(gs.player.x, gs.player.width, gs.canvasWidth),
        };

        // 6. Check player vs coin collisions → collect
        for (const coin of gs.coins) {
          if (!coin.collected && aabb(gs.player, coin)) {
            coin.collected = true;
            gs.score += 1;
            soundRef.current.playCoin();
          }
        }
        gs.coins = gs.coins.filter((c) => !c.collected);

        // 7. Check player vs enemy collisions
        for (const enemy of gs.enemies) {
          if (!enemy.alive) continue;
          if (aabb(gs.player, enemy)) {
            // Check if player is landing on top of enemy
            const playerBottom = gs.player.y + gs.player.height;
            const enemyTop = enemy.y;
            if (gs.player.vy > 0 && playerBottom - enemyTop < 16) {
              // Stomp: defeat enemy
              enemy.alive = false;
              gs.score += 2;
              gs.player = { ...gs.player, vy: -300 * physScale }; // bounce up
              soundRef.current.playBounce();
            } else {
              // Hit by enemy: die
              gs.status = "dead";
              gs.lives -= 1;
              const finalScore = gs.score;
              const finalLives = gs.lives;
              Promise.resolve().then(() => {
                if (finalLives <= 0) {
                  setOverlayStateRef.current({ type: "gameOver", finalScore });
                } else {
                  // Show "YOU DIED" briefly, then auto-respawn after 1.5s
                  setOverlayStateRef.current({ type: "respawn", livesLeft: finalLives });
                  respawnTimerRef.current = setTimeout(() => {
                    handleRespawnRef.current(finalLives);
                  }, 1500);
                }
              });
              return;
            }
          }
        }
        gs.enemies = gs.enemies.filter((e) => e.alive);

        // 8. Update enemy positions and direction reversals
        for (const enemy of gs.enemies) {
          enemy.x += enemy.vx * dt;
          if (
            enemy.x <= 0 ||
            enemy.x + enemy.width >= gs.canvasWidth
          ) {
            enemy.vx = -enemy.vx;
            enemy.x = Math.max(
              0,
              Math.min(enemy.x, gs.canvasWidth - enemy.width)
            );
          }
        }

        // 9. Check fall-off (player.y > canvasHeight)
        if (gs.player.y > gs.canvasHeight) {
          gs.status = "dead";
          gs.lives -= 1;
          const finalScore = gs.score;
          const finalLives = gs.lives;
          Promise.resolve().then(() => {
            if (finalLives <= 0) {
              setOverlayStateRef.current({ type: "gameOver", finalScore });
            } else {
              // Show "YOU DIED" briefly, then auto-respawn after 1.5s
              setOverlayStateRef.current({ type: "respawn", livesLeft: finalLives });
              respawnTimerRef.current = setTimeout(() => {
                handleRespawnRef.current(finalLives);
              }, 1500);
            }
          });
          return;
        }

        // 10. Check level complete (all coins collected)
        if (gs.coins.length === 0) {
          gs.status = "levelComplete";
          const finalScore = gs.score;
          Promise.resolve().then(() => {
            setOverlayStateRef.current({ type: "submitScore", finalScore });
          });
          return;
        }

        // 11. Update player animation
        gs.player = updatePlayerAnimation(gs.player, dt);

        // Update coin animation timers
        for (const coin of gs.coins) {
          coin.animTimer = (coin.animTimer + dt) % 0.3; // 0.3s spin cycle
        }

        // 12. Render frame
        const canvasEl = canvasRef.current;
        if (canvasEl) {
          const ctx = canvasEl.getContext("2d");
          if (ctx) renderFrame(ctx, gs);
        }

        // 13. Schedule next frame
        rafRef.current = requestAnimationFrame(tick);
      } catch (err) {
        console.error("Game loop error:", err);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      }
    }

    // Store tick in ref so handlePlayAgain can restart the loop
    tickRef.current = tick;

    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setupCanvas, 100);
    });

    resizeObserver.observe(container);
    setupCanvas();
    function handleKeyDown(e: KeyboardEvent): void {
      const gs = gameStateRef.current;
      if (e.code === "ArrowLeft" || e.code === "KeyA") gs.inputState.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") gs.inputState.right = true;
      if (e.code === "Space") {
        e.preventDefault(); // prevent page scroll
        gs.inputState.jumpBufferMs = 150; // 150 ms buffer window
      }
    }
    function handleKeyUp(e: KeyboardEvent): void {
      const gs = gameStateRef.current;
      if (e.code === "ArrowLeft" || e.code === "KeyA") gs.inputState.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD")
        gs.inputState.right = false;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Detect touch device (show on-screen controls for any touch-capable device)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(isTouchDevice || window.innerWidth < 768);

    function handleResize(): void {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(isTouch || window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (respawnTimerRef.current) clearTimeout(respawnTimerRef.current);
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch leaderboard on mount
  useEffect(() => {
    void fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        /*
         * Responsive container:
         * - Fill full width up to the viewport
         * - Constrain height so the canvas never overflows the screen
         *   (viewport height minus navbar 56px, title ~36px, controls ~72px, leaderboard)
         * - 16:9 aspect ratio maintained via CSS aspect-ratio
         */
        width: "100%",
        maxWidth: "min(100vw, calc((100vh - 220px) * 16 / 9))",
        margin: "0 auto",
        padding: "0 4px",
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
        }}
      >
        <canvas
          ref={canvasRef}
          aria-label="Mario mini-game canvas"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            imageRendering: "pixelated",
          }}
        />
        {overlayState.type === "start" && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Start Game"
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.82)",
              zIndex: zIndex.overlay,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: pixelGrid.px6,
                padding: pixelGrid.px8,
                border: `4px solid ${dayTheme.colors.coin}`,
                background: dayTheme.colors.bg,
                maxWidth: "340px",
                width: "90%",
              }}
            >
              {/* Pixel Mario icon */}
              <div style={{ fontSize: "32px", lineHeight: 1 }}>🍄</div>

              <h2
                className="pixel-text"
                style={{
                  color: dayTheme.colors.coin,
                  fontSize: "clamp(10px, 2.5vw, 16px)",
                  textAlign: "center",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                MARIO GAME
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: pixelGrid.px2,
                  width: "100%",
                }}
              >
                <p className="pixel-text" style={{ color: dayTheme.colors.text, fontSize: "7px", textAlign: "center", margin: 0 }}>
                  ◀ ▶ — MOVE
                </p>
                <p className="pixel-text" style={{ color: dayTheme.colors.text, fontSize: "7px", textAlign: "center", margin: 0 }}>
                  SPACE — JUMP
                </p>
                <p className="pixel-text" style={{ color: dayTheme.colors.text, fontSize: "7px", textAlign: "center", margin: 0 }}>
                  COLLECT ALL COINS TO WIN
                </p>
              </div>

              <button
                aria-label="Start Game"
                onClick={handleStart}
                autoFocus
                className="pixel-text pixel-shadow"
                style={{
                  padding: `${pixelGrid.px3} ${pixelGrid.px8}`,
                  fontSize: "clamp(9px, 2vw, 12px)",
                  background: dayTheme.colors.pipe,
                  color: dayTheme.colors.text,
                  border: `3px solid ${dayTheme.colors.border}`,
                  cursor: "pointer",
                  letterSpacing: "0.1em",
                  width: "100%",
                }}
              >
                ▶ START GAME
              </button>
            </div>
          </div>
        )}

        {overlayState.type === "respawn" && (
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.7)",
              zIndex: zIndex.overlay,
              gap: pixelGrid.px4,
            }}
          >
            <p
              className="pixel-text"
              style={{ color: dayTheme.colors.mario, fontSize: "clamp(14px, 3vw, 22px)", margin: 0 }}
            >
              YOU DIED
            </p>
            <p
              className="pixel-text"
              style={{ color: dayTheme.colors.coin, fontSize: "clamp(10px, 2vw, 14px)", margin: 0 }}
            >
              {Array.from({ length: overlayState.livesLeft }).map((_, i) => (
                <span key={i}>♥ </span>
              ))}
            </p>
            <p
              className="pixel-text"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: "7px", margin: 0 }}
            >
              RESPAWNING...
            </p>
          </div>
        )}

        {(overlayState.type === "submitScore" || overlayState.type === "gameOver") && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={overlayState.type === "gameOver" ? "Game Over" : "Submit Score"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.75)",
              zIndex: zIndex.overlay,
              padding: pixelGrid.px4,
            }}
          >
            <div
              style={{
                background: dayTheme.colors.bg,
                border: `4px solid ${dayTheme.colors.border}`,
                padding: pixelGrid.px8,
                maxWidth: "360px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: pixelGrid.px4,
              }}
            >
              <h2
                className="pixel-text"
                style={{ color: dayTheme.colors.coin, fontSize: "14px", textAlign: "center", margin: 0 }}
              >
                {overlayState.type === "gameOver" ? "GAME OVER" : "LEVEL CLEAR!"}
              </h2>
              <p
                className="pixel-text"
                style={{ color: dayTheme.colors.text, fontSize: "10px", textAlign: "center", margin: 0 }}
              >
                SCORE: {String(overlayState.finalScore).padStart(6, "0")}
              </p>

              {!submitState.submitted && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: pixelGrid.px2 }}>
                    <label
                      htmlFor="player-name-input"
                      className="pixel-text"
                      style={{ color: dayTheme.colors.text, fontSize: "8px" }}
                    >
                      YOUR NAME
                    </label>
                    <input
                      id="player-name-input"
                      type="text"
                      maxLength={20}
                      aria-label="Player name"
                      value={submitState.playerName}
                      onChange={(e) =>
                        setSubmitState((prev) => ({ ...prev, playerName: e.target.value, error: null }))
                      }
                      style={{
                        fontFamily: '"Press Start 2P", monospace',
                        fontSize: "10px",
                        padding: pixelGrid.px2,
                        background: "#000",
                        color: "#fff",
                        border: `2px solid ${dayTheme.colors.border}`,
                        outline: "none",
                      }}
                      autoFocus
                    />
                    {submitState.error && (
                      <p
                        className="pixel-text"
                        style={{ color: dayTheme.colors.mario, fontSize: "8px", margin: 0 }}
                        role="alert"
                      >
                        {submitState.error}
                      </p>
                    )}
                  </div>

                  <button
                    aria-label="Submit Score"
                    disabled={submitState.loading}
                    onClick={() => handleSubmitScore(submitState.playerName, overlayState.finalScore)}
                    className="pixel-text pixel-shadow"
                    style={{
                      padding: `${pixelGrid.px2} ${pixelGrid.px4}`,
                      fontSize: "10px",
                      background: submitState.loading ? dayTheme.colors.ground : dayTheme.colors.pipe,
                      color: dayTheme.colors.text,
                      border: `2px solid ${dayTheme.colors.border}`,
                      cursor: submitState.loading ? "not-allowed" : "pointer",
                      opacity: submitState.loading ? 0.7 : 1,
                    }}
                  >
                    {submitState.loading ? "SAVING..." : "SUBMIT SCORE"}
                  </button>
                </>
              )}

              {submitState.submitted && (
                <p
                  className="pixel-text"
                  style={{ color: dayTheme.colors.pipe, fontSize: "8px", textAlign: "center", margin: 0 }}
                >
                  SCORE SAVED!
                </p>
              )}

              <button
                aria-label="Play Again"
                onClick={handlePlayAgain}
                className="pixel-text pixel-shadow"
                style={{
                  padding: `${pixelGrid.px2} ${pixelGrid.px4}`,
                  fontSize: "10px",
                  background: dayTheme.colors.brick,
                  color: dayTheme.colors.text,
                  border: `2px solid ${dayTheme.colors.border}`,
                  cursor: "pointer",
                }}
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
      {isMobile && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "4px 8px",
            marginTop: "4px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onPointerDown={() => setInput("left", true)}
              onPointerUp={() => setInput("left", false)}
              onPointerLeave={() => setInput("left", false)}
              aria-label="Move left"
              className="pixel-text pixel-shadow"
              style={{
                padding: "clamp(8px, 3vw, 16px) clamp(12px, 4vw, 24px)",
                fontSize: "clamp(16px, 5vw, 28px)",
                background: dayTheme.colors.brick,
                color: dayTheme.colors.text,
                border: `2px solid ${dayTheme.colors.border}`,
                cursor: "pointer",
                userSelect: "none",
                touchAction: "none",
                minWidth: "clamp(44px, 12vw, 72px)",
                minHeight: "clamp(44px, 10vw, 64px)",
              }}
            >
              ◀
            </button>
            <button
              onPointerDown={() => setInput("right", true)}
              onPointerUp={() => setInput("right", false)}
              onPointerLeave={() => setInput("right", false)}
              aria-label="Move right"
              className="pixel-text pixel-shadow"
              style={{
                padding: "clamp(8px, 3vw, 16px) clamp(12px, 4vw, 24px)",
                fontSize: "clamp(16px, 5vw, 28px)",
                background: dayTheme.colors.brick,
                color: dayTheme.colors.text,
                border: `2px solid ${dayTheme.colors.border}`,
                cursor: "pointer",
                userSelect: "none",
                touchAction: "none",
                minWidth: "clamp(44px, 12vw, 72px)",
                minHeight: "clamp(44px, 10vw, 64px)",
              }}
            >
              ▶
            </button>
          </div>
          <button
            onPointerDown={() => { gameStateRef.current.inputState.jumpBufferMs = 150; }}
            onPointerUp={() => {}}
            onPointerLeave={() => {}}
            aria-label="Jump"
            className="pixel-text pixel-shadow"
            style={{
              padding: "clamp(8px, 3vw, 16px) clamp(16px, 6vw, 36px)",
              fontSize: "clamp(16px, 5vw, 28px)",
              background: dayTheme.colors.mario,
              color: dayTheme.colors.text,
              border: `2px solid ${dayTheme.colors.border}`,
              cursor: "pointer",
              userSelect: "none",
              touchAction: "none",
              minWidth: "clamp(44px, 12vw, 72px)",
              minHeight: "clamp(44px, 10vw, 64px)",
            }}
          >
            ▲
          </button>
        </div>
      )}
      {/* Leaderboard */}
      <div
        style={{
          marginTop: pixelGrid.px4,
          padding: `0 ${pixelGrid.px2}`,
          width: "100%",
        }}
      >
        <h3
          className="pixel-text"
          style={{
            color: dayTheme.colors.coin,
            fontSize: "clamp(7px, 1.5vw, 10px)",
            marginBottom: pixelGrid.px4,
            textAlign: "center",
          }}
        >
          TOP SCORES
        </h3>

        {leaderboardLoading && (
          <p
            className="pixel-text"
            style={{
              color: dayTheme.colors.text,
              fontSize: "8px",
              textAlign: "center",
            }}
          >
            LOADING...
          </p>
        )}

        {leaderboardError && !leaderboardLoading && (
          <div style={{ textAlign: "center" }}>
            <p
              className="pixel-text"
              style={{
                color: dayTheme.colors.mario,
                fontSize: "8px",
                marginBottom: pixelGrid.px2,
              }}
              role="alert"
            >
              FAILED TO LOAD SCORES
            </p>
            <button
              onClick={() => void fetchLeaderboard()}
              className="pixel-text pixel-shadow"
              style={{
                padding: `${pixelGrid.px2} ${pixelGrid.px4}`,
                fontSize: "8px",
                background: dayTheme.colors.brick,
                color: dayTheme.colors.text,
                border: `2px solid ${dayTheme.colors.border}`,
                cursor: "pointer",
              }}
            >
              RETRY
            </button>
          </div>
        )}

        {!leaderboardLoading && !leaderboardError && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "8px",
            }}
          >
            <thead>
              <tr>
                <th
                  scope="col"
                  className="pixel-text"
                  style={{
                    color: dayTheme.colors.coin,
                    padding: `${pixelGrid.px2} ${pixelGrid.px2}`,
                    textAlign: "left",
                    borderBottom: `2px solid ${dayTheme.colors.border}`,
                  }}
                >
                  RANK
                </th>
                <th
                  scope="col"
                  className="pixel-text"
                  style={{
                    color: dayTheme.colors.coin,
                    padding: `${pixelGrid.px2} ${pixelGrid.px2}`,
                    textAlign: "left",
                    borderBottom: `2px solid ${dayTheme.colors.border}`,
                  }}
                >
                  NAME
                </th>
                <th
                  scope="col"
                  className="pixel-text"
                  style={{
                    color: dayTheme.colors.coin,
                    padding: `${pixelGrid.px2} ${pixelGrid.px2}`,
                    textAlign: "right",
                    borderBottom: `2px solid ${dayTheme.colors.border}`,
                  }}
                >
                  SCORE
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="pixel-text"
                    style={{
                      color: dayTheme.colors.text,
                      padding: `${pixelGrid.px4} ${pixelGrid.px2}`,
                      textAlign: "center",
                      opacity: 0.7,
                    }}
                  >
                    NO SCORES YET
                  </td>
                </tr>
              ) : (
                leaderboard.map((row, index) => (
                  <tr
                    key={row.id}
                    style={{
                      background: index % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent",
                    }}
                  >
                    <th
                      scope="row"
                      className="pixel-text"
                      style={{
                        color: index === 0 ? dayTheme.colors.coin : dayTheme.colors.text,
                        padding: `${pixelGrid.px2} ${pixelGrid.px2}`,
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      {index + 1}
                    </th>
                    <td
                      className="pixel-text"
                      style={{
                        color: dayTheme.colors.text,
                        padding: `${pixelGrid.px2} ${pixelGrid.px2}`,
                        textAlign: "left",
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.player_name}
                    </td>
                    <td
                      className="pixel-text"
                      style={{
                        color: dayTheme.colors.text,
                        padding: `${pixelGrid.px2} ${pixelGrid.px2}`,
                        textAlign: "right",
                      }}
                    >
                      {String(row.score).padStart(6, "0")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
