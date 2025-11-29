# StorytimeGPT - React Native (Expo) Client

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Creator](#creator)

## Overview

StorytimeGPT is a cross-platform mobile application that enables users to:

- Generate personalized stories using AI
- Read stories with rich media (images, audio, video)
- Access vocabulary definitions and interactive learning features
- Work offline with cached content
- Manage subscriptions and profiles

Built with **Expo** for seamless cross-platform development (iOS, Android, Web).

## Architecture

### Goals and Constraints

- **Expo-managed workflow** - Supports Expo Image, Expo Router, Expo AV, Expo SecureStore
- **REST API** - Follows `ApiResponse<T> = { success: boolean; error?: string; data?: T }` pattern
- **Secure JWT storage** - Uses Expo Secure Store for token management
- **Async story generation** - Enqueue via `POST /story/generate`, poll status or use WebSocket/Push for updates
- **Offline-capable** - Cached story text and media for offline reading
- **TypeScript throughout** - Full type safety across the codebase

### Project Structure

```
/app
  app.json
  package.json
  tsconfig.json
  /api
    axios.ts              # Axios instance with interceptors
    endpoints.ts          # API endpoint constants
    types.ts              # TypeScript types matching backend
  /app
    _layout.tsx           # Expo Router root layout
    index.tsx             # Home screen
    auth/
      login.tsx
      register.tsx
    library/
      index.tsx           # Story library list
      [storyId].tsx       # Individual story reader
    subscription/
      index.tsx
    profile/
      index.tsx
    settings/
      index.tsx
    modals/
      payment.tsx
    /components
      /common
        Button.tsx
        IconButton.tsx
        Card.tsx
      /story
        StoryText.tsx
        InlineImage.tsx
        AudioPlayer.tsx
        VideoPlayer.tsx
        VocabularyPopup.tsx
      LottieLoading.tsx
    /hooks
      useAuth.ts
      useAxiosAuth.ts
      useStoryGeneration.ts
      useOfflineCache.ts
    /state
      authStore.ts          # Zustand auth state
      storyStore.ts         # Zustand story/library state
      uiStore.ts            # Zustand UI state
    /services
      mediaCacheService.ts  # Media caching and LRU management
      uploadService.ts
      notificationService.ts
    /utils
      validators.ts
      formatters.ts
      constants.ts
    /assets
    /styles
    index.d.ts
  /tests
  README.md
```

### Key Packages

**Expo Ecosystem:**

- `expo` - Core Expo SDK
- `expo-router` - File-based routing
- `expo-image` - Optimized image component
- `expo-av` - Audio/video playback
- `expo-secure-store` - Secure token storage
- `expo-asset` - Asset management
- `expo-file-system` - File system operations
- `expo-notifications` - Push notifications
- `expo-sqlite` - Local database (optional)

**Third-party:**

- `axios` - HTTP client
- `zustand` - State management
- `react-hook-form` - Form handling
- `moti` - Animations (with Reanimated)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn/bun
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator

### Installation

1. **Clone the repository:**

   ```sh
   git clone <repository-url>
   cd storytimegpt
   ```

2. **Install dependencies:**

   ```sh
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.development` file:

   ```
   API_BASE_URL=https://api.example.com
   ```

4. **Start the development server:**

   ```sh
   pnpm start
   # or
   npm start
   ```

5. **Run on a platform:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Or run: `pnpm ios` / `pnpm android` / `pnpm web`

## Key Features

### 1. Authentication Flow

- Secure JWT token storage using Expo Secure Store
- Automatic token refresh on 401 responses
- Zustand store for global auth state
- Protected routes with Expo Router

### 2. Story Generation

- Submit story prompts via `POST /story/generate`
- Receive `{ jobId, storyId }` in response
- Poll story status with exponential backoff
- Optional WebSocket/Push notification support
- Optimistic UI updates during generation

### 3. Offline Support

- SQLite database for story metadata
- File system caching for media (images, audio, video)
- LRU cache eviction policy
- Background download support
- Offline reading with cached content

### 4. Media Playback

- High-performance image rendering with `expo-image`
- Audio playback with `expo-av` (background audio supported)
- Video playback with synchronized controls
- Read-along text highlighting synchronized with audio

### 5. Interactive Reader

- Tappable vocabulary words with definitions
- Inline illustrations and media
- Smooth scrolling and navigation
- Accessibility support (VoiceOver, TalkBack)

## Development

### TypeScript Types

Core types in `src/api/types.ts`:

```typescript
export type ApiResponse<T> = {
  success: boolean;
  error?: string;
  data?: T;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  subscriptionTier: "free" | "silver" | "gold" | "platinum";
};

export type StorySummary = {
  id: string;
  title: string;
  thumbnail?: string;
  createdAt: string;
  status: "pending" | "processing" | "completed" | "failed";
};

export type Story = {
  id: string;
  title: string;
  text: string;
  images: Media[];
  audio?: Media;
  videos?: Media[];
  createdAt: string;
  status: "pending" | "processing" | "completed" | "failed";
};
```

### Networking Layer

Axios instance with interceptors in `src/api/axios.ts`:

- Automatic JWT token attachment from Secure Store
- `ApiResponse<T>` envelope normalization
- Error handling and token refresh
- Request/response logging in development

### State Management

Three Zustand stores:

- **authStore** - User authentication state
- **storyStore** - Story library and generation progress
- **uiStore** - UI state (modals, loading, errors)

### Error Handling

- Centralized error handling via axios interceptors
- User-friendly error messages from `ApiResponse.error`
- Toast notifications for transient errors
- Error screens with retry for critical failures

### Performance Optimizations

- Virtualized lists for large story libraries
- Lazy loading for images and media
- Debounced form inputs
- Asset preloading for critical resources
- Optimized re-renders with Zustand selectors

### Accessibility

- All interactive elements have `accessibilityLabel` and `accessibilityRole`
- Large text support and system font scaling
- WCAG AA color contrast compliance
- VoiceOver and TalkBack tested

## Deployment

### GitHub Actions CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The workflow is configured in `.github/workflows/ci.yml`.

#### Workflow Features

- **Lint and Typecheck** - Runs ESLint and TypeScript type checking on every PR
- **Build Verification** - Validates that the project builds successfully
- **Automated Releases** - Creates release builds on version tags

#### Workflow Triggers

- On pull requests to `main` branch
- On pushes to `main` branch
- On version tags (e.g., `v1.0.0`)

#### Example GitHub Actions Workflow

```yaml
name: CI/CD

on:
  push:
    branches: [main]
    tags: ["v*"]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck

  build:
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: pnpm install
      - run: pnpm build
```

### Environment Configuration

- Development: `.env.development`
- Staging: `.env.staging`
- Production: `.env.production`

Configure GitHub Secrets for CI/CD:

1. Go to repository Settings → Secrets and variables → Actions
2. Add secrets:
   - `API_BASE_URL` - Backend API URL
   - `EXPO_TOKEN` - Expo access token (if using Expo services)
   - Other environment-specific secrets

### Building Locally

For local builds:

```sh
# Development build
pnpm start

# Production build (requires Expo account)
expo build:android
expo build:ios
```

### App Store Deployment

1. Build the app using Expo build service or locally
2. Submit to App Store Connect (iOS) and Google Play Console (Android)
3. Configure app signing certificates and provisioning profiles
4. Upload builds through respective store consoles

### Monitoring

- Sentry integration for crash reporting
- Client-side metrics (generation latency, download times)
- Anonymized telemetry to backend

## Security Considerations

- ✅ JWT tokens stored only in Expo Secure Store
- ✅ Short-lived access tokens with refresh token rotation
- ✅ Automatic token refresh on 401 responses
- ✅ No API keys embedded in client code
- ✅ Input validation on client and backend
- ✅ HTTPS-only API communication

## Deployment Checklist

Before deploying to production:

- [ ] Verify backend endpoints and CORS configuration
- [ ] Test secure storage and token rotation flow
- [ ] Validate push notification integration
- [ ] Test offline reading and restore path
- [ ] Run accessibility audit
- [ ] Performance testing on low-end devices
- [ ] Security audit of token handling
- [ ] Error monitoring setup (Sentry)

## Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run linting: `pnpm lint`
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

1. Update README.md if needed
2. Ensure all CI checks pass (lint, typecheck, build)
3. Request review from maintainers
4. Address review feedback

### Reporting Issues

Use GitHub Issues to report bugs or request features. Include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, device, Expo version)
- Screenshots if applicable

## License

This project is licensed under the **MIT License with Commons Clause restriction** - see the [LICENSE](LICENSE) and [NOTICE](NOTICE) files for details.

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

**Note:** The [NOTICE](NOTICE) file must be included with all copies or substantial portions of the Software.

## Creator

**StorytimeGPT** is developed and maintained by [**Aditya Tripathi**.](https://adityatripathi.dev)

### Contact

- **Repository**: https://github.com/aditya04tripathi/storytimegpt
- **Issues**: https://github.com/aditya04tripathi/storytimegpt/issues
- **Documentation**: https://github.com/aditya04tripathi/storytimegpt/blob/main/README.md
