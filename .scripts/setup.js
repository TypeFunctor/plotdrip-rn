#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// ANSI color codes for better terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════════════╗
║               PlotDrip Setup Assistant                 ║
║         React Native + Web Development Setup           ║
╚════════════════════════════════════════════════════════╝${colors.reset}
`);

// Check if Node.js and npm are installed
try {
  const nodeVersion = execSync('node -v').toString().trim();
  const npmVersion = execSync('npm -v').toString().trim();
  
  console.log(`${colors.green}✓ Node.js ${nodeVersion} detected${colors.reset}`);
  console.log(`${colors.green}✓ npm ${npmVersion} detected${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}✗ Error: Node.js and npm are required but not detected.${colors.reset}`);
  console.log(`Please install Node.js from https://nodejs.org/`);
  process.exit(1);
}

// Function to check if a command exists
function commandExists(command) {
  try {
    execSync(os.platform() === 'win32' 
      ? `where ${command}`
      : `which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check for Expo CLI
const hasExpo = commandExists('expo');
if (!hasExpo) {
  console.log(`${colors.yellow}! Expo CLI not detected. Installing globally...${colors.reset}`);
  try {
    execSync('npm install -g expo-cli', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Expo CLI installed successfully${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}! Could not install Expo CLI globally. Will use npx instead.${colors.reset}`);
  }
}

// Install dependencies
console.log(`\n${colors.bright}Installing project dependencies...${colors.reset}`);
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log(`${colors.green}✓ Dependencies installed successfully${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}✗ Error installing dependencies: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Display instructions
console.log(`\n${colors.bright}${colors.cyan}PlotDrip App Launch Options:${colors.reset}`);
console.log(`\n${colors.bright}Web Development:${colors.reset}`);
console.log(`  ${colors.cyan}npm run dev${colors.reset}     - Start Vite development server for web`);
console.log(`  ${colors.cyan}npm run build${colors.reset}   - Build web version for production`);
console.log(`  ${colors.cyan}npm run preview${colors.reset} - Preview production web build locally`);

console.log(`\n${colors.bright}Mobile Development:${colors.reset}`);
console.log(`  ${colors.cyan}npm run start${colors.reset}   - Start Expo development server`);
console.log(`  ${colors.cyan}npm run android${colors.reset} - Start Android app (requires Android SDK)`);
console.log(`  ${colors.cyan}npm run ios${colors.reset}     - Start iOS app (requires macOS and Xcode)`);
console.log(`  ${colors.cyan}npm run web${colors.reset}     - Start web app using Expo (alternative to Vite)`);

console.log(`\n${colors.bright}${colors.green}Setup Complete!${colors.reset}`);
console.log(`For more information, check the README.md file.\n`);