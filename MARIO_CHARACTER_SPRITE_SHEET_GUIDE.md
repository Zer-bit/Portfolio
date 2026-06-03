# Mario Character Sprite Sheet Guide

## Character Dimensions

### Canvas Size
- **Width**: 32 pixels
- **Height**: 48 pixels

### Design Grid
The character is drawn on an internal **16 × 24 design grid**, which is then scaled to fit the 32×48 canvas:
- **Design Grid Width**: 16 units
- **Design Grid Height**: 24 units
- **Scale Factor X**: 32 ÷ 16 = **2.0**
- **Scale Factor Y**: 48 ÷ 24 = **2.0**

This means each design grid unit = 2 pixels on the final canvas.

---

## Character Design Breakdown

### Head & Face (Grid Y: 0-10)
- **Hat Crown**: Grid position (2, 0), size 10×3 units → **20×6 pixels**
  - Color: Mario Red (#e74c3c)
- **Hat Brim**: Grid position (1, 3), size 13×2 units → **26×4 pixels**
  - Color: Mario Red (#e74c3c)
- **Head/Skin**: Grid position (3, 5), size 9×6 units → **18×12 pixels**
  - Color: Tan (#f4a460)
- **Nose Bump**: Grid position (11, 7), size 2×2 units → **4×4 pixels**
  - Color: Tan (#f4a460)
- **Eye Black**: Grid position (9, 6), size 3×2 units → **6×4 pixels**
  - Color: Black (#000000)
- **Eye Shine**: Grid position (10, 6), size 1×1 units → **2×2 pixels**
  - Color: White (#ffffff)
- **Mustache**: Grid position (7, 10), size 6×2 units → **12×4 pixels**
  - Color: Brown (#8B4513)

### Body (Grid Y: 11-17)
- **Overalls/Body**: Grid position (3, 11), size 10×7 units → **20×14 pixels**
  - Color: Blue (#0000cd)

### Arms (Grid Y: 11-16)
- **Back Arm**: Grid position (2, 11), size 3×5 units → **6×10 pixels**
  - Color: Mario Red (#e74c3c)
- **Front Arm (Frame 0 - Forward)**: Grid position (11, 12), size 3×4 units → **6×8 pixels**
  - Color: Mario Red (#e74c3c)
- **Front Arm (Frame 1 - Back)**: Grid position (11, 13), size 3×4 units → **6×8 pixels**
  - Color: Mario Red (#e74c3c)

### Legs & Shoes (Grid Y: 18-24)

#### Frame 0 (Walk Cycle - Back leg forward)
- **Back Leg (Forward)**: Grid position (3, 18), size 4×6 units → **8×12 pixels**
  - Color: Blue (#0000cd)
- **Front Leg (Back, Lifted)**: Grid position (8, 18), size 4×4 units → **8×8 pixels**
  - Color: Blue (#0000cd)
- **Back Shoe**: Grid position (3, 22), size 5×2 units → **10×4 pixels**
  - Color: Brown (#5c3317)
- **Front Shoe (Lifted)**: Grid position (8, 20), size 5×2 units → **10×4 pixels**
  - Color: Brown (#5c3317)

#### Frame 1 (Walk Cycle - Front leg forward)
- **Front Leg (Forward)**: Grid position (8, 18), size 4×6 units → **8×12 pixels**
  - Color: Blue (#0000cd)
- **Back Leg (Back, Lifted)**: Grid position (3, 18), size 4×4 units → **8×8 pixels**
  - Color: Blue (#0000cd)
- **Front Shoe**: Grid position (8, 22), size 5×2 units → **10×4 pixels**
  - Color: Brown (#5c3317)
- **Back Shoe (Lifted)**: Grid position (3, 20), size 5×2 units → **10×4 pixels**
  - Color: Brown (#5c3317)

---

## Sprite Sheet Recommendations

### Option 1: Single Frame (Static)
- **Canvas Size**: 32×48 pixels
- **Best for**: Testing the character design
- **Format**: PNG with transparency

### Option 2: Walk Cycle (2 Frames)
- **Canvas Size**: 64×48 pixels (2 frames side-by-side)
- **Frame 1 (0-31px)**: Back leg forward
- **Frame 2 (32-63px)**: Front leg forward
- **Best for**: Animated walking
- **Format**: PNG with transparency

### Option 3: Full Animation Sheet (Multiple Directions)
- **Canvas Size**: 128×96 pixels (4 directions × 2 frames)
- **Row 1 (0-47px)**: Facing Right - Walk Cycle
- **Row 2 (48-95px)**: Facing Left - Walk Cycle
- **Columns**: Frame 0 (0-31px), Frame 1 (32-63px), Frame 2 (64-95px), Frame 3 (96-127px)
- **Best for**: Full directional movement
- **Format**: PNG with transparency

---

## Color Palette

| Part | Color | Hex Code | RGB |
|------|-------|----------|-----|
| Hat/Shirt | Mario Red | #e74c3c | (231, 76, 60) |
| Head/Nose | Tan | #f4a460 | (244, 164, 96) |
| Overalls/Legs | Blue | #0000cd | (0, 0, 205) |
| Shoes | Brown | #5c3317 | (92, 51, 23) |
| Eye | Black | #000000 | (0, 0, 0) |
| Eye Shine | White | #ffffff | (255, 255, 255) |
| Mustache | Brown | #8B4513 | (139, 69, 19) |

---

## Implementation Notes

1. **Mirroring**: The character automatically mirrors horizontally when facing left. The rendering code handles this via the `player.facingRight` flag.

2. **Animation**: The character has a 2-frame walk cycle controlled by `player.animFrame` (0 or 1), which toggles every 0.1 seconds.

3. **Scaling**: The design grid approach allows the character to scale smoothly to any size by adjusting the scale factors (currently 2.0 for both X and Y).

4. **Transparency**: All sprite sheets should use PNG format with transparency around the character.

5. **Pixel Perfect**: Use pixel-perfect rendering (no anti-aliasing) to maintain the retro 8-bit aesthetic.

---

## File Locations

- **Game Component**: `app/components/game/MarioGame.tsx` (lines 230-310)
- **Player Module**: `app/lib/game/player.ts`
- **Rendering Function**: `renderFrame()` in MarioGame.tsx

---

## Next Steps

1. Create your sprite sheet using the dimensions and color palette above
2. Export as PNG with transparency
3. Place in `public/sprites/` directory
4. Update the rendering code to use the sprite sheet instead of drawing primitives
5. Test the animation with the walk cycle frames

