# PlotDrip - React Native and Web E-Reader Application

A cross-platform e-reader application built with React Native and React Native Web, allowing you to run on iOS, Android, and Web platforms from a single codebase.

## Features

- Book library management
- E-book reading experience
- Chapter navigation
- Knowledge graph visualization
- Literary devices tracking
- Novel planning tools
- Multiple reading branches
- Import books from various formats

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- For iOS development: macOS with Xcode installed
- For Android development: Android Studio with SDK configured

## Project Setup

### Quick Setup

Run the setup script to install dependencies and configure your environment:

```bash
# Make the script executable (Unix/macOS)
chmod +x .scripts/setup.js

# Run the setup script
node .scripts/setup.js
```

### Manual Setup

1. Install dependencies:
   ```bash
   npm install
   ```
   
2. Install Expo CLI globally (optional but recommended):
   ```bash
   npm install -g expo-cli
   ```

## Running the Application

### Web Development (Using Vite)

```bash
# Start Vite development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Mobile Development (Using Expo)

```bash
# Start Expo development server
npm run start

# Run on Android
npm run android

# Run on iOS (requires macOS)
npm run ios

# Run web version through Expo
npm run web
```

## Project Structure

- `/src` - Main application code
  - `/components` - React components
  - `/data` - Sample data and models
  - `/utils` - Utility functions and services
- `/public` - Static assets for web
- `/App.jsx` - Entry point for React Native

## Development Notes

- React Native components are used throughout the application for cross-platform compatibility
- The app uses the `react-native-web` package to render React Native components on the web
- Vite is configured to alias 'react-native' to 'react-native-web' for web development

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build web version for production
- `npm run preview` - Preview production build
- `npm run start` - Start Expo development server
- `npm run android` - Start on Android device/emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version using Expo
- `npm run eject` - Eject from Expo (use with caution)

## License

This project is licensed under the MIT License.