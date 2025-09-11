# Google Meet & Calendar Integration Setup Guide

This guide will help you set up Google Meet webinar and appointment scheduling functionality for the MIET platform.

## Prerequisites

- Google Cloud Console account
- Node.js and npm installed
- Backend running on port 4000
- Frontend running on port 3000

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your Project ID

### 1.2 Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Enable the following APIs:
   - **Google Calendar API**
   - **Google Meet API** (if available)
   - **Google+ API** (for user info)

### 1.3 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen first if prompted:

   - Choose "External" user type
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scopes: `https://www.googleapis.com/auth/calendar`, `https://www.googleapis.com/auth/userinfo.email`, `https://www.googleapis.com/auth/userinfo.profile`
   - Add test users (your email addresses)

4. Create OAuth 2.0 Client ID:

   - Application type: "Web application"
   - Name: "MIET Platform"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:4000`
     - Your production domain (if applicable)
   - Authorized redirect URIs:
     - `http://localhost:4000/api/auth/google/callback`
     - `http://localhost:4000/api/auth/admin/google/callback`
     - Your production callback URLs (if applicable)

5. Download the credentials JSON file
6. Note down the Client ID and Client Secret

### 1.4 Create API Key (Optional)

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Restrict the API key to:
   - Google Calendar API
   - Google Meet API
4. Note down the API Key

## Step 2: Backend Environment Variables

Create a `.env` file in your backend directory (`/Users/ZantrikTechnologies/Desktop/raxxx/miet-backend/.env`) with the following variables:

```env
# Google OAuth 2.0 Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:4000/api/auth/google/callback

# Google Calendar API
GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key_here

# Google Meet API
GOOGLE_MEET_API_KEY=your_google_meet_api_key_here

# Admin Google OAuth (for admin scheduling)
ADMIN_GOOGLE_CLIENT_ID=your_admin_google_client_id_here
ADMIN_GOOGLE_CLIENT_SECRET=your_admin_google_client_secret_here
ADMIN_GOOGLE_REDIRECT_URI=http://localhost:4000/api/auth/admin/google/callback

# Email Configuration (for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:3000

# Existing variables
JWT_SECRET=your_jwt_secret_change_in_production
JWT_EXPIRES_IN=7d
PAYMENT_GATEWAY_API_KEY=test_key
PAYMENT_GATEWAY_SECRET=test_secret
```

## Step 3: Install Backend Dependencies

The following packages have been added to `package.json`:

```bash
cd /Users/ZantrikTechnologies/Desktop/raxxx/miet-backend
npm install
```

New dependencies:

- `googleapis` - Google APIs client library
- `google-auth-library` - Google authentication library
- `nodemailer` - Email sending library
- `uuid` - UUID generation library

## Step 4: Database Setup

The following new tables have been created automatically:

1. **google_oauth_tokens** - Stores OAuth tokens for users and admins
2. **appointments** - Stores appointment/consultation data
3. **webinars** - Stores webinar data
4. **appointment_attendees** - Stores appointment attendee information
5. **webinar_attendees** - Stores webinar attendee information
6. **consultant_google_calendars** - Links consultants to their Google calendars

## Step 5: API Endpoints

### Authentication Endpoints

- `GET /api/auth/google` - Initiate Google OAuth flow for users
- `GET /api/auth/google/callback` - Handle Google OAuth callback for users
- `GET /api/auth/admin/google` - Initiate Google OAuth flow for admins
- `GET /api/auth/admin/google/callback` - Handle Google OAuth callback for admins

### Appointment Endpoints

- `POST /api/appointments` - Create new appointment (requires user authentication)
- `GET /api/appointments` - Get user's appointments (requires user authentication)
- `GET /api/consultants/:id/availability` - Get consultant's available time slots

### Webinar Endpoints

- `POST /api/webinars` - Create new webinar (requires admin authentication)
- `GET /api/webinars` - Get all webinars (requires admin authentication)

## Step 6: Frontend Integration

### Admin Dashboard

The admin dashboard now includes:

