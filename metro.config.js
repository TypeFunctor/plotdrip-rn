// Learn more https://docs.expo.io/guides/customizing-metro
import { getDefaultConfig } from 'expo/metro-config';

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(import.meta.url);

// Add support for typescript and jsx/tsx files
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

// For monorepos and native modules (if needed)
config.watchFolders = [new URL('.', import.meta.url).pathname];

export default config;