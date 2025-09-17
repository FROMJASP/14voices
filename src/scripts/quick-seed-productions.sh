#!/bin/bash

echo "🌱 Creating productions via API..."

# Create Videoproductie
curl -X POST http://localhost:3000/api/productions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Videoproductie",
    "slug": "videoproductie",
    "basePrice": 175,
    "description": "Video'\''s voor intern gebruik of online plaatsing, zonder advertentiebudget. Bij inzet als betaalde advertentie kies je voor '\''Web Commercial'\''.",
    "buyoutDuration": "12 maanden",
    "pricingType": "wordBased",
    "wordPricingTiers": [
      { "minWords": 0, "maxWords": 250, "additionalPrice": 0 },
      { "minWords": 250, "maxWords": 500, "additionalPrice": 50 },
      { "minWords": 500, "maxWords": 1000, "additionalPrice": 150 },
      { "minWords": 1000, "maxWords": 1500, "additionalPrice": 225 }
    ],
    "wordPricingFormula": {
      "enabled": true,
      "pricePerWord": 0.35,
      "explanation": "Voor scripts boven de 1500 woorden rekenen we €0,35 per extra woord."
    },
    "status": "active",
    "sortOrder": 1
  }'

echo "✅ Done creating productions"