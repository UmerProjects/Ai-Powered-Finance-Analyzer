const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');
// Disable package exports to force using the 'main' field, which helps with Firebase v9 resolution
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
