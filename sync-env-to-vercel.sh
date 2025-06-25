#!/bin/bash

echo "Syncing environment variables from .env.local to Vercel production..."
echo ""

# Read .env.local and add each variable to Vercel
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    if [[ -z "$key" || "$key" =~ ^[[:space:]]*# ]]; then
        continue
    fi
    
    # Remove leading/trailing whitespace
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)
    
    # Skip if no value
    if [[ -z "$value" ]]; then
        continue
    fi
    
    echo "Adding $key..."
    
    # Check if variable already exists and remove it first
    vercel env rm "$key" production --yes 2>/dev/null
    
    # Add the variable
    echo "$value" | vercel env add "$key" production
    
done < .env.local

echo ""
echo "✅ Environment variables synced to Vercel!"
echo ""
echo "Next steps:"
echo "1. Run 'vercel --prod' to deploy with the new environment variables"
echo "2. Visit https://design-experiment-pink.vercel.app/admin to test"