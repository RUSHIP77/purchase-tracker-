# Purchase Tracker

A clean, minimal purchase tracking application with the Charcoal Gradient theme.

## Features

- **Multiple People**: Add unlimited people to track purchases for
- **Full CRUD Operations**: Add, edit, delete people and products
- **Multiple Links**: Each product can have multiple links
- **Auto Tax Calculation**: 10% tax automatically calculated
- **Running Totals**: Per-person and grand total automatically updated
- **Excel Export**: Download all data as an Excel spreadsheet
- **Local Storage**: Data persists in your browser

## How to Use

### Managing People
- Click **"+ Add Person"** to add a new person
- Click on a person's name to edit it
- Click the **âœ•** button to delete a person

### Managing Products
- Click **"+ Product"** next to a person's name to add a product
- Click on any product name, price, or link to edit it
- Click **"Delete"** to remove a product
- Click **"+ Add link"** to add multiple links to a product

### Exporting Data
- Click **"Export Excel"** to download all data as an .xlsx file

## Deploying to Netlify

### Option 1: Drag and Drop
1. Run `npm install` then `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `dist` folder to deploy

### Option 2: Connect Git Repository
1. Push this folder to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" â†’ "Import an existing project"
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
