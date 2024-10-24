const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx'], // Ensure all relevant file extensions are handled
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'json'], // Add other asset types if needed
    // You can also add additional settings here if needed
  },
  transformer: {
    // You can add custom transformers if required
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

