#!/usr/bin/env node

import { execSync } from 'child_process';
import * as readline from 'readline';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Display menu
console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════════════╗
║               PlotDrip Launch Options                  ║
╚════════════════════════════════════════════════════════╝${colors.reset}
`);

console.log(`${colors.bright}Select a platform to launch:${colors.reset}\n`);
console.log(`${colors.cyan}1. Web (Vite) ${colors.reset}- Development web server with hot-reloading`);
console.log(`${colors.cyan}2. Android ${colors.reset}   - Launch on Android device/emulator`);
console.log(`${colors.cyan}3. iOS ${colors.reset}       - Launch on iOS simulator (requires macOS)`);
console.log(`${colors.cyan}4. Expo ${colors.reset}      - Start Expo development server`);
console.log(`${colors.cyan}5. Web (Expo)${colors.reset} - Web version using Expo`);
console.log(`${colors.cyan}6. Build Web${colors.reset} - Build production web version`);
console.log(`${colors.cyan}q. Quit${colors.reset}       - Exit this launcher\n`);

rl.question(`${colors.yellow}Enter your choice: ${colors.reset}`, (answer) => {
  try {
    switch (answer.trim().toLowerCase()) {
      case '1':
        console.log(`\n${colors.green}Starting Web (Vite) version...${colors.reset}`);
        execSync('npm run dev', { stdio: 'inherit' });
        break;
      case '2':
        console.log(`\n${colors.green}Starting Android version...${colors.reset}`);
        execSync('npm run android', { stdio: 'inherit' });
        break;
      case '3':
        console.log(`\n${colors.green}Starting iOS version...${colors.reset}`);
        execSync('npm run ios', { stdio: 'inherit' });
        break;
      case '4':
        console.log(`\n${colors.green}Starting Expo development server...${colors.reset}`);
        execSync('npm run start', { stdio: 'inherit' });
        break;
      case '5':
        console.log(`\n${colors.green}Starting Web (Expo) version...${colors.reset}`);
        execSync('npm run web', { stdio: 'inherit' });
        break;
      case '6':
        console.log(`\n${colors.green}Building production web version...${colors.reset}`);
        execSync('npm run build', { stdio: 'inherit' });
        console.log(`\n${colors.bright}${colors.green}Build completed!${colors.reset}`);
        console.log(`To preview the build, run: ${colors.cyan}npm run preview${colors.reset}`);
        break;
      case 'q':
        console.log(`\n${colors.bright}Exiting launcher. Goodbye!${colors.reset}`);
        break;
      default:
        console.log(`\n${colors.red}Invalid option. Please try again.${colors.reset}`);
    }
  } catch (error) {
    console.error(`\n${colors.red}Error: ${error.message}${colors.reset}`);
  }
  
  rl.close();
});