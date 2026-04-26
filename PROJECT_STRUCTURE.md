# 📁 Project Structure

## Overview
This portfolio is built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## 🗂️ Folder Structure

```
portfolio/
├── app/
│   ├── components/
│   │   ├── layout/           # Layout components (Navbar, Footer)
│   │   │   ├── navbar.tsx
│   │   │   └── footer.tsx
│   │   ├── sections/         # Main page sections
│   │   │   ├── hero.tsx      # Hero/Personal Info section
│   │   │   ├── skills.tsx    # Skills section
│   │   │   ├── projects.tsx  # Projects section
│   │   │   └── contact.tsx   # Contact form section
│   │   └── ui/               # Reusable UI components
│   │       ├── scroll-progress.tsx
│   │       └── notification-toast.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── use-mouse-position.tsx
│   │   └── use-tilt.tsx
│   ├── lib/                  # Utilities and data
│   │   ├── constants.ts      # App constants (colors, links, etc.)
│   │   └── data.ts           # Projects and skills data
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── public/
│   └── Images/               # Project images
├── contact-form.gs           # Google Apps Script for contact form
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 📦 Component Organization

### **Layout Components** (`app/components/layout/`)
- `navbar.tsx` - Navigation bar with mobile menu
- `footer.tsx` - Footer with copyright

### **Section Components** (`app/components/sections/`)
- `hero.tsx` - Hero section with introduction and CTAs
- `skills.tsx` - Technical and professional skills display
- `projects.tsx` - Project showcase with cards
- `contact.tsx` - Contact form with social links

### **UI Components** (`app/components/ui/`)
- `scroll-progress.tsx` - Circular scroll progress indicator
- `notification-toast.tsx` - Toast notification for messages

### **Hooks** (`app/hooks/`)
- `use-mouse-position.tsx` - Track mouse position
- `use-tilt.tsx` - 3D tilt effect for cards

### **Library** (`app/lib/`)
- `constants.ts` - Colors, links, navigation, API URLs
- `data.ts` - Projects and skills data arrays

## 🎨 Color Palette

### Primary (Green)
- `#9cbd09` - Main brand color
- `#7a9a07` - Dark variant
- `#b8d42e` - Light variant

### Secondary (Blue)
- `#0ea5e9` - Tech/trust color
- `#0284c7` - Dark variant

### Accent (Orange)
- `#f97316` - CTA/energy color
- `#ea580c` - Dark variant

## 🚀 Key Features

- ✅ Fully responsive design
- ✅ Professional light theme
- ✅ 3-color system (Green, Blue, Orange)
- ✅ Smooth transitions (no looping animations)
- ✅ Contact form with Google Apps Script backend
- ✅ Project showcase with hover effects
- ✅ Skills categorization with color coding
- ✅ Mobile-friendly navigation

## 📝 How to Add Content

### Add a New Project
Edit `app/lib/data.ts` and add to the `projects` array:
```typescript
{
  title: "Project Name",
  description: "Project description...",
  tech: ["Tech1", "Tech2"],
  image: "/Images/project.png",
  link: "https://project-url.com",
  accent: COLORS.primary.green, // or blue/orange
}
```

### Add a New Skill
Edit `app/lib/data.ts` and add to `technicalSkills` or `professionalSkills`:
```typescript
{
  name: "Skill Name",
  icon: IconComponent,
  items: ["Item1", "Item2"],
  color: COLORS.primary.green,
}
```

### Update Contact Info
Edit `app/lib/constants.ts`:
```typescript
export const CONTACT_INFO = {
  email: "your@email.com",
  phone: "+1234567890",
};
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📧 Contact Form Setup

The contact form uses Google Apps Script. To update:
1. Edit `contact-form.gs`
2. Deploy as web app in Google Apps Script
3. Update `APPS_SCRIPT_URL` in `app/lib/constants.ts`

## 🎯 Best Practices

- Keep components small and focused
- Use constants from `lib/constants.ts`
- Store data in `lib/data.ts`
- Follow existing naming conventions
- Use TypeScript for type safety
- Keep styles in Tailwind classes
