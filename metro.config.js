const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

/**
 * React Navigation 7 Fix:
 * Enable unstable_enablePackageExports to allow Metro to resolve ESM-style exports 
 * and explicit .js extensions within package modules (required by newer navigation libs).
 */
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['browser', 'require', 'import'];

module.exports = config;
