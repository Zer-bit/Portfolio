# Ready-to-Use Sprite Integration Code

## Copy-Paste Code for MarioGame.tsx

### Step 1: Add Sprite Ref (near top of component, with other refs)

Find this section:
```typescript
const spriteRef = useRef<HTMLCanvasElement>(null);
const containerRef = useRef<HTMLDivElement>(null);
```

Add this line after the other refs:
```typescript
const spriteRef = useRef<HTMLImageElement | null>(null);
const spriteLoadErrorRef = useRef<string | null>(null);
```

---

### Step 2: Add Sprite Loading Effect

Find the first `useEffect` in the component (around line 400-450).

Add this new `useEffect` after the canvas setup effect:

```typescript
// Load sprite sheet on mount
useEffect(() => {
  const img = new Image();
  img.onload = () => {
    spriteRef.current = img;
  };
  img.onerror = () => {
    spriteLoadErrorRef.current = "Failed to load sprite sheet";
    console.error("Failed to load sprite sheet at /sprites/mario-walk-cycle.png");
  };
  img.src = "/sprites/mario-walk-cycle.png";
}, []);
```

---

### Step 3: Replace Player Rendering Code

Find this section in the `renderFrame` function (around line 230-310):

```typescript
// 6. Player — side-view pixel-art character (facing left or right)
const px = player.x;
const py = player.y;
const pw = player.width;
const ph = player.height;

// Scale factor: design grid is 16 wide × 24 tall
const sx = pw / 16;
const sy = ph / 24;

// Helper: draw a scaled rect using design-grid coordinates
const pr = (gx: number, gy: number, gw: number, gh: number, color: string) => {
  ctx.fillStyle = color;
  // Mirror horizontally when facing left
  const drawX = player.facingRight
    ? Math.round(px + gx * sx)
    : Math.round(px + (16 - gx - gw) * sx);
  ctx.fillRect(drawX, Math.round(py + gy * sy), Math.round(gw * sx), Math.round(gh * sy));
};

// ── HAT ──────────────────────────────────────────────────────────────────
// Crown (sits on top of head, slightly inset from front)
pr(2, 0, 10, 3, dayTheme.colors.mario);
// Brim (wider, sticks out toward the front)
pr(1, 3, 13, 2, dayTheme.colors.mario);

// ── HEAD / FACE ───────────────────────────────────────────────────────────
// Skin — full head block
pr(3, 5, 9, 6, "#f4a460");
// Nose bump (front of face)
pr(11, 7, 2, 2, "#f4a460");

// ── EYE (single, front-facing side) ──────────────────────────────────────
pr(9, 6, 3, 2, "#000000");   // eye black
pr(10, 6, 1, 1, "#ffffff");  // eye shine

// ── MUSTACHE ─────────────────────────────────────────────────────────────
pr(7, 10, 6, 2, "#8B4513");

// ── BODY (overalls) ──────────────────────────────────────────────────────
pr(3, 11, 10, 7, "#0000cd");

// ── SHIRT / ARMS (red) ───────────────────────────────────────────────────
// Back arm
pr(2, 11, 3, 5, dayTheme.colors.mario);
// Front arm — swings with walk cycle
if (player.animFrame === 0) {
  pr(11, 12, 3, 4, dayTheme.colors.mario); // arm forward
} else {
  pr(11, 13, 3, 4, dayTheme.colors.mario); // arm back
}

// ── LEGS (walk cycle) ────────────────────────────────────────────────────
if (player.animFrame === 0) {
  // Back leg forward, front leg back
  pr(3,  18, 4, 6, "#0000cd");  // back leg (forward stride)
  pr(8,  18, 4, 4, "#0000cd");  // front leg (back stride, shorter = lifted)
  // Shoes (brown)
  pr(3,  22, 5, 2, "#5c3317");  // back shoe
  pr(8,  20, 5, 2, "#5c3317");  // front shoe (lifted)
} else {
  // Front leg forward, back leg back
  pr(8,  18, 4, 6, "#0000cd");  // front leg (forward stride)
  pr(3,  18, 4, 4, "#0000cd");  // back leg (back stride, shorter = lifted)
  // Shoes (brown)
  pr(8,  22, 5, 2, "#5c3317");  // front shoe
  pr(3,  20, 5, 2, "#5c3317");  // back shoe (lifted)
}
```

**Replace ALL of that with:**

```typescript
// 6. Player — sprite-based rendering
const px = player.x;
const py = player.y;
const pw = player.width;
const ph = player.height;

if (spriteRef.current) {
  // Sprite sheet is 64×48 (2 frames of 32×48 each)
  const spriteWidth = 32;
  const spriteHeight = 48;
  
  // Select frame based on animation
  const frameIndex = player.animFrame; // 0 or 1
  const sourceX = frameIndex * spriteWidth;
  const sourceY = 0;
  
  // Draw the sprite
  ctx.save();
  
  // Mirror horizontally if facing left
  if (!player.facingRight) {
    ctx.translate(px + pw, py);
    ctx.scale(-1, 1);
    ctx.drawImage(
      spriteRef.current,
      sourceX,
      sourceY,
      spriteWidth,
      spriteHeight,
      0,
      0,
      pw,
      ph
    );
  } else {
    ctx.drawImage(
      spriteRef.current,
      sourceX,
      sourceY,
      spriteWidth,
      spriteHeight,
      px,
      py,
      pw,
      ph
    );
  }
  
  ctx.restore();
} else if (spriteLoadErrorRef.current) {
  // Fallback: show error indicator
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(px, py, pw, ph);
  ctx.fillStyle = "#ffffff";
  ctx.font = "10px monospace";
  ctx.fillText("NO SPRITE", px + 2, py + 2);
} else {
  // Fallback: show loading indicator (use primitive drawing)
  ctx.fillStyle = dayTheme.colors.mario;
  ctx.fillRect(px, py, pw, ph);
}
```

---

## Summary of Changes

### Files to Modify
1. **`app/components/game/MarioGame.tsx`** - Update rendering code

### Files to Create
1. **`public/sprites/mario-walk-cycle.png`** - Your sprite sheet from LibreSprite

### What Gets Replaced
- ~80 lines of primitive drawing code
- Replaced with ~50 lines of sprite rendering code
- Much cleaner and more performant!

---

## Testing Checklist

After making these changes:

1. ✅ Save `public/sprites/mario-walk-cycle.png`
2. ✅ Update `MarioGame.tsx` with the new code
3. ✅ Open browser console (F12)
4. ✅ Navigate to `/game` page
5. ✅ Verify:
   - Character appears with your sprite
   - Walk cycle animates (legs move)
   - Character mirrors when facing left
   - No red "NO SPRITE" error box
   - No console errors

---

## Fallback Behavior

If the sprite fails to load, the game will:
1. Show a red box with "NO SPRITE" text (error state)
2. Log error to console
3. Game still playable (just no sprite)

This ensures the game doesn't break if the sprite is missing.

---

## Next Steps

1. **Finish your sprite in LibreSprite**
2. **Export as PNG** to `public/sprites/mario-walk-cycle.png`
3. **Copy the code above** into `MarioGame.tsx`
4. **Test in browser**
5. **Let me know if you need adjustments!**

Good luck! 🎮✨

