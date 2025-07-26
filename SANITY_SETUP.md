# Sanity CMS Setup Guide

This guide will help you set up Sanity CMS for your City Icons Collection project.

## 🚀 Quick Setup (Recommended)

### Step 1: Create Sanity Project

1. Go to [sanity.io](https://sanity.io) and sign up/login
2. Click "Create new project"
3. Choose "Clean project with no predefined schemas"
4. Name your project: "City Icons Collection"
5. **Save your Project ID** (you'll need this later)

### Step 2: Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
```

Replace `your-project-id-here` with your actual Sanity Project ID.

### Step 3: Create the Icon Schema

In your Sanity Studio (the web interface):

1. **Go to your project dashboard**
2. **Click "Content"** in the left sidebar
3. **Click "Create new document"**
4. **Select "Icon"** (if available) or create manually

#### Manual Schema Creation:

If you need to create the schema manually, go to **Settings > API > CORS origins** and add:
- `http://localhost:3000` (for development)
- Your production domain (when deployed)

### Step 4: Add Sample Icons

Create a few test icons in Sanity Studio:

#### Example Icon 1:
- **Name**: "New York Skyline"
- **City**: "New York"
- **Country**: "USA"
- **Category**: "Landmarks"
- **Tags**: ["skyscraper", "city", "urban"]
- **SVG Content**: 
```svg
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
</svg>
```
- **Description**: "Iconic New York City skyline"

#### Example Icon 2:
- **Name**: "London Bridge"
- **City**: "London"
- **Country**: "UK"
- **Category**: "Landmarks"
- **Tags**: ["bridge", "river", "historic"]
- **SVG Content**: 
```svg
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
</svg>
```
- **Description**: "Famous London Bridge over the Thames"

### Step 5: Test Your Setup

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Visit your app**: http://localhost:3000

3. **Check if icons load**: You should see your Sanity icons instead of the sample data

## 🔧 Advanced Setup (Optional)

### Using Sanity CLI (Alternative)

If you want to use the CLI for more control:

```bash
# Install Sanity CLI locally
npm install --save-dev @sanity/cli

# Initialize Sanity in your project
npx sanity init

# Start Sanity Studio locally
npx sanity dev
```

### Custom Schema Definition

If you need to define the schema programmatically, create a schema file:

```javascript
// schemas/icon.js
export default {
  name: 'icon',
  title: 'Icon',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      name: 'svgContent',
      title: 'SVG Content',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    }
  ]
}
```

## 🧪 Testing Your Sanity Integration

### 1. Check Environment Variables

Make sure your `.env.local` file has the correct values:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc12345
NEXT_PUBLIC_SANITY_DATASET=production
```

### 2. Test API Connection

You can test if your Sanity connection works by checking the browser console:

1. Open your app: http://localhost:3000
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for any Sanity-related errors

### 3. Verify Data Loading

- **With Sanity**: You should see your actual icons from Sanity
- **Without Sanity**: You'll see the fallback sample data

## 🚨 Troubleshooting

### Common Issues:

1. **"Project not found" error**:
   - Double-check your Project ID in `.env.local`
   - Make sure you're using the correct dataset name

2. **CORS errors**:
   - Go to Sanity Studio > Settings > API > CORS origins
   - Add `http://localhost:3000` for development

3. **No icons showing**:
   - Check if you've created icons in Sanity Studio
   - Verify your environment variables are loaded
   - Check browser console for errors

4. **Search not working**:
   - This is normal if Sanity isn't connected
   - The app falls back to client-side filtering

### Debug Steps:

1. **Check environment variables**:
   ```bash
   echo $NEXT_PUBLIC_SANITY_PROJECT_ID
   ```

2. **Test Sanity connection**:
   ```javascript
   // In browser console
   fetch('https://your-project-id.api.sanity.io/v2024-01-01/data/query/production?query=*[_type == "icon"]')
     .then(res => res.json())
     .then(console.log)
   ```

## 📊 Monitoring

### Sanity Studio Features:

- **Real-time collaboration**: Multiple editors can work simultaneously
- **Version history**: Track changes to your content
- **Media management**: Upload and organize SVG files
- **API explorer**: Test queries directly in the studio

### Analytics:

- **Content usage**: See which icons are most popular
- **API calls**: Monitor your Sanity API usage
- **Performance**: Track query performance

## 🚀 Production Deployment

When deploying to production:

1. **Update CORS origins** in Sanity Studio:
   - Add your production domain
   - Remove localhost if not needed

2. **Set environment variables** in your hosting platform:
   - Vercel: Add in project settings
   - Netlify: Add in environment variables
   - Other platforms: Follow their specific instructions

3. **Test the live site**:
   - Verify icons load correctly
   - Test search functionality
   - Check download and copy features

## 📚 Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Next.js + Sanity Guide](https://www.sanity.io/docs/nextjs)
- [Sanity Studio Customization](https://www.sanity.io/docs/studio)

## 🆘 Need Help?

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Look at browser console errors**
3. **Verify your Sanity project settings**
4. **Test with the sample data first**
5. **Contact Sanity support** if needed

Your City Icons Collection should now be fully connected to Sanity CMS! 🎉 