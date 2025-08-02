# City Icons

A growing collection of minimalist black-and-white city icons — drawn in a consistent line-art style and based on iconic landmarks, symbols, or shapes unique to each city.

Originally started as a quick design task for a community meetup site, the project quickly turned into something bigger. One icon led to another… and now it's 100 (and counting).

Each icon is:
- Hand-drawn in a square, stroke-based style
- Saved in clean, scalable SVG format
- Free for personal and non-commercial use
- Searchable and browsable at: [cities.partdirector.ch](https://cities.partdirector.ch)

### Examples
Agra → Taj Mahal  
Copenhagen → The Little Mermaid  
Istanbul → Bosphorus Bridge  
Santiago → Chilean Hat  
Forte dei Marmi → Road Bicycle

---

## ✨ Browse the Collection  
Website: [cities.partdirector.ch](https://cities.partdirector.ch)

## 📁 Structure
- `/icons` – All SVG files, named by city
- `/preview` – Thumbnails used on the site
- `/data.json` – City metadata used for filtering

## 📋 Icon Naming Convention

All icons follow a consistent naming pattern: `countryprefix-cityname.svg`

**Format:** `{country-code}-{city-name}.svg`

**Countries in the Collection (Alphabetically Sorted):**
- Argentina
- Armenia
- Australia
- Austria
- Azerbaijan
- Bangladesh
- Belarus
- Belgium
- Bosnia and Herzegovina
- Brazil
- Canada
- Chile
- China
- Cuba
- Cyprus
- Czech Republic
- Denmark
- Egypt
- Finland
- France
- Georgia
- Germany
- Greece
- Iceland
- India
- Indonesia
- Iran
- Iraq
- Israel
- Italy
- Japan
- Jordan
- Kazakhstan
- Latvia
- Lebanon
- Madagascar
- Mexico
- Moldova
- Morocco
- Nepal
- Netherlands
- New Zealand
- Nigeria
- North Macedonia
- Norway
- Pakistan
- Peru
- Philippines
- Poland
- Portugal
- Qatar
- Russia
- Serbia
- Slovenia
- South Africa
- South Korea
- Spain
- Sweden
- Turkey
- UK
- USA
- Ukraine
- Uzbekistan
- Vietnam

**Examples:**
- `us-new-york.svg` - New York, USA
- `us-chicago.svg` - Chicago, USA  
- `us-miami.svg` - Miami, USA
- `us-pittsburgh.svg` - Pittsburgh, USA
- `us-columbus.svg` - Columbus, USA
- `us-phoenix.svg` - Phoenix, USA
- `de-berlin.svg` - Berlin, Germany
- `fr-paris.svg` - Paris, France
- `gb-london.svg` - London, UK
- `es-barcelona.svg` - Barcelona, Spain
- `it-rome.svg` - Rome, Italy
- `ca-toronto.svg` - Toronto, Canada
- `au-sydney.svg` - Sydney, Australia
- `jp-kyoto.svg` - Kyoto, Japan
- `kr-seoul.svg` - Seoul, South Korea
- `cn-shanghai.svg` - Shanghai, China
- `in-delhi.svg` - Delhi, India
- `br-rio-de-janeiro.svg` - Rio de Janeiro, Brazil

**Note:** All city names are lowercase and use hyphens instead of spaces. Country codes follow ISO 3166-1 alpha-2 standard.

## 🚧 License
Icons are free for **personal and educational use**.  
Commercial use is currently restricted while the project grows.  
A more permissive license may be introduced soon.  
(If you have a use case in mind — feel free to open an issue or message me.)

## 💬 Contribute or Suggest a City
Have a favorite city that's missing?  
Open an issue or drop a suggestion here: [github.com/anto1/city-icons/issues](https://github.com/anto1/city-icons/issues)

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
```

## 📊 Analytics

This project uses [Fathom Analytics](https://usefathom.com/) for privacy-focused analytics:

- **No cookies** or tracking scripts
- **GDPR compliant**
- **Minimal performance impact**
- **City-specific event tracking**

## 🌟 Support

- **Missing your city?** [Request it here](mailto:icons@partdirector.ch)
- **Commercial licensing?** [Contact us](mailto:cities@partdirector.ch)
- **Found a bug?** [Open an issue](https://github.com/anto2s/city-icons/issues)

---

Thanks for checking it out.

Made with ❤️ by [Studio Partdirector](https://partdirector.ch)
