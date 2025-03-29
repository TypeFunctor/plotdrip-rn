import React from 'react';
import { Platform } from 'react-native';

// Import the web or native app based on platform
let AppComponent;

if (Platform.OS === 'web') {
  // For web, use the existing App.tsx
  AppComponent = require('./src/App').default;
} else {
  // For mobile platforms, we'll use the same component but ensure mobile compatibility
  AppComponent = require('./src/App').default;
}

export default function App() {
  return <AppComponent />;
}