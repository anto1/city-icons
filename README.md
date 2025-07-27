# City Icons Collection

A beautiful collection of line art SVG icons representing cities around the world by Studio Partdirector.

## 🌍 Live Demo

Visit the live site: [City Icons Collection](https://cities.partdirector.ch)

## 🎨 Features

- **43 City Icons** - Beautiful line art representations
- **Search Functionality** - Find cities quickly
- **Download SVGs** - Get icons for your projects
- **Copy SVG Code** - Easy integration
- **Responsive Design** - Works on all devices
- **Privacy-First Analytics** - Fathom Analytics integration

## 🚀 Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **Fathom Analytics** - Privacy-focused analytics
- **Vercel** - Deployment platform

## 📋 Usage & Licensing

### Free Personal Use

You're welcome to use these city icons for personal projects, presentations, and non-commercial purposes with attribution.

**Required Attribution:**
"City icons by Studio Partdirector" ([cities.partdirector.ch](https://cities.partdirector.ch))

### Commercial Use

Planning to use these icons in a commercial project, client work, or product? We'd love to hear about it!

Commercial licensing ensures you get:
- Full usage rights without attribution requirements
- Priority support for custom requests
- Peace of mind for your business

**Contact for Commercial Licensing:**
[cities@partdirector.ch](mailto:cities@partdirector.ch)

### What We Consider Commercial

- Client work and agency projects
- Products and services you sell
- Commercial websites and applications
- Marketing materials for businesses
- Any use that generates revenue

## 🛠️ Development

### Getting Started

```bash
# Clone the repository
git clone https://github.com/anto1/city-icons.git

# Install dependencies
npm install

# Run development server
npm run dev
```

### Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── license/        # License page
│   └── fathom.tsx      # Analytics component
├── components/         # React components
│   ├── ClientHome.tsx  # Main client component
│   ├── IconGrid.tsx    # Icon grid display
│   ├── IconModal.tsx   # Icon details modal
│   └── SearchBar.tsx   # Search functionality
├── data/              # Static data
│   └── icons.json     # Icon metadata
├── types/             # TypeScript types
│   └── index.ts       # Type definitions
└── lib/               # Utilities
    └── sanity.ts      # Sanity CMS integration
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FATHOM_ID=your_fathom_id
```

## 📊 Analytics

This project uses [Fathom Analytics](https://usefathom.com/) for privacy-focused analytics:

- **No cookies** or tracking scripts
- **GDPR compliant**
- **Minimal performance impact**
- **City-specific event tracking**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under a custom license. See the [Usage & Licensing](/license) page for details.

## 🌟 Support

- **Missing your city?** [Request it here](mailto:icons@partdirector.ch)
- **Commercial licensing?** [Contact us](mailto:cities@partdirector.ch)
- **Found a bug?** [Open an issue](https://github.com/anto2s/city-icons/issues)

---

Made with ❤️ by [Studio Partdirector](https://partdirector.ch)
