# Sprite Sheet Integration Guide

## Step 1: Export Your Sprite Sheet from LibreSprite

1. **File → Export As**
2. **Filename**: `mario-walk-cycle.png`
3. **Location**: Save to `public/sprites/` directory
4. **Settings**:
   - Format: PNG
   - Interlaced: No
   - Compression: 9
   - Keep transparency

Your sprite sheet should be:
- **Width**: 64 pixels (2 frames × 32px each)
- **Height**: 48 pixels
- **Frame 0** (0-31px): Back leg forward
- **Frame 1** (32-63px): Front leg forward

---

## Step 2: Create Sprite Loader Utility

Create a new file: `app/lib/game/spriteLoader.ts`

```typescript
/**
 * Sprite loader utility for the Mario game
 * Handles loading and caching sprite images
 */

let spriteCache: Record<string, HTMLImageElement> = {};

export async function loadSprite(path: string): Promise<HTMLImageElement> {
  if (spriteCache[path]) {
    return spriteCache[path];
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      spriteCache[path] = img;
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error(`Failed to load sprite: ${path}`));
    };
    img.src = path;
  });
}

export function clearSpriteCache(): void {
  spriteCache = {};
}
```

---

## Step 3: Update MarioGame.tsx

Replace the player rendering section (lines 230-310) with sprite-based rendering.

### Add at the top of the component:

```typescript
// Add this with other refs
const spriteRef = useRef<HTMLImageElement | null>(null);
const spriteLoadErrorRef = useRef<string | null>(null);

// Add this useEffect to load the sprite on mount
useEffect(() => {
  const loadSprite = async () => {
    try {
      const img = new Image();
      img.onload = () => {
        spriteRef.current = img;
      };
      img.onerror = () => {
        spriteLoadErrorRef.current = "Failed to load sprite sheet";
        console.error("Failed to load sprite sheet at /sprites/mario-walk-cycle.png");
      };
      img.src = "/sprites/mario-walk-cycle.png";
    } catch (error) {
      spriteLoadErrorRef.current = error instanceof Error ? error.message : "Unknown error";
    }
  };
  loadSprite();
}, []);
```

### Replace the player rendering code (lines 230-310):

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

## Step 4: File Structure

After completing these steps, your project structure should look like:

```
project/
├── public/
│   └── sprites/
│       └── mario-walk-cycle.png  ← Your sprite sheet
├── app/
│   ├── lib/
│   │   └── game/
│   │       ├── spriteLoader.ts   ← New utility
│   │       ├── player.ts
│   │       ├── physics.ts
│   │       └── utils.ts
│   └── components/
│       └── game/
│           └── MarioGame.tsx     ← Updated
```

---

## Step 5: Testing

1. **Save your sprite sheet** as `public/sprites/mario-walk-cycle.png`
2. **Update MarioGame.tsx** with the sprite rendering code
3. **Run the game** and verify:
   - Character appears with your sprite
   - Walk cycle animates smoothly
   - Character mirrors correctly when facing left
   - No console errors about missing sprites

---

## Troubleshooting

### Sprite not appearing?
- Check browser console for errors
- Verify file path: `/sprites/mario-walk-cycle.png`
- Ensure sprite sheet is 64×48 pixels
- Check that transparency is preserved

### Animation not smooth?
- Verify sprite sheet has exactly 2 frames
- Check that `player.animFrame` is toggling between 0 and 1
- Ensure frame duration is 0.1 seconds

### Character looks stretched?
- Verify sprite sheet dimensions are exactly 64×48
- Check that player.width = 32 and player.height = 48
- Ensure no scaling is applied elsewhere

### Mirroring not working?
- Verify `player.facingRight` is being set correctly
- Check that `ctx.scale(-1, 1)` is applied before drawing
- Ensure `ctx.restore()` is called after drawing

---

## Optional Enhancements

### Add Jump Animation
Create a 3-frame sprite sheet (96×48) with:
- Frame 0: Walk cycle frame 1
- Frame 1: Walk cycle frame 2
- Frame 2: Jump pose

Update the frame selection logic:
```typescript
let frameIndex = player.animFrame;
if (!player.isGrounded) {
  frameIndex = 2; // Jump frame
}
```

### Add Idle Animation
Add a 4th frame for when the player is standing still:
```typescript
let frameIndex = player.animFrame;
if (!player.isGrounded) {
  frameIndex = 2; // Jump
} else if (player.vx === 0) {
  frameIndex = 3; // Idle
}
```

---

## Code Comparison

### Before (Primitive Drawing)
```typescript
pr(2, 0, 10, 3, dayTheme.colors.mario);  // Hat crown
pr(1, 3, 13, 2, dayTheme.colors.mario);  // Hat brim
pr(3, 5, 9, 6, "#f4a460");               // Head
// ... 20+ more lines of primitive drawing
```

### After (Sprite Sheet)
```typescript
ctx.drawImage(
  spriteRef.current,
  frameIndex * 32, 0,  // Source X, Y
  32, 48,              // Source width, height
  px, py,              // Destination X, Y
  pw, ph               // Destination width, height
);
```

Much cleaner and more performant! ✨

