#!/bin/bash

# Test script for sync API endpoint
# Usage: ./test-sync.sh

API_URL="https://skviirtl-server.ru/api/sync"
API_KEY="skviirtl_secret_key_123"

echo "Testing sync API endpoint..."
echo "URL: $API_URL"
echo ""

# Create test payload
PAYLOAD='{
  "secret": "'$API_KEY'",
  "onlineCount": 5,
  "maxPlayers": 100,
  "tps": "20.0",
  "players": [
    {
      "name": "TestPlayer",
      "uuid": "00000000-0000-0000-0000-000000000001",
      "balance": "1000",
      "realBalance": "500",
      "kills": "10",
      "deaths": "5",
      "clan": "[TestClan]",
      "rank": "member",
      "clanRank": "member",
      "clanBalance": "5000"
    }
  ],
  "clans": [
    {
      "name": "[TestClan]",
      "leader": "TestPlayer",
      "membersCount": 1,
      "balance": "5000",
      "kdr": "2.0",
      "rank": 0
    }
  ]
}'

echo "Sending request..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL?secret=$API_KEY&action=sync" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "HTTP Status: $HTTP_CODE"
echo "Response Body: $BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
  echo "✓ Test PASSED"
  exit 0
else
  echo "✗ Test FAILED"
  exit 1
fi
