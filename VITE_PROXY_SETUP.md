# Vite Dev Proxy Configuration

## ✅ Configuration Complete

Your Vite dev server is now configured to proxy `/api` requests to `http://localhost:3000`.

## 📝 What Was Changed

### 1. **vite.config.ts** - Added Proxy Configuration

```typescript
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    },
    // ... rest of config
  },
}));
```

### 2. **client/components/ShyChat.tsx** - Updated to Use Relative URL

**Before:**
```typescript
const response = await fetch("http://localhost:3000/api/chat", {
```

**After:**
```typescript
const response = await fetch("/api/chat", {
```

## 🔧 How It Works

### Development Mode

When you run `pnpm dev`:

1. **Vite dev server** starts on `http://localhost:8080`
2. **Backend server** runs on `http://localhost:3000`
3. **Proxy intercepts** any request to `/api/*`
4. **Forwards to** `http://localhost:3000/api/*`

**Example flow:**
```
Frontend: fetch("/api/chat")
    ↓
Vite Proxy: Intercepts at http://localhost:8080/api/chat
    ↓
Forwards to: http://localhost:3000/api/chat
    ↓
Backend: Processes request and returns response
    ↓
Vite Proxy: Returns response to frontend
```

## 🚀 Running the Application

### Option 1: Using the Integrated Server (Current Setup)

The current setup already has the Express server integrated via the `expressPlugin()` in `vite.config.ts`, which means:

```bash
# Just run this - it starts both frontend AND backend on port 8080
pnpm dev
```

The backend is already available at the same port as the frontend!

### Option 2: Running Backend Separately (If Needed)

If you want to run the backend on port 3000 separately:

1. **Start the backend** on port 3000:
   ```bash
   # In one terminal
   PORT=3000 node dist/server/node-build.mjs
   # or
   tsx server/node-build.ts
   ```

2. **Start the frontend** on port 8080:
   ```bash
   # In another terminal
   pnpm dev
   ```

3. **Proxy will forward** `/api` requests to port 3000

### Option 3: Disable Integrated Server (Use Only Proxy)

If you want to completely disable the integrated server and use only the proxy:

**In `vite.config.ts`:**
```typescript
export default defineConfig(({ mode }) => ({
  server: {
    // ... config
  },
  // Comment out or remove the expressPlugin
  plugins: [react()], // Remove expressPlugin()
  // ...
}));
```

## 📋 Proxy Configuration Options

The current proxy config:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',  // Backend URL
    changeOrigin: true,                // Changes the origin header
    secure: false,                     // Allows self-signed certs
  }
}
```

### Additional Options

You can customize the proxy further:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
    
    // Rewrite path (e.g., /api/chat → /chat)
    rewrite: (path) => path.replace(/^\/api/, ''),
    
    // Add custom headers
    configure: (proxy, options) => {
      proxy.on('proxyReq', (proxyReq, req, res) => {
        proxyReq.setHeader('X-Proxied-By', 'Vite');
      });
    },
    
    // Enable websockets
    ws: true,
    
    // Log proxy requests
    configure: (proxy, options) => {
      proxy.on('error', (err, req, res) => {
        console.log('proxy error', err);
      });
      proxy.on('proxyReq', (proxyReq, req, res) => {
        console.log('Sending Request to the Target:', req.method, req.url);
      });
      proxy.on('proxyRes', (proxyRes, req, res) => {
        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
      });
    }
  }
}
```

## 🔍 Testing the Proxy

### 1. Check if Backend is Running

```bash
# Test the backend directly
curl http://localhost:3000/api/health

# Expected response:
# {"ok":true}
```

### 2. Test Through Proxy

```bash
# Test through Vite proxy (when dev server is running)
curl http://localhost:8080/api/health

# Should also return:
# {"ok":true}
```

### 3. Test ShyChat Component

1. Open browser: `http://localhost:8080`
2. Click the chat bubble
3. Send a message
4. Check browser DevTools → Network tab
5. Look for request to `/api/chat` (not `http://localhost:3000/api/chat`)

## 🐛 Troubleshooting

### Error: "Failed to fetch"

**Cause:** Backend is not running on port 3000

**Solution:**
- Check if backend is running: `curl http://localhost:3000/api/health`
- Start backend separately if needed
- Or use the integrated server (default setup)

### Error: "ECONNREFUSED"

**Cause:** Proxy can't connect to `http://localhost:3000`

**Solution:**
- Ensure backend is running on port 3000
- Check `PORT` in `.env` is set to `3000`
- Verify firewall isn't blocking port 3000

### CORS Errors

**Cause:** CORS headers not set properly

**Solution:**
With the proxy, CORS should not be an issue because:
- Frontend and backend appear to be on the same origin
- The proxy handles the cross-origin request

If you still see CORS errors:
1. Check `changeOrigin: true` is set in proxy config
2. Ensure backend has CORS middleware (already configured in `server/index.ts`)

### Proxy Not Working

**Symptoms:** Requests still go to `http://localhost:3000` instead of being proxied

**Solutions:**
1. **Restart dev server:**
   ```bash
   # Stop the dev server (Ctrl+C)
   pnpm dev
   ```

2. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   pnpm dev
   ```

3. **Check browser cache:**
   - Open DevTools
   - Disable cache (Network tab → "Disable cache")
   - Hard reload (Ctrl+Shift+R)

## 📊 Current Setup Summary

| Component | Port | URL |
|-----------|------|-----|
| Vite Dev Server | 8080 | `http://localhost:8080` |
| Backend (via proxy) | 3000 | `http://localhost:3000` |
| Frontend API calls | 8080 | `/api/*` → proxied to port 3000 |

## 🎯 Benefits of Using Proxy

1. ✅ **No CORS issues** - Same origin for frontend and API
2. ✅ **Cleaner code** - Use relative URLs like `/api/chat`
3. ✅ **Easy to deploy** - Change proxy config for different environments
4. ✅ **Development-only** - Proxy only works in dev mode
5. ✅ **Separation of concerns** - Frontend and backend can run independently

## 🚀 Production Considerations

**Important:** The Vite proxy only works in development!

For production, you have options:

### Option 1: Serve Frontend + Backend Together

Use the integrated Express server (current setup):

```bash
pnpm build
pnpm start
```

This serves both frontend and backend from the same server.

### Option 2: Separate Deployments

Deploy frontend and backend separately and update the API URL:

**In production build:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || '/api';
const response = await fetch(`${API_URL}/chat`, {
```

**In `.env.production`:**
```
VITE_API_URL=https://api.yourbackend.com
```

### Option 3: Reverse Proxy (Nginx)

Use Nginx or similar to proxy `/api` to backend:

```nginx
location /api {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## ✅ Summary

You're all set! The proxy is configured and ready to use:

- ✅ **Vite config updated** with proxy settings
- ✅ **ShyChat component updated** to use relative URLs
- ✅ **No code changes needed** - just start the dev server

**Next steps:**
1. Ensure your backend is running on port 3000 (or use the integrated server)
2. Run `pnpm dev`
3. Open `http://localhost:8080` and test the chat!

---

**Questions?** Check the troubleshooting section or review the Vite proxy documentation:
https://vitejs.dev/config/server-options.html#server-proxy

