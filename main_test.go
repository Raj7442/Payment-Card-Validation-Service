package main

import (
	"testing"
)

func TestLuhnAlgorithm(t *testing.T) {
	tests := []struct {
		cardNumber string
		expected   bool
	}{
		{"4532015112830366", true},  // Valid Visa
		{"5555555555554444", true},  // Valid MasterCard
		{"378282246310005", true},   // Valid Amex
		{"6011111111111117", true},  // Valid Discover
		{"1234567890123456", false}, // Invalid
		{"", false},                 // Empty
		{"abc", false},              // Non-numeric
	}

	for _, test := range tests {
		result := luhnAlgorithm(test.cardNumber)
		if result != test.expected {
			t.Errorf("luhnAlgorithm(%s) = %v; expected %v", test.cardNumber, result, test.expected)
		}
	}
}

func TestGetCardBrand(t *testing.T) {
	tests := []struct {
		cardNumber string
		expected   string
	}{
		{"4532015112830366", "Visa"},
		{"5555555555554444", "MasterCard"},
		{"378282246310005", "Amex"},
		{"6011111111111117", "Discover"},
		{"1234567890123456", "Unknown"},
	}

	for _, test := range tests {
		result := getCardBrand(test.cardNumber)
		if result != test.expected {
			t.Errorf("getCardBrand(%s) = %s; expected %s", test.cardNumber, result, test.expected)
		}
	}
}