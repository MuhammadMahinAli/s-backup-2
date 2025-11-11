# Environment Setup for SHY Chatbot

## Overview

The chatbot backend requires environment variables to connect to the n8n webhook for AI-powered responses.

## Required Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
# Server Configuration
PORT=3000

# n8n Webhook Configuration
# REQUIRED: Replace with your actual n8n webhook URL
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id

# Database Configuration (if needed)
# MONGODB_URI=mongodb://localhost:27017/shy-database

# Other Configuration
PING_MESSAGE=ping
```

## Setup Instructions

### 1. Create .env File

Copy the example above and create a `.env` file in the project root:

```bash
# In the project root directory
touch .env
```

### 2. Configure n8n Webhook

1. **Set up your n8n workflow** with a webhook trigger
2. **Get your webhook URL** from n8n (it should look like: `https://your-n8n.app.n8n.cloud/webhook/...`)
3. **Add the URL to your .env file**:
   ```env
   N8N_WEBHOOK_URL=https://your-actual-n8n-url.com/webhook/abc123
   ```

### 3. n8n Webhook Expected Format

Your n8n webhook should expect this JSON payload:

```json
{
  "sessionId": "uuid-string",
  "action": "sendMessage",
  "chatInput": "user message text",
  "userMeta": {
    "timestamp": "2025-01-01T12:00:00.000Z",
    "source": "web-chatbot"
  }
}
```

### 4. n8n Webhook Response Format

Your n8n workflow should return a JSON response in this format:

```json
{
  "ok": true,
  "reply": "The AI-generated response text"
}
```

Or in case of errors:

```json
{
  "ok": false,
  "error": "Error message"
}
```

## API Endpoint

### POST /api/chat

**Request Body:**
```json
{
  "sessionId": "optional-uuid",
  "message": "user message",
  "userMeta": {
    "any": "additional metadata"
  }
}
```

**Success Response (200):**
```json
{
  "ok": true,
  "reply": "AI response",
  "sessionId": "uuid-string"
}
```

**Error Response (502):**
```json
{
  "ok": false,
  "error": "n8n failed"
}
```

## Testing

### 1. Start the Development Server

The server is already integrated with Vite dev server:

```bash
pnpm dev
```

This will start both the frontend and backend on the same port (default: 8080 in development).

### 2. Test the Chatbot

1. Open your browser to `http://localhost:8080`
2. Click the chatbot button in the bottom-right corner
3. Type a message and press Enter
4. The message will be forwarded to your n8n webhook

### 3. Monitor Logs

Watch the console for logs:
- `[Chat] Forwarding message to n8n for session: {sessionId}` - Message sent
- `[Chat] n8n returned status: {status}` - n8n response status
- `[Chat] Error: ...` - Any errors that occur

## Troubleshooting

### Error: "Chat service not configured"

**Solution:** Make sure `N8N_WEBHOOK_URL` is set in your `.env` file.

### Error: "n8n failed"

**Possible causes:**
- n8n webhook URL is incorrect
- n8n service is down
- n8n workflow has errors
- Network connectivity issues

**Solution:** 
1. Verify your n8n webhook URL is correct
2. Test the webhook directly using curl:
   ```bash
   curl -X POST https://your-n8n-url/webhook/abc123 \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"test","action":"sendMessage","chatInput":"Hello"}'
   ```

### Error: "n8n timeout"

**Cause:** n8n took longer than 30 seconds to respond.

**Solution:** 
- Optimize your n8n workflow
- Check if your AI service is responding slowly
- Increase timeout in `server/routes/chat.ts` if needed

## Production Deployment

For production, ensure:

1. ✅ `.env` file is NOT committed to git
2. ✅ Environment variables are set in your hosting platform
3. ✅ n8n webhook URL uses HTTPS
4. ✅ n8n instance is production-ready and scalable

## Security Notes

⚠️ **Never commit your `.env` file to version control!**

The `.env` file is already in `.gitignore` to prevent accidental commits.

