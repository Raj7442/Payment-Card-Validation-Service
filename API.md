# Payment Card Validation API

## Endpoints

### POST /validate
Validates a credit card number using the Luhn algorithm.

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

### GET /health
Returns server health status.

**Response:**
```json
{
  "status": "healthy",
  "uptime": "1h30m45s",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### GET /metrics
Returns validation metrics.

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

## Rate Limiting
- 60 requests per minute per IP address
- Returns 429 status code when exceeded

## Supported Card Brands
- Visa (starts with 4)
- MasterCard (starts with 5)
- American Express (starts with 34 or 37)
- Discover (starts with 6011 or 65)