# StorytimeGPT - Firebase Backend

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Firebase Services](#firebase-services)
- [Development](#development)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)
- [Creator](#creator)

## Overview

StorytimeGPT backend is built entirely on **Firebase**, providing a serverless, scalable infrastructure for:

- **User Authentication** - Firebase Authentication with email/password
- **Database** - Cloud Firestore for structured data (users, stories, subscriptions)
- **File Storage** - Firebase Storage for media files (images, audio, video)
- **Real-time Updates** - Firebase Realtime Database for story generation status and WebSocket-like functionality
- **Cloud Functions** - Serverless functions for story generation with AI (optional)

This architecture eliminates the need for traditional REST API servers, reducing infrastructure complexity and costs.

## Architecture

### Goals and Constraints

- **Serverless Architecture** - No backend servers to manage
- **Firebase Authentication** - Native auth with email/password, supports OAuth providers
- **Firestore Database** - NoSQL document database with real-time listeners
- **Firebase Storage** - Scalable file storage with CDN
- **Realtime Database** - Real-time synchronization for story generation status
- **TypeScript throughout** - Full type safety across the codebase
- **Offline Support** - Firestore offline persistence for cached content

### Firebase Services Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React Native Client                   │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Firebase     │   │  Firestore   │   │   Storage    │
│  Auth        │   │  Database    │   │   Bucket     │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
                   ┌──────────────┐
                   │   Realtime   │
                   │   Database   │
                   └──────────────┘
```

### Project Structure

```
/
  firebase/                    # Firebase configuration (for deployment)
    firebase.json              # Firebase project configuration
    .firebaserc                # Firebase project aliases
    /firestore
      rules                    # Firestore security rules
      indexes                  # Firestore composite indexes
    /storage
      rules                    # Storage security rules
    /database
      rules.json               # Realtime Database security rules
  app/
    /services
      /firebase
        firebase.ts            # Firebase app initialization
        authService.ts          # Authentication operations
        firestoreService.ts    # Firestore CRUD operations
        storageService.ts      # File upload/download
        realtimeService.ts     # Realtime Database operations
        index.ts               # Service exports
    /types
      firebase.ts              # Firebase document and metadata types
    /utils
      constants.ts             # Constants (includes Firebase constants)
      validators.ts            # Input validation (includes Firebase validators)
      formatters.ts            # Data formatting (includes Firebase formatters)
    /hooks
      useAuth.ts               # Authentication hook
      useAuthState.ts          # Auth state monitoring hook
    /state
      authStore.ts             # Zustand auth store with Firebase integration
  README-BACKEND.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn/bun
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project created at [Firebase Console](https://console.firebase.google.com)
- Expo project with React Native client

### Installation

1. **Create Firebase Project:**

   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project: `storytimegpt`
   - Enable Authentication, Firestore, Storage, and Realtime Database

2. **Install Firebase SDK:**

   ```sh
   cd storytimegpt  # React Native project root
   pnpm add firebase
   ```

   Note: We use the Firebase JS SDK (not React Native Firebase) for Expo compatibility.

3. **Configure Environment Variables:**

   Create `.env` file:

   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
   EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
   ```

4. **Initialize Firebase in Client:**

   ```typescript
   // app/services/firebase.ts
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";
   import { getFirestore } from "firebase/firestore";
   import { getStorage } from "firebase/storage";
   import { getDatabase } from "firebase/database";

   const firebaseConfig = {
     apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
     authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
     storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
     databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export const storage = getStorage(app);
   export const realtimeDb = getDatabase(app);
   ```

## Key Features

### 1. Authentication Flow

- **Firebase Authentication** - Email/password authentication
- **Auth State Persistence** - Automatic token refresh and persistence
- **Secure Token Storage** - Uses Expo Secure Store for additional security
- **Auth State Changes** - Real-time auth state monitoring with `onAuthStateChanged`
- **Protected Routes** - Conditional screen rendering based on auth state

### 2. Story Generation

- **Async Processing** - Story generation jobs stored in Firestore
- **Status Tracking** - Realtime Database for live status updates
- **Media Generation** - AI-generated images, audio, and video stored in Firebase Storage
- **Job Queue** - Firestore collection for pending/processing/completed stories

### 3. Data Storage

- **Firestore Collections:**

  - `users` - User profiles and subscription data
  - `stories` - Story metadata and content
  - `storyJobs` - Story generation job queue
  - `subscriptions` - Subscription tier definitions

- **Storage Buckets:**
  - `images/` - Story illustrations
  - `audio/` - Story narration audio files
  - `video/` - Story video content

### 4. Real-time Updates

- **Realtime Database Paths:**
  - `/storyJobs/{jobId}/status` - Story generation status
  - `/storyJobs/{jobId}/progress` - Generation progress percentage
  - `/users/{userId}/notifications` - User notifications

### 5. Offline Support

- **Firestore Offline Persistence** - Automatic caching for offline access
- **Storage Caching** - Client-side media caching with LRU eviction
- **Sync on Reconnect** - Automatic data synchronization when online

## Firebase Services

### Authentication Service

**File:** `app/services/firebase/authService.ts`

- `signIn(email, password)` - Sign in with email/password
- `signUp(email, password, name?)` - Create new user account
- `signOut()` - Sign out current user
- `sendPasswordReset(email)` - Send password reset email
- `updateProfile(name, photoURL?)` - Update user profile
- `onAuthStateChanged(callback)` - Listen to auth state changes

### Firestore Service

**File:** `app/services/firebase/firestoreService.ts`

**User Operations:**

- `getUser(userId)` - Get user document
- `updateUser(userId, data)` - Update user profile
- `updateSubscriptionTier(userId, tier)` - Update subscription tier

**Story Operations:**

- `createStory(userId, storyData)` - Create new story document
- `getStory(storyId)` - Get story by ID
- `getUserStories(userId)` - Get all stories for a user
- `updateStoryStatus(storyId, status)` - Update story generation status
- `deleteStory(storyId)` - Delete story

**Story Job Operations:**

- `createStoryJob(userId, prompt, title?)` - Create story generation job
- `getStoryJob(jobId)` - Get job status
- `updateStoryJob(jobId, updates)` - Update job progress

### Storage Service

**File:** `app/services/firebase/storageService.ts`

- `uploadImage(file, storyId, index)` - Upload story image
- `uploadAudio(file, storyId)` - Upload story audio
- `uploadVideo(file, storyId, index)` - Upload story video
- `getDownloadURL(path)` - Get public download URL
- `deleteFile(path)` - Delete file from storage
- `getFileMetadata(path)` - Get file metadata (size, contentType)

### Realtime Database Service

**File:** `app/services/firebase/realtimeService.ts`

- `subscribeToStoryStatus(jobId, callback)` - Listen to story generation status
- `updateStoryStatus(jobId, status)` - Update story status in realtime
- `subscribeToUserNotifications(userId, callback)` - Listen to user notifications
- `unsubscribe(path)` - Unsubscribe from realtime updates

## Development

### Firestore Data Models

```typescript
// User Document
interface UserDocument {
  id: string;
  email: string;
  name?: string;
  subscriptionTier: "free" | "silver" | "gold" | "platinum";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Story Document
interface StoryDocument {
  id: string;
  userId: string;
  title: string;
  text: string;
  images: string[]; // Storage paths
  audio?: string; // Storage path
  videos?: string[]; // Storage paths
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Story Job Document
interface StoryJobDocument {
  id: string;
  userId: string;
  storyId: string;
  prompt: string;
  title?: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number; // 0-100
  error?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Security Rules

**Firestore Rules** (`firestore/rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can read/write their own stories
    match /stories/{storyId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;
    }

    // Story jobs follow same rules as stories
    match /storyJobs/{jobId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

**Storage Rules** (`storage/rules`):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{storyId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
    match /audio/{storyId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.resource.size < 50 * 1024 * 1024; // 50MB limit
    }
    match /video/{storyId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.resource.size < 200 * 1024 * 1024; // 200MB limit
    }
  }
}
```

### Error Handling

- Firebase errors are caught and converted to user-friendly messages
- Network errors are handled with retry logic
- Offline errors are queued and synced when online
- Authentication errors trigger sign-out flow

### Performance Optimizations

- Firestore queries use indexes for efficient reads
- Pagination for large story lists
- Image compression before upload
- Lazy loading for media files
- Firestore offline persistence enabled

## Deployment

### Firebase Project Setup

1. **Initialize Firebase CLI:**

   ```sh
   npm install -g firebase-tools
   firebase login
   ```

2. **Navigate to Firebase config directory:**

   ```sh
   cd firebase
   firebase init
   ```

   Select:

   - Firestore
   - Storage
   - Realtime Database

3. **Deploy Security Rules:**

   ```sh
   firebase deploy --only firestore:rules
   firebase deploy --only storage:rules
   ```

4. **Deploy Firestore Indexes:**

   ```sh
   firebase deploy --only firestore:indexes
   ```

### Environment Configuration

Configure Firebase environment variables in client:

- Development: `.env.development`
- Staging: `.env.staging`
- Production: `.env.production`

### Monitoring

- **Firebase Console** - Monitor usage, errors, and performance
- **Firebase Analytics** - Track user behavior
- **Crashlytics** - Crash reporting (if integrated)
- **Performance Monitoring** - App performance metrics

## Security

### Authentication Security

- ✅ Firebase Auth handles password hashing and secure token generation
- ✅ Short-lived ID tokens with automatic refresh
- ✅ Secure token storage in Expo Secure Store
- ✅ Email verification support
- ✅ Password reset flow

### Data Security

- ✅ Firestore security rules enforce user data isolation
- ✅ Storage rules prevent unauthorized file access
- ✅ User can only access their own stories and data
- ✅ Input validation on client and server (Cloud Functions)

### Network Security

- ✅ HTTPS-only communication
- ✅ Firebase SDK handles encryption
- ✅ No API keys exposed in client code (use environment variables)

## Deployment Checklist

Before deploying to production:

- [ ] Configure Firebase project with production settings
- [ ] Deploy Firestore security rules
- [ ] Deploy Storage security rules
- [ ] Create Firestore composite indexes
- [ ] Set up Firebase Analytics
- [ ] Configure error monitoring (Crashlytics)
- [ ] Test authentication flows (sign in, sign up, password reset)
- [ ] Test story generation and media uploads
- [ ] Test offline functionality
- [ ] Verify security rules prevent unauthorized access
- [ ] Set up billing alerts in Firebase Console
- [ ] Configure backup strategy for Firestore data

## Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test Firebase operations locally
5. Ensure TypeScript compiles: `pnpm typecheck`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier (configured in project)
- Write meaningful commit messages
- Add JSDoc comments for public APIs
- Follow the existing project structure

### Pull Request Process

1. Update README-BACKEND.md if needed
2. Ensure all CI checks pass (lint, typecheck)
3. Test Firebase operations in development environment
4. Request review from maintainers
5. Address review feedback

### Reporting Issues

Use GitHub Issues to report bugs or request features. Include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Firebase project configuration (sanitized)
- Environment details (OS, device, Firebase SDK version)
- Screenshots if applicable

## License

This project is licensed under the **MIT License with Commons Clause restriction** - see the [LICENSE](../LICENSE) and [NOTICE](../NOTICE) files for details.

### What You Can Do

- ✅ **View and inspect** the source code for personal understanding and evaluation
- ✅ **Learn from** the codebase for educational purposes

### What Requires Permission

You may **NOT** use, copy, modify, merge, publish, distribute, sublicense, host, or integrate the Software or any part of it into any commercial or non-commercial product, service, or codebase without **explicit written permission** from the Licensor (Aditya Tripathi).

This includes:

- ❌ Using the code in your own projects
- ❌ Modifying or creating derivative works
- ❌ Redistributing the Software
- ❌ Integrating into any product or service
- ❌ Selling products or services based on this Software

### Requesting Permission

To request permission to use this Software:

- Open an issue in the repository
- Contact the copyright holder through the repository
- Provide details about your intended use case

**Note:** The [NOTICE](../NOTICE) file must be included with all copies or substantial portions of the Software.

## Creator

**StorytimeGPT Backend** is developed and maintained by [**Aditya Tripathi**.](https://adityatripathi.dev)

### Contact

- **Repository**: https://github.com/aditya04tripathi/storytimegpt
- **Issues**: https://github.com/aditya04tripathi/storytimegpt/issues
- **Documentation**: https://github.com/aditya04tripathi/storytimegpt/blob/main/README-BACKEND.md