1. **Webinars Section** - Schedule and manage Google Meet webinars
2. **Consultations Section** - Schedule and manage consultations with consultants
3. **Google OAuth Setup** - One-click Google OAuth setup for admins

### User Features

Users can now:

1. Authenticate with Google OAuth
2. Schedule appointments with consultants
3. Receive email notifications with Google Meet links
4. View their appointments in their Google Calendar

## Step 7: Testing the Integration

### 7.1 Test Admin OAuth Setup

1. Go to admin dashboard
2. Navigate to "Webinars" or "Consultations"
3. Click "Setup Google OAuth"
4. Complete the OAuth flow in the popup window
5. Verify that the setup is successful

### 7.2 Test Webinar Scheduling

1. In admin dashboard, go to "Webinars"
2. Click "Schedule Webinar"
3. Fill in the webinar details:
   - Title: "Test Webinar"
   - Start Time: Future date/time
   - Duration: 60 minutes
   - Max Attendees: 100
   - Price: 0 (free)
   - Attendee Emails: Your email address
4. Click "Schedule Webinar"
5. Check your email for the Google Meet link
6. Verify the event appears in your Google Calendar

### 7.3 Test Consultation Scheduling

1. In admin dashboard, go to "Consultations"
2. Click "Schedule Consultation"
3. Fill in the consultation details:
   - Consultant: Select from dropdown
   - Title: "Test Consultation"
   - Start Time: Future date/time
   - Duration: 60 minutes
   - Price: 500
   - Attendee Emails: Your email address
4. Click "Schedule Consultation"
5. Check your email for the Google Meet link
6. Verify the event appears in your Google Calendar

## Step 8: Production Deployment

### 8.1 Update Environment Variables

For production, update the following in your `.env` file:

```env
# Production URLs
GOOGLE_REDIRECT_URI=https://your-backend-domain.com/api/auth/google/callback
ADMIN_GOOGLE_REDIRECT_URI=https://your-backend-domain.com/api/auth/admin/google/callback
FRONTEND_URL=https://your-frontend-domain.com

# Production SMTP settings
SMTP_HOST=your-production-smtp-host
SMTP_USER=your-production-smtp-username
SMTP_PASS=your-production-smtp-password
```

### 8.2 Update Google Cloud Console

1. Add your production domains to authorized origins and redirect URIs
2. Update OAuth consent screen with production information
3. Publish your app if ready for public use

## Troubleshooting

### Common Issues

1. **OAuth Error: redirect_uri_mismatch**

   - Ensure redirect URIs in Google Cloud Console match exactly
   - Check for trailing slashes and http vs https

2. **Calendar API Error: insufficient permissions**

   - Ensure Google Calendar API is enabled
   - Check OAuth scopes include calendar permissions

3. **Email Notifications Not Working**

   - Verify SMTP credentials
   - Check spam folder
   - Ensure SMTP server allows connections from your server

4. **Google Meet Links Not Generated**
   - Ensure Google Meet API is enabled
   - Check that conferenceData is properly configured
   - Verify OAuth token has calendar write permissions

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=googleapis:*
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **OAuth Tokens**: Tokens are stored securely in the database with expiration handling
3. **API Keys**: Restrict API keys to specific APIs and domains
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure CORS properly for your domains

## Support

For issues or questions:

1. Check the Google APIs documentation
2. Review the console logs for error messages
3. Verify all environment variables are set correctly
4. Ensure all required APIs are enabled in Google Cloud Console

## Features Implemented

✅ **Backend Integration**

- Google OAuth 2.0 authentication
- Google Calendar API integration
- Google Meet event creation
- Email notifications
- Database schema for appointments and webinars

✅ **Admin Dashboard**

- Webinar scheduling interface
- Consultation scheduling interface
- Google OAuth setup
- CRUD operations for webinars and consultations

✅ **User Features**

- Google OAuth authentication
- Appointment booking
- Email notifications with Google Meet links
- Calendar integration

✅ **Production Ready**

- Type-safe TypeScript implementation
- Error handling and validation
- Responsive design
- Security best practices
