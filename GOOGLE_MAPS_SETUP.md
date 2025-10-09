# Google Maps Setup Guide

This guide will help you set up Google Maps API for the MIET application.

## Status

✅ **Google Maps is now loading successfully!**

However, you may see some deprecation warnings in the console. These are informational and do not affect functionality.

## Common Issues

If Google Maps is not loading properly, it's typically caused by one or more of the following:

1. **API Key Not Configured**: The Google Maps API key is not set in environment variables
2. **APIs Not Enabled**: Required Google Maps APIs are not enabled in Google Cloud Console ⚠️ **Most Common Issue**
3. **API Key Restrictions**: The API key has restrictions that prevent it from working on your domain
4. **Billing Not Enabled**: Google Maps requires billing to be enabled (even for free tier usage)

## Step-by-Step Setup

### 1. Get Your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **API Key**
5. Copy the generated API key

### 2. Enable Required APIs

You need to enable the following APIs for your project:

1. Go to [Google Maps APIs](https://console.cloud.google.com/google/maps-apis/)
2. Enable these APIs:
   - **Maps JavaScript API** (Required for displaying maps)
   - **Places API** (Required for location search)
   - **Geocoding API** (Required for address lookup)

To enable each API:

- Click on the API name
- Click **Enable** button
- Wait for the API to be enabled

### 3. Configure API Key Restrictions (Recommended)

To secure your API key:

1. Go to **APIs & Services** > **Credentials**
2. Click on your API key
3. Under **Application restrictions**:
   - Select **HTTP referrers (websites)**
   - Add your website URLs:
     ```
     http://localhost:3000/*
     http://localhost:*/*
     https://yourdomain.com/*
     ```
4. Under **API restrictions**:
   - Select **Restrict key**
   - Select only the APIs you enabled:
     - Maps JavaScript API
     - Places API
     - Geocoding API
5. Click **Save**

### 4. Enable Billing

Google Maps requires billing to be enabled (you get $200 free credit per month):

1. Go to [Billing](https://console.cloud.google.com/billing)
2. Link a billing account to your project
3. Add a payment method

**Note**: With normal usage, you likely won't exceed the free tier limits.

### 5. Configure Environment Variables

Create a `.env.local` file in the root of your project (if it doesn't exist):

```bash
# Google Maps API Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE

# Backend URL (adjust if different)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Replace `YOUR_API_KEY_HERE` with your actual API key from step 1.

**Important**:

- Never commit `.env.local` to version control
- The `.env.local` file is already in `.gitignore`
- For production, set these environment variables in your hosting platform (Vercel, Netlify, etc.)

### 6. Restart Your Development Server

After creating/updating `.env.local`:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
npm run dev
```

## Troubleshooting

### Map Still Not Loading?

1. **Check Browser Console**: Open Developer Tools (F12) and check the Console tab for specific error messages

2. **Common Error Messages**:

   - **"ApiNotActivatedMapError"**: Maps JavaScript API is not enabled

     - Solution: Enable Maps JavaScript API in Google Cloud Console

   - **"RefererNotAllowedMapError"**: Your domain is not authorized

     - Solution: Add your domain to API key restrictions

   - **"InvalidKeyMapError"**: API key is invalid

     - Solution: Double-check your API key in `.env.local`

   - **"ApiTargetBlockedMapError"**: API is restricted
     - Solution: Check API restrictions in Google Cloud Console

3. **Clear Browser Cache**: Sometimes old cached scripts cause issues

   ```
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E
   ```

4. **Check Network Tab**: Look for failed requests to `maps.googleapis.com`

### Verify Environment Variables

To verify your environment variables are loaded correctly, check the browser console. The SearchPanel component logs the API key status:

```javascript
console.log("Google Maps loading status:", {
  isLoaded,
  loadError,
  apiKey: "AIzaSyAm...", // First 10 characters
  apiKeyLength: 39,
});
```

### Test API Key Directly

Test if your API key works by visiting this URL in your browser:

```
https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE
```

Replace `YOUR_API_KEY_HERE` with your actual API key. If it works, you should see JavaScript code.

## Production Deployment

### Vercel

1. Go to your project settings in Vercel
2. Navigate to **Environment Variables**
3. Add:
   - Key: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Value: Your API key
4. Redeploy your application

### Netlify

1. Go to **Site settings** > **Build & deploy** > **Environment**
2. Add:
   - Key: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Value: Your API key
3. Redeploy your application

### Other Platforms

Consult your hosting platform's documentation for setting environment variables.

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use API key restrictions** to limit usage to your domains
3. **Monitor API usage** in Google Cloud Console
4. **Set up billing alerts** to avoid unexpected charges
5. **Rotate API keys** periodically
6. **Use different API keys** for development and production

## Cost Considerations

Google Maps offers a generous free tier:

- **$200 free credit per month**
- Maps JavaScript API: $7 per 1,000 loads (after free tier)
- Geocoding API: $5 per 1,000 requests (after free tier)
- Places API: Varies by request type

For most small to medium applications, you'll stay within the free tier.

## Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [API Key Best Practices](https://developers.google.com/maps/api-key-best-practices)
- [React Google Maps API Documentation](https://react-google-maps-api-docs.netlify.app/)

## Support

If you continue to experience issues:

1. Check the browser console for detailed error messages
2. Verify all APIs are enabled in Google Cloud Console
3. Ensure billing is enabled for your project
4. Try creating a new API key
5. Check the [Google Maps Platform Status](https://status.cloud.google.com/)

## Current Implementation Details

The SearchPanel component uses:

- `@react-google-maps/api` library (v2.20.6)
- `useJsApiLoader` hook for loading the Google Maps script
- Libraries: `['places']` for location search functionality
- Fallback API key: `AIzaSyAmpa3H1449VHQeOA7cJ1h1fp5WUu5d4pM` (should be replaced)

The component includes:

- Comprehensive error handling with user-friendly messages
- Debug logging for troubleshooting
- Loading states with visual feedback
- Retry mechanism for failed loads
- Direct links to Google Cloud Console for quick fixes
