# 🚀 Quick Start Guide

## Running on Local Server

### Step 1: Install Go
Download and install Go from: https://go.dev/dl/

### Step 2: Navigate to Project
```bash
cd Payment-Card-Validation-Service
```

### Step 3: Run the Server
```bash
go run main.go
```

You should see:
```
Server is running on port 8080
```

### Step 4: Open Browser
Navigate to: **http://localhost:8080**

## Alternative: Run Without Go

If you don't have Go installed, use any HTTP server:

### Using Python
```bash
python -m http.server 8080
```

### Using Node.js
```bash
npx http-server -p 8080
```

### Using PHP
```bash
php -S localhost:8080
```

**Note:** Without Go backend, validation will use client-side fallback only.

## Troubleshooting

**Port already in use?**
```bash
# Change port in main.go
http.ListenAndServe(":3000", nil)
```

**Go not found?**
- Install Go: https://go.dev/dl/
- Add Go to PATH
- Restart terminal

## Testing
Once running, test the API:
```bash
curl -X POST http://localhost:8080/validate \
  -H "Content-Type: application/json" \
  -d '{"card_number":"4532015112830366"}'
```

Expected response:
```json
{"valid":true,"brand":"Visa","type":"Credit"}
```
