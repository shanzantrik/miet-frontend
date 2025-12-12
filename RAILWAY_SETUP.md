# Railway Production Setup for Google Maps

## Issue: Map Disappearing on Railway.app

If the Google Maps loads but then disappears on Railway production, follow these steps:

## Required Environment Variables on Railway

### 1. Set Google Maps API Key

In Railway dashboard, go to your project → Variables and add:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 2. Optional: Set Map ID (for AdvancedMarkerElement styling)

```
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id_here
```

**Note**: Map ID is optional. Only set it if you've created a custom Map ID in Google Cloud Console.

## Critical: API Key Restrictions

### Enable Railway Domain in Google Cloud Console

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your API key
3. Under **Application restrictions**, select **HTTP referrers (websites)**
4. Add your Railway domain(s):
   ```
   https://*.railway.app/*
   https://your-app-name.railway.app/*
   ```
5. Also add your custom domain if you have one:
   ```
   https://yourdomain.com/*
   https://www.yourdomain.com/*
   ```
6. Click **Save**

## Verify Required APIs are Enabled

Make sure these APIs are enabled in Google Cloud Console:

1. **Maps JavaScript API** ⚠️ **CRITICAL**
2. Places API
3. Geocoding API

Go to: https://console.cloud.google.com/google/maps-apis/api-list

## Verify Billing is Enabled

- Google Maps requires billing to be enabled (even for free tier)
- You get $200 free credit per month
- Go to: https://console.cloud.google.com/billing

## Railway-Specific Fixes Applied

The code now includes these production fixes:

1. ✅ **Client-side only rendering** - Prevents SSR/hydration issues
2. ✅ **Map persistence** - Map stays mounted once initialized
3. ✅ **Error resilience** - Map doesn't disappear if errors occur after loading
4. ✅ **Optional mapId** - Map works with or without custom Map ID
5. ✅ **Production logging** - Better debugging for production issues

## Troubleshooting

### Map loads then disappears

**Cause**: API key restrictions blocking Railway domain

**Fix**: 
1. Add Railway domain to API key restrictions (see above)
2. Wait 5-10 minutes for changes to propagate
3. Clear Railway build cache and redeploy

### Map never loads

**Cause**: Maps JavaScript API not enabled

**Fix**: Enable Maps JavaScript API in Google Cloud Console

### Map works on localhost but not Railway

**Cause**: Environment variable not set or API key restrictions

**Fix**:
1. Check Railway environment variables are set
2. Add Railway domain to API key restrictions
3. Redeploy after making changes

## Check Environment Variables in Railway

1. Go to Railway dashboard
2. Select your project
3. Go to **Variables** tab
4. Verify:
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
   - Value matches your Google Cloud Console API key

## Testing

After setting up:

1. Deploy to Railway
2. Open browser console on Railway site
3. Look for:
   - `✅ Google Map loaded successfully (PRODUCTION)`
   - `🔒 Production mode: Map will persist across re-renders`
4. If you see errors, check the console messages for guidance

## Common Errors

### ApiNotActivatedMapError
- **Fix**: Enable Maps JavaScript API in Google Cloud Console

### RefererNotAllowedMapError
- **Fix**: Add Railway domain to API key restrictions

### InvalidKeyMapError
- **Fix**: Verify API key is correct in Railway environment variables

## Need Help?

Check the browser console on Railway for specific error messages. The code now includes detailed logging for production debugging.


