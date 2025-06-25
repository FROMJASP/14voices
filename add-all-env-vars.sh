#!/bin/bash

echo "Adding all environment variables from .env.local to Vercel production..."
echo ""

# Counter for tracking
added=0
skipped=0
failed=0

# Read each line from .env.local
while IFS= read -r line; do
    # Skip empty lines and comments
    if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
        continue
    fi
    
    # Extract key and value
    if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        
        # Remove leading/trailing whitespace from key
        key=$(echo "$key" | xargs)
        
        # Skip certain variables that shouldn't be in production
        if [[ "$key" == "POSTGRES_URL_NO_SSL" ]]; then
            echo "⏭️  Skipping $key (not needed in production)"
            ((skipped++))
            continue
        fi
        
        echo -n "Adding $key... "
        
        # Try to add the variable
        if echo "$value" | vercel env add "$key" production 2>/dev/null; then
            echo "✅"
            ((added++))
        else
            # If it fails, it might already exist, try to remove and re-add
            if vercel env rm "$key" production --yes 2>/dev/null; then
                if echo "$value" | vercel env add "$key" production 2>/dev/null; then
                    echo "✅ (updated)"
                    ((added++))
                else
                    echo "❌ Failed"
                    ((failed++))
                fi
            else
                echo "❌ Failed"
                ((failed++))
            fi
        fi
    fi
done < .env.local

echo ""
echo "Summary:"
echo "✅ Added/Updated: $added"
echo "⏭️  Skipped: $skipped"
echo "❌ Failed: $failed"
echo ""
echo "Next step: Run 'vercel --prod' to deploy with the new environment variables"