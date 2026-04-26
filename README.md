# 🚀 Jezer Parales - Portfolio

A modern, professional portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- 🎨 Clean, professional design with light theme
- 🎯 3-color system (Green, Blue, Orange)
- 📱 Fully responsive across all devices
- ⚡ Fast performance with Next.js 15
- 🎭 Smooth transitions and hover effects
- 📧 Working contact form with Google Apps Script
- 🔍 SEO optimized
- ♿ Accessible design

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Backend:** Google Apps Script (Contact Form)

## 📁 Project Structure

```
app/
├── components/
│   ├── layout/          # Navbar, Footer
│   ├── sections/        # Hero, Skills, Projects, Contact
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/
│   ├── constants.ts     # App constants
│   └── data.ts          # Projects & skills data
├── globals.css          # Global styles
├── layout.tsx           # Root layout
└── page.tsx             # Homepage
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/Zer-bit/portfolio.git
cd portfolio
```

2. Install dependencies
```bash
npm install
```

3. Run development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Customization

### Update Personal Information

Edit `app/lib/constants.ts`:
```typescript
export const CONTACT_INFO = {
  email: "your@email.com",
  phone: "+1234567890",
};

export const SOCIAL_LINKS = {
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  // ...
};
```

### Add/Edit Projects

Edit `app/lib/data.ts` - `projects` array:
```typescript
{
  title: "Project Name",
  description: "Description...",
  tech: ["Tech1", "Tech2"],
  image: "/Images/project.png",
  link: "https://project-url.com",
  accent: COLORS.primary.green,
}
```

### Add/Edit Skills

Edit `app/lib/data.ts` - `technicalSkills` or `professionalSkills` arrays

### Change Colors

Edit `app/lib/constants.ts` - `COLORS` object

## 📧 Contact Form Setup

1. Create a Google Apps Script project
2. Copy code from `contact-form.gs`
3. Deploy as web app
4. Update `APPS_SCRIPT_URL` in `app/lib/constants.ts`

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Deploy to Other Platforms

The project works on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Digital Ocean

## 📚 Documentation

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Detailed project structure
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick reference guide

## 🎨 Color Palette

- **Primary Green:** `#9cbd09` - Brand, success
- **Secondary Blue:** `#0ea5e9` - Tech, trust
- **Accent Orange:** `#f97316` - Energy, CTAs

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Jezer Mantilla Parales**

- GitHub: [@Zer-bit](https://github.com/Zer-bit)
- LinkedIn: [Jezer Parales](https://www.linkedin.com/in/jezer-parales-201488386)
- Email: jezermantilla263026@gmail.com

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Animations with [Framer Motion](https://www.framer.com/motion/)

---

⭐ Star this repo if you find it helpful!
