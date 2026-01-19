package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"regexp"
	"time"
	"sync"
	"os"
)

func luhnAlgorithm(cardNumber string) bool {
	var sum int
	alt := false
	for i := len(cardNumber) - 1; i >= 0; i-- {
		n, err := strconv.Atoi(string(cardNumber[i]))
		if err != nil {
			return false
		}
		if alt {
			n *= 2
			if n > 9 {
				n -= 9
			}
		}
		sum += n
		alt = !alt
	}
	return sum%10 == 0
}

var (
	validationCount int64
	validCards      int64
	mutex          sync.RWMutex
	startTime      = time.Now()
	rateLimit      = make(map[string][]time.Time)
	rateMutex      sync.RWMutex
)

type RequestPayload struct {
	CardNumber string `json:"card_number"`
}

type ResponsePayload struct {
	Valid bool   `json:"valid"`
	Brand string `json:"brand"`
	Type  string `json:"type"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	http.HandleFunc("/validate", corsHandler(rateLimitHandler(validateCardHandler)))
	http.HandleFunc("/health", corsHandler(healthHandler))
	http.HandleFunc("/metrics", corsHandler(metricsHandler))
	http.HandleFunc("/manifest.json", corsHandler(serveManifest))
	http.HandleFunc("/", corsHandler(serveStatic))
	fmt.Println("Server is running on port", port)
	http.ListenAndServe(":"+port, nil)
}

func corsHandler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			return
		}
		next(w, r)
	}
}

func serveStatic(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		http.ServeFile(w, r, "static/index.html")
	} else {
		fs := http.FileServer(http.Dir("static"))
		http.StripPrefix("/", fs).ServeHTTP(w, r)
	}
}

func validateCardHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	var payload RequestPayload
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil || len(payload.CardNumber) == 0 {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	cleanedNumber := strings.ReplaceAll(payload.CardNumber, " ", "")
	
	isValid := luhnAlgorithm(cleanedNumber)
	brand := getCardBrand(cleanedNumber)
	cardType := getCardType(cleanedNumber)
	
	mutex.Lock()
	validationCount++
	if isValid {
		validCards++
	}
	mutex.Unlock()

	response := ResponsePayload{Valid: isValid, Brand: brand, Type: cardType}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}
}

func getCardBrand(cardNumber string) string {
	patterns := map[string]*regexp.Regexp{
		"Visa":       regexp.MustCompile(`^4[0-9]{12}(?:[0-9]{3})?$`),
		"MasterCard": regexp.MustCompile(`^5[1-5][0-9]{14}$`),
		"Amex":       regexp.MustCompile(`^3[47][0-9]{13}$`),
		"Discover":   regexp.MustCompile(`^6(?:011|5[0-9]{2})[0-9]{12}$`),
		"JCB":        regexp.MustCompile(`^(?:2131|1800|35\d{3})\d{11}$`),
		"Diners":     regexp.MustCompile(`^3[0689][0-9]{13}$`),
		"UnionPay":   regexp.MustCompile(`^(62|88)[0-9]{14,17}$`),
		"Maestro":    regexp.MustCompile(`^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$`),
	}
	
	for brand, pattern := range patterns {
		if pattern.MatchString(cardNumber) {
			return brand
		}
	}
	return "Unknown"
}

func getCardType(cardNumber string) string {
	if len(cardNumber) >= 6 {
		prefix := cardNumber[:6]
		if strings.HasPrefix(prefix, "4") {
			return "Credit"
		}
	}
	return "Credit"
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	health := map[string]interface{}{
		"status": "healthy",
		"uptime": time.Since(startTime).String(),
		"timestamp": time.Now().Format(time.RFC3339),
	}
	json.NewEncoder(w).Encode(health)
}

func metricsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	mutex.RLock()
	metrics := map[string]interface{}{
		"total_validations": validationCount,
		"valid_cards": validCards,
		"invalid_cards": validationCount - validCards,
		"success_rate": float64(validCards) / float64(validationCount) * 100,
		"uptime": time.Since(startTime).String(),
	}
	mutex.RUnlock()
	json.NewEncoder(w).Encode(metrics)
}

func rateLimitHandler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr
		now := time.Now()
		
		rateMutex.Lock()
		requests := rateLimit[ip]
		var recent []time.Time
		for _, t := range requests {
			if now.Sub(t) < time.Minute {
				recent = append(recent, t)
			}
		}
		
		if len(recent) >= 60 {
			rateMutex.Unlock()
			http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
			return
		}
		
		recent = append(recent, now)
		rateLimit[ip] = recent
		rateMutex.Unlock()
		
		next(w, r)
	}
}

func serveManifest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	http.ServeFile(w, r, "static/manifest.json")
}
