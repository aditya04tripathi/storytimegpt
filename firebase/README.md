# Firebase Configuration

This directory contains Firebase configuration files and security rules for deployment.

## Files

- `firebase.json` - Firebase project configuration
- `.firebaserc` - Firebase project aliases for different environments
- `firestore/rules` - Firestore security rules
- `firestore/indexes` - Firestore composite indexes
- `storage/rules` - Storage security rules
- `database/rules.json` - Realtime Database security rules

## Deployment

### Initial Setup

1. **Install Firebase CLI:**

   ```sh
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**

   ```sh
   firebase login
   ```

3. **Initialize Firebase (if not already done):**
   ```sh
   cd firebase
   firebase init
   ```

### Deploy Security Rules

```sh
cd firebase
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
firebase deploy --only database
```

### Deploy Firestore Indexes

```sh
cd firebase
firebase deploy --only firestore:indexes
```

### Deploy All

```sh
cd firebase
firebase deploy
```

## Project Aliases

The `.firebaserc` file contains project aliases:

- `default` - Main project
- `development` - Development environment
- `staging` - Staging environment
- `production` - Production environment

Switch between projects:

```sh
firebase use development
firebase use production
```
