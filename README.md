# City Icons Collection

A beautiful collection of line art SVG icons representing cities around the world by Studio Partdirector.

## 🌍 Live Demo

Visit the live site: [City Icons Collection](https://cities.partdirector.ch)

## 📁 Icon Naming Convention

All icons follow a consistent naming pattern: `countryprefix-cityname.svg`

**Format:** `{country-code}-{city-name}.svg`

**Country Codes:**
- `us` - United States
- `de` - Germany  
- `fr` - France
- `gb` - United Kingdom
- `es` - Spain
- `it` - Italy
- `ca` - Canada
- `au` - Australia
- `jp` - Japan
- `kr` - South Korea
- `cn` - China
- `in` - India
- `br` - Brazil
- `ar` - Argentina
- `cl` - Chile
- `mx` - Mexico
- `ru` - Russia
- `cn` - China
- `in` - India
- `jp` - Japan
- `kr` - South Korea
- `th` - Thailand
- `vn` - Vietnam
- `my` - Malaysia
- `sg` - Singapore
- `id` - Indonesia
- `ph` - Philippines
- `pk` - Pakistan
- `bd` - Bangladesh
- `lk` - Sri Lanka
- `np` - Nepal
- `bt` - Bhutan
- `mm` - Myanmar
- `la` - Laos
- `kh` - Cambodia
- `mn` - Mongolia
- `kz` - Kazakhstan
- `uz` - Uzbekistan
- `kg` - Kyrgyzstan
- `tj` - Tajikistan
- `tm` - Turkmenistan
- `af` - Afghanistan
- `ir` - Iran
- `iq` - Iraq
- `sy` - Syria
- `lb` - Lebanon
- `jo` - Jordan
- `il` - Israel
- `ps` - Palestine
- `sa` - Saudi Arabia
- `ye` - Yemen
- `om` - Oman
- `ae` - United Arab Emirates
- `kw` - Kuwait
- `qa` - Qatar
- `bh` - Bahrain
- `tr` - Turkey
- `cy` - Cyprus
- `gr` - Greece
- `bg` - Bulgaria
- `ro` - Romania
- `rs` - Serbia
- `hr` - Croatia
- `si` - Slovenia
- `ba` - Bosnia and Herzegovina
- `me` - Montenegro
- `mk` - North Macedonia
- `al` - Albania
- `xk` - Kosovo
- `md` - Moldova
- `ua` - Ukraine
- `by` - Belarus
- `lt` - Lithuania
- `lv` - Latvia
- `ee` - Estonia
- `fi` - Finland
- `se` - Sweden
- `no` - Norway
- `dk` - Denmark
- `is` - Iceland
- `pl` - Poland
- `cz` - Czech Republic
- `sk` - Slovakia
- `hu` - Hungary
- `at` - Austria
- `ch` - Switzerland
- `li` - Liechtenstein
- `be` - Belgium
- `nl` - Netherlands
- `lu` - Luxembourg
- `pt` - Portugal
- `mt` - Malta
- `ad` - Andorra
- `mc` - Monaco
- `sm` - San Marino
- `va` - Vatican City
- `ma` - Morocco
- `dz` - Algeria
- `tn` - Tunisia
- `ly` - Libya
- `eg` - Egypt
- `sd` - Sudan
- `ss` - South Sudan
- `et` - Ethiopia
- `er` - Eritrea
- `dj` - Djibouti
- `so` - Somalia
- `ke` - Kenya
- `ug` - Uganda
- `rw` - Rwanda
- `bi` - Burundi
- `tz` - Tanzania
- `mz` - Mozambique
- `zm` - Zambia
- `zw` - Zimbabwe
- `bw` - Botswana
- `na` - Namibia
- `za` - South Africa
- `sz` - Eswatini
- `ls` - Lesotho
- `mg` - Madagascar
- `mu` - Mauritius
- `sc` - Seychelles
- `km` - Comoros
- `yt` - Mayotte
- `re` - Réunion
- `st` - São Tomé and Príncipe
- `cv` - Cape Verde
- `gw` - Guinea-Bissau
- `gn` - Guinea
- `sl` - Sierra Leone
- `lr` - Liberia
- `ci` - Ivory Coast
- `gh` - Ghana
- `tg` - Togo
- `bj` - Benin
- `ng` - Nigeria
- `cm` - Cameroon
- `td` - Chad
- `cf` - Central African Republic
- `cg` - Republic of the Congo
- `cd` - Democratic Republic of the Congo
- `ga` - Gabon
- `gq` - Equatorial Guinea
- `ao` - Angola

**Examples:**
- `us-new-york.svg` - New York, USA
- `us-chicago.svg` - Chicago, USA  
- `us-miami.svg` - Miami, USA
- `us-pittsburgh.svg` - Pittsburgh, USA
- `us-columbus.svg` - Columbus, USA (NEW)
- `us-phoenix.svg` - Phoenix, USA (NEW)
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

**Recent Additions:**
- Columbus, Ohio, USA (`us-columbus.svg`)
- Phoenix, Arizona, USA (`us-phoenix.svg`)

**Note:** All city names are lowercase and use hyphens instead of spaces. Country codes follow ISO 3166-1 alpha-2 standard.

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
```



## 📊 Analytics

This project uses [Fathom Analytics](https://usefathom.com/) for privacy-focused analytics:

- **No cookies** or tracking scripts
- **GDPR compliant**
- **Minimal performance impact**
- **City-specific event tracking**



## 📄 License

This project is licensed under a custom license. See the [Usage & Licensing](/license) page for details.

## 🌟 Support

- **Missing your city?** [Request it here](mailto:icons@partdirector.ch)
- **Commercial licensing?** [Contact us](mailto:cities@partdirector.ch)
- **Found a bug?** [Open an issue](https://github.com/anto2s/city-icons/issues)

---

Made with ❤️ by [Studio Partdirector](https://partdirector.ch)
