const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude problematic directories that cause VS Code issues
config.resolver.blacklistRE = /node_modules\/.*\/android\/.*|node_modules\/.*\/ios\/.*/;

// Exclude specific paths that cause file reading errors
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
