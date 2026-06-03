# Mario Sprite Sheet - Quick Reference Card

## 📐 Canvas Dimensions
```
┌─────────────────────────────────────┐
│  32px × 48px (per frame)            │
│  64px × 48px (total with 2 frames)  │
└─────────────────────────────────────┘
```

## 🎨 Color Palette

| Part | Color | Hex | RGB |
|------|-------|-----|-----|
| Hat/Shirt | Red | #E74C3C | 231, 76, 60 |
| Head | Tan | #F4A460 | 244, 164, 96 |
| Overalls/Legs | Blue | #0000CD | 0, 0, 205 |
| Shoes | Brown | #5C3317 | 92, 51, 23 |
| Eyes | Black | #000000 | 0, 0, 0 |
| Eye Shine | White | #FFFFFF | 255, 255, 255 |
| Mustache | Brown | #8B4513 | 139, 69, 19 |

## 🚶 Frame Layout

```
Frame 0 (0-31px)          Frame 1 (32-63px)
Back leg forward          Front leg forward
Front leg lifted          Back leg lifted
Front arm forward         Front arm back
```

## 📏 Body Part Sizes (in pixels)

```
Hat Crown:        20×6
Hat Brim:         26×4
Head:             18×12
Eye:              6×4 (black) + 2×2 (shine)
Mustache:         12×4
Body:             20×14
Back Arm:         6×10
Front Arm:        6×8
Legs:             8×12 (forward) / 8×8 (lifted)
Shoes:            10×4 each
```

## 🎬 Animation Frames

| Frame | Leg Position | Arm Position | Use |
|-------|--------------|--------------|-----|
| 0 | Back forward, Front lifted | Front forward | Walk cycle 1 |
| 1 | Front forward, Back lifted | Front back | Walk cycle 2 |

**Duration**: 0.1 seconds per frame (10 FPS)

## 📁 File Locations

- **Sprite Sheet**: `public/sprites/mario-walk-cycle.png`
- **Game Component**: `app/components/game/MarioGame.tsx`
- **Player Module**: `app/lib/game/player.ts`

## ✅ Checklist Before Integration

- [ ] Sprite sheet is 64×48 pixels
- [ ] Frame 0 (0-31px): Back leg forward
- [ ] Frame 1 (32-63px): Front leg forward
- [ ] All colors match the palette
- [ ] Transparency is preserved (PNG with alpha)
- [ ] File saved as `public/sprites/mario-walk-cycle.png`
- [ ] No anti-aliasing (pixel-perfect)

## 🔧 Integration Steps

1. Export sprite sheet from LibreSprite as PNG
2. Save to `public/sprites/mario-walk-cycle.png`
3. Update `app/components/game/MarioGame.tsx` with sprite rendering code
4. Test in browser
5. Verify walk cycle animation works
6. Check mirroring when facing left

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Sprite not showing | Check file path and browser console |
| Animation stutters | Verify frame duration is 0.1s |
| Character stretched | Ensure sprite is exactly 64×48 |
| Mirroring broken | Check `player.facingRight` flag |
| Blurry sprite | Disable anti-aliasing in LibreSprite |

## 📊 Design Grid Reference

The character is drawn on a 16×24 design grid, scaled 2:1 to 32×48 pixels.

```
Design Grid (16×24)          Canvas (32×48)
┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │
│   Hat (2-12, 0-5)│         │   Hat (4-24, 0-10)│
│   Head (3-12, 5-11)│       │   Head (6-24, 10-22)│
│   Body (3-13, 11-18)│      │   Body (6-26, 22-36)│
│   Legs (3-12, 18-24)│      │   Legs (6-24, 36-48)│
│                  │         │                  │
└──────────────────┘         └──────────────────┘
```

## 🎯 Pro Tips

1. **Use LibreSprite's Grid**: Set to 32×48 to align frames
2. **Use Layers**: Separate layers for each body part
3. **Use Onion Skin**: See both frames while drawing
4. **Pixel Perfect**: Use 1px pencil brush only
5. **Test Early**: Export and test in browser frequently

## 📞 Need Help?

Once you finish the sprite sheet:
1. Save it to `public/sprites/mario-walk-cycle.png`
2. Let me know, and I'll update the game code
3. We'll test the integration together

Good luck! 🎮✨

