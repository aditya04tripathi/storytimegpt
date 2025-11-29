#!/bin/bash

low_payload='{
  "message": "Failed to cache image: Network request timeout",
  "error": "NetworkError",
  "stack": "at ImageCacheService.cacheImage (ImageCacheService.ts:45:12)\n    at async MediaCacheService.getCachedImage (MediaCacheService.ts:78:23)\n    at async StoryCard.renderImage (StoryCard.tsx:123:45)",
  "severity": "low",
  "context": {
    "userId": "user_abc123xyz",
    "screen": "library",
    "action": "load_story_thumbnail",
    "component": "StoryCard",
    "metadata": {
      "imageUrl": "https://example.com/story-thumbnail.jpg",
      "retryCount": 1
    }
  },
  "userAgent": "StorytimeGPT/1.0.0 (iOS; iPhone 14 Pro; iOS 17.2)",
  "platform": "react-native",
  "appVersion": "1.0.0",
  "timestamp": "2024-01-15T10:23:45.123Z"
}'

medium_payload='{
  "message": "Story generation API request timed out after 60 seconds",
  "error": "TimeoutError",
  "stack": "at AxiosInstance.request (axios.ts:98:15)\n    at generateStoryWithRetry (storyGenerationService.ts:142:28)\n    at async handleCreateStory (index.tsx:234:56)\n    at async onPress (index.tsx:198:12)",
  "severity": "medium",
  "context": {
    "userId": "user_def456uvw",
    "screen": "home",
    "action": "generate_story",
    "component": "HomeScreen",
    "metadata": {
      "storyTitle": "The Magic Forest",
      "retryAttempt": 2,
      "apiEndpoint": "https://storytime-gpt-api.up.railway.app/generate"
    }
  },
  "userAgent": "StorytimeGPT/1.0.0 (Android; Pixel 7; Android 14)",
  "platform": "react-native",
  "appVersion": "1.0.0",
  "timestamp": "2024-01-15T14:56:12.789Z"
}'

high_payload='{
  "message": "Unauthorized access attempt: Invalid Firebase ID token",
  "error": "UnauthorizedError",
  "stack": "at verifyIdToken (authService.ts:67:23)\n    at async refreshUser (authStore.ts:89:12)\n    at async useAuthEffect (useAuth.ts:45:23)\n    at async AuthProvider.initialize (AuthProvider.tsx:34:12)",
  "severity": "high",
  "context": {
    "userId": "user_ghi789rst",
    "screen": "profile",
    "action": "refresh_auth_token",
    "component": "AuthProvider",
    "metadata": {
      "tokenExpired": true,
      "lastRefresh": "2024-01-15T08:00:00.000Z",
      "attemptedRefresh": "2024-01-15T14:30:00.000Z"
    }
  },
  "userAgent": "StorytimeGPT/1.0.0 (iOS; iPad Pro; iOS 17.1)",
  "platform": "react-native",
  "appVersion": "1.0.0",
  "timestamp": "2024-01-15T14:30:15.456Z"
}'

critical_payload='{
  "message": "Payment processing failed: Stripe API returned 500 error during subscription upgrade",
  "error": "PaymentError",
  "stack": "at processPayment (paymentService.ts:156:34)\n    at async handleSubscriptionUpgrade (subscription.tsx:189:45)\n    at async onPress (subscription.tsx:145:23)\n    at Object.touchableHandlePress (TouchableOpacity.js:98:12)",
  "severity": "critical",
  "context": {
    "userId": "user_jkl012mno",
    "screen": "subscription",
    "action": "payment",
    "component": "SubscriptionScreen",
    "metadata": {
      "tier": "gold",
      "amount": 9.99,
      "currency": "USD",
      "paymentMethod": "card_ending_4242",
      "stripeErrorCode": "api_error",
      "transactionId": "txn_7x8y9z0a1b2c"
    }
  },
  "userAgent": "StorytimeGPT/1.0.0 (Android; Samsung Galaxy S23; Android 13)",
  "platform": "react-native",
  "appVersion": "1.0.0",
  "timestamp": "2024-01-15T16:45:30.987Z"
}'

URL="https://adityatripathi.dev/api/webhook"

echo "Sending low severity error..."
curl -s -X POST "$URL" -H "Content-Type: application/json" -d "$low_payload"
echo -e "\n---"
sleep 1

echo "Sending medium severity error..."
curl -s -X POST "$URL" -H "Content-Type: application/json" -d "$medium_payload"
echo -e "\n---"
sleep 1

echo "Sending high severity error..."
curl -s -X POST "$URL" -H "Content-Type: application/json" -d "$high_payload"
echo -e "\n---"
sleep 1

echo "Sending critical severity error..."
curl -s -X POST "$URL" -H "Content-Type: application/json" -d "$critical_payload"
echo -e "\n---"

echo "All error webhook requests sent."
