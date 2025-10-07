# Razorpay Payment Gateway Setup Guide

## Environment Variables Setup

To fix the "Authentication failed" error, you need to set up your Razorpay credentials as environment variables.

### Step 1: Create Environment File

Create a `.env` file in the `miet-backend` directory with your Razorpay credentials:

```bash
# Navigate to backend directory
cd /Users/ZantrikTechnologies/Desktop/raxxx/miet-backend

# Create .env file
touch .env
```

### Step 2: Add Razorpay Credentials

Add the following content to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_actual_razorpay_key_id
RAZORPAY_KEY_SECRET=your_actual_razorpay_key_secret

# Server Configuration
PORT=4000
```

**Important:** Replace `your_actual_razorpay_key_id` and `your_actual_razorpay_key_secret` with your actual Razorpay credentials.

### Step 3: Restart Backend Server

After setting up the environment variables, restart the backend server:

```bash
# Kill existing process
pkill -f "node index.js"

# Start backend server
cd /Users/ZantrikTechnologies/Desktop/raxxx/miet-backend
node index.js
```

### Step 4: Test the Integration

Test the payment-first appointment endpoint:

```bash
curl -X POST http://localhost:4000/api/appointments/payment-first \
  -H "Content-Type: application/json" \
  -d '{
    "consultant_id": 1,
    "title": "Test Appointment",
    "description": "Test Description",
    "start_time": "2024-01-15T10:00:00Z",
    "end_time": "2024-01-15T11:00:00Z",
    "duration_minutes": 60,
    "meeting_type": "consultation",
    "price": 500,
    "user_name": "Test User",
    "user_email": "test@example.com",
    "user_phone": "1234567890"
  }'
```

## Current Status

✅ **Backend API endpoints created**
✅ **Frontend payment components created**
✅ **Database migration completed**
❌ **Razorpay credentials not configured** ← **This is the current issue**

## Next Steps

1. Set up your Razorpay credentials in the `.env` file
2. Restart the backend server
3. Test the payment modal in the frontend

The payment modal should now work correctly once the Razorpay credentials are properly configured.
