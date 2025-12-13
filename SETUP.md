# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Then open http://localhost:5173 in your browser

### 3. Build for Production
```bash
npm run build
```
This creates a `dist` folder with optimized production files.

### 4. Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure
```
purchase-tracker/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles + Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
├── postcss.config.js    # PostCSS config
└── netlify.toml         # Netlify deployment config
```

## 🌐 Deploy to Netlify

### Option 1: Drag & Drop
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder

### Option 2: Connect Git
1. Push to GitHub/GitLab
2. Import in Netlify
3. Auto-deploys on every push

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

## 🛠️ Tech Stack
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **XLSX** - Excel export functionality
- **localStorage** - Data persistence

## 📱 Features
- Multi-person purchase tracking
- Auto tax calculation (10%)
- Excel export (individual & combined)
- Responsive design (mobile + desktop)
- Real-time totals
- Persistent data storage

## 🎯 Next Steps
Ready to add more features? Check the main README.md for the full feature roadmap!
