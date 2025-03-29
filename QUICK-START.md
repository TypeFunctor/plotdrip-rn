# PlotDrip Quick Start Guide

This guide will help you quickly set up and run the PlotDrip application on your preferred platform.

## Initial Setup

Run the setup script to install dependencies and configure your environment:

```bash
# Install dependencies and configure environment
npm run setup
```

## Launching the App

### Using the Launch Helper

The easiest way to launch the app is using our interactive launcher:

```bash
npm run launch
```

This will present you with all available platform options to choose from.

### Direct Launch Commands

Alternatively, you can use these direct commands:

#### For Web Development (Recommended for most web development)

```bash
# Start Vite development server
npm run dev
```

#### For Mobile Development

```bash
# Start Expo development server that gives options for all platforms
npm run start

# OR launch directly on a specific platform
npm run android
npm run ios
npm run web  # Expo's web version
```

## What Next?

1. Explore the code in the `src` directory
2. Check the components in `src/components`
3. Modify `src/App.tsx` to customize the application
4. Review the full documentation in README.md

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are correctly installed
2. Check that you have the correct versions of Node.js and npm
3. For Android/iOS issues, verify that your development environment is properly set up

Need more help? Check the README.md file for detailed documentation.