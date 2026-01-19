# 💳 Payment Card Validation Service

A modern, full-stack credit card validation system with real-time validation, batch processing, and comprehensive analytics. Built with Go backend and vanilla JavaScript frontend.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Go Version](https://img.shields.io/badge/go-1.21+-00ADD8.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## ✨ Features

### 🔐 Core Validation
- **Luhn Algorithm** - Industry-standard checksum validation
- **8 Card Brands** - Visa, MasterCard, Amex, Discover, JCB, Diners, UnionPay, Maestro
- **Real-time Feedback** - Instant validation as you type
- **Batch Processing** - Validate multiple cards at once

### 🎨 Modern UI/UX
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Dark/Light Theme** - Toggle between themes
- **Glassmorphism** - Modern UI with backdrop blur effects
- **Smooth Animations** - Loading states, success/error animations
- **Touch Gestures** - Swipe navigation on mobile
- **PWA Support** - Installable as mobile app

### 🚀 Advanced Features
- **Rate Limiting** - 60 requests/minute per IP
- **Validation History** - Last 10 validations stored locally
- **CSV Export** - Export batch results
- **Health Monitoring** - `/health` and `/metrics` endpoints
- **CORS Enabled** - Cross-origin requests supported
- **Keyboard Shortcuts** - Quick navigation (Ctrl+1-4, Ctrl+D)

### ♿ Accessibility
- ARIA labels and roles
- Screen reader friendly
- Keyboard navigation
- High contrast support

## 🛠️ Technology Stack

**Backend:**
- Go 1.21+
- `net/http` - HTTP server
- In-memory storage
- Regex pattern matching

**Frontend:**
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- LocalStorage API

## 📦 Installation

### Prerequisites
- Go 1.21 or higher
- Modern web browser

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/payment-card-validation-service.git
cd payment-card-validation-service
```

2. **Run the server**
```bash
go run main.go
```

3. **Open your browser**
```
http://localhost:8080
```

### Using Docker

```bash
# Build image
docker build -t card-validator .

# Run container
docker run -p 8080:8080 card-validator
```

## 🎯 Usage

### Single Card Validation
1. Navigate to the validation page
2. Enter a 16-digit card number
3. See real-time brand detection
4. Click "Validate" for full verification

### Batch Validation
1. Click "Batch" button
2. Enter multiple card numbers (one per line)
3. Click "Validate All"
4. Export results as CSV

### Keyboard Shortcuts
- `Ctrl+1` - Home page
- `Ctrl+2` - Validation page
- `Ctrl+3` - History page
- `Ctrl+4` - Batch page
- `Ctrl+D` - Toggle dark theme
- `Esc` - Return to home

## 🔌 API Documentation

### POST `/validate`
Validates a credit card number.

**Request:**
```json
{
  "card_number": "4532015112830366"
}
```

**Response:**
```json
{
  "valid": true,
  "brand": "Visa",
  "type": "Credit"
}
```

### GET `/health`
Returns server health status.

**Response:**
```json
{
  "status": "healthy",
  "uptime": "1h30m45s",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### GET `/metrics`
Returns validation statistics.

**Response:**
```json
{
  "total_validations": 150,
  "valid_cards": 120,
  "invalid_cards": 30,
  "success_rate": 80.0,
  "uptime": "1h30m45s"
}
```

## 🃏 Supported Card Brands

| Brand | IIN Range | Length | Region |
|-------|-----------|--------|--------|
| Visa | 4 | 13-16 | Global |
| MasterCard | 51-55, 2221-2720 | 16 | Global |
| American Express | 34, 37 | 15 | Global |
| Discover | 6011, 65 | 16 | US |
| JCB | 3528-3589 | 16 | Japan/Asia |
| Diners Club | 30, 36, 38 | 14 | Global |
| UnionPay | 62, 88 | 16-19 | China |
| Maestro | 50, 56-69 | 12-19 | Europe |

## 🧪 Testing

### Run Unit Tests
```bash
go test -v
```

### Test Cards
```
Visa:       4532015112830366
MasterCard: 5555555555554444
Amex:       378282246310005
Discover:   6011111111111117
```

## 📊 Project Structure

```
payment-card-validation-service/
├── main.go              # Backend server
├── main_test.go         # Unit tests
├── index.html           # Frontend UI
├── manifest.json        # PWA manifest
├── go.mod              # Go dependencies
├── Dockerfile          # Container config
├── API.md              # API documentation
└── README.md           # This file
```

## ⚠️ Important Notes

### What This Validator Does
✅ Validates card number format (Luhn algorithm)  
✅ Identifies card brand  
✅ Checks digit length  
✅ Catches typos and errors  

### What This Validator Does NOT Do
❌ Verify if card actually exists  
❌ Check if card is active/expired  
❌ Validate CVV or expiry date  
❌ Check available balance  
❌ Process payments  

**This is a client-side validation tool, not a payment processor.**

## 🔒 Security

- No card data is stored on the server
- Rate limiting prevents abuse
- CORS configured for security
- Client-side history uses localStorage only
- No external API calls

**⚠️ Never use this for actual payment processing without PCI DSS compliance.**

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### AWS EC2
```bash
# Build binary
go build -o card-validator

# Run on server
./card-validator
```

### Vercel/Netlify
Deploy as static site with serverless functions.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rounak Raj**

## 🙏 Acknowledgments

- Luhn algorithm by Hans Peter Luhn (IBM)
- Card brand patterns from industry standards
- UI inspiration from modern fintech apps

## 📞 Support

For issues and questions:
- Open an [Issue](https://github.com/yourusername/payment-card-validation-service/issues)
- Email: your.email@example.com

## 🗺️ Roadmap

- [ ] Add expiry date validation
- [ ] CVV validation
- [ ] More card brands (RuPay, Elo, etc.)
- [ ] API authentication
- [ ] Database integration
- [ ] User accounts
- [ ] Analytics dashboard

---

⭐ Star this repo if you find it helpful!
