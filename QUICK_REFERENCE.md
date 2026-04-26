# 🚀 Quick Reference Guide

## 📂 Where to Find Things

### **Want to edit the homepage?**
→ `app/page.tsx`

### **Want to change colors?**
→ `app/lib/constants.ts` (COLORS object)

### **Want to add/edit projects?**
→ `app/lib/data.ts` (projects array)

### **Want to add/edit skills?**
→ `app/lib/data.ts` (technicalSkills or professionalSkills)

### **Want to edit the navbar?**
→ `app/components/layout/navbar.tsx`

### **Want to edit the hero section?**
→ `app/components/sections/hero.tsx`

### **Want to edit the contact form?**
→ `app/components/sections/contact.tsx`
→ `app/lib/constants.ts` (APPS_SCRIPT_URL)

### **Want to change social links?**
→ `app/lib/constants.ts` (SOCIAL_LINKS object)

### **Want to edit global styles?**
→ `app/globals.css`

### **Want to configure Tailwind?**
→ `tailwind.config.ts`

## 🎨 Color Usage Guide

```typescript
// In your components, import colors:
import { COLORS } from "@/app/lib/constants";

// Use them:
style={{ color: COLORS.primary.green }}
className="text-[#9cbd09]" // or use hex directly
```

### Color Meanings:
- **Green** (`#9cbd09`) - Primary brand, success, main CTAs
- **Blue** (`#0ea5e9`) - Tech, trust, links, secondary actions
- **Orange** (`#f97316`) - Energy, important CTAs, highlights

## 📝 Common Tasks

### Add a New Section
1. Create file in `app/components/sections/your-section.tsx`
2. Export it in `app/components/sections/index.ts`
3. Import and use in `app/page.tsx`

### Add a New UI Component
1. Create file in `app/components/ui/your-component.tsx`
2. Export it in `app/components/ui/index.ts`
3. Import where needed

### Update Contact Form Backend
1. Edit `contact-form.gs`
2. Deploy in Google Apps Script
3. Copy new URL to `app/lib/constants.ts` → `APPS_SCRIPT_URL`

## 🔍 File Locations

```
app/
├── components/
│   ├── layout/          ← Navbar, Footer
│   ├── sections/        ← Hero, Skills, Projects, Contact
│   └── ui/              ← Reusable components
├── hooks/               ← Custom React hooks
├── lib/
│   ├── constants.ts     ← Colors, links, URLs
│   └── data.ts          ← Projects & skills data
├── globals.css          ← Global styles
├── layout.tsx           ← Root layout
└── page.tsx             ← Homepage
```

## 🎯 Import Shortcuts

```typescript
// Clean imports using index files:
import { Hero, Skills, Projects, Contact } from "@/app/components/sections";
import { Navbar, Footer } from "@/app/components/layout";
import { ScrollProgress, NotificationToast } from "@/app/components/ui";
import { COLORS, SOCIAL_LINKS, NAV_LINKS } from "@/app/lib/constants";
import { projects, technicalSkills } from "@/app/lib/data";
```

## 🛠️ Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

## 📦 Project Structure Benefits

✅ **Easy to find** - Logical folder organization
✅ **Easy to scale** - Add new sections/components easily
✅ **Easy to maintain** - Centralized data and constants
✅ **Clean imports** - Index files for cleaner code
✅ **Type-safe** - TypeScript throughout
✅ **Reusable** - Shared components in ui/

## 🎨 Styling Guidelines

- Use Tailwind classes for styling
- Store colors in `constants.ts`
- Use inline styles only for dynamic colors
- Keep consistent spacing (px-6, py-24, etc.)
- Use rounded-xl, rounded-2xl, rounded-3xl for corners
- Use shadow-sm, shadow-md, shadow-lg for depth

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `md:` (768px), `lg:` (1024px)
- Test on mobile, tablet, desktop
- Use `flex-col md:flex-row` for responsive layouts
