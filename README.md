# Purchase Tracker - Phase 3

A clean, minimal purchase tracking application with hierarchical sub-products support and the Charcoal Gradient theme.

## Features

### Phase 1 (Core Features)
- **Multiple People**: Add unlimited people to track purchases for
- **Full CRUD Operations**: Add, edit, delete people and products
- **Multiple Links**: Each product can have multiple links
- **Auto Tax Calculation**: 10% tax automatically calculated
- **Running Totals**: Per-person and grand total automatically updated
- **Excel Export**: Download all data as an Excel spreadsheet
- **Local Storage**: Data persists in your browser

### Phase 2 (Responsive Design)
- **Responsive Layout**: Automatic screen detection
- **Desktop Table View**: Full table with all columns (>1024px)
- **Mobile Card View**: Touch-friendly cards (<1024px)
- **Adaptive Actions**: Hover-based on desktop, always-visible on mobile
- **Touch Optimized**: Minimum 44px touch targets

### Phase 3 (Hierarchical Sub-Products) ✨ NEW
- **Sub-Products**: Add unlimited sub-products within any product
- **Visual Hierarchy**: Indented display with expand/collapse
- **Recursive Calculations**: Totals include all nested products
- **Hierarchical Export**: Excel exports show proper indentation
- **Full Sub-Product CRUD**: Edit, delete, add links to sub-products

## How to Use

### Managing People
- Click **"+ Add Person"** to add a new person
- Click on a person's name to edit it
- Click the **🗑** button to delete a person

### Managing Products
- Click **"+ Product"** next to a person's name to add a product
- Click on any product name, price, or link to edit it
- Click **"Delete"** to remove a product
- Click **"+ Add link"** to add multiple links to a product

### Managing Sub-Products (NEW!)
- **Add**: Hover over any product → Click the small **+** icon → Enter sub-product name
- **Expand/Collapse**: Click the **›** arrow next to products with sub-products
- **Edit**: Click on sub-product name or price to edit
- **Delete**: Click trash icon to remove sub-product

### Use Cases
- **Product Comparisons**: Compare multiple brands/options
- **Bundle Packages**: Group related items
- **Category Organization**: Organize products by type
- **Multi-Person Orders**: Track individual orders in a group purchase

### Exporting Data
- Click **"Export Excel"** to download all data as an .xlsx file
- Choose "Export All" or individual person exports
- Sub-products appear indented in Excel

## Deploying to Netlify

### Option 1: Drag and Drop
1. Run `npm install` then `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `dist` folder to deploy

### Option 2: Connect Git Repository
1. Push this folder to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Netlify will auto-detect the build settings

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
npm install
npm run build
netlify deploy --prod
```

## Local Development

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- XLSX (for Excel export)

## Project Structure

```
purchase-tracker-phase3/
├── src/
│   ├── App.jsx          # Main application with sub-products feature
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind CSS + custom styles
├── index.html           # HTML entry point
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── netlify.toml         # Netlify deployment config
└── README.md           # This file
```

## Development Roadmap

- ✅ Phase 1: Core Features
- ✅ Phase 2: Responsive Design
- ✅ Phase 3 Feature 1: Sub-Products with Hierarchical Structure
- ⏳ Phase 3 Feature 2: Price Range Support
- ⏳ Phase 3 Feature 3: Drag-and-Drop Reordering
- ⏳ Phase 3 Feature 4: Google Account Sync

## License

Private project
