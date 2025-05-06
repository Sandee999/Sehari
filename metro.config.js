const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const {   wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname)

const config = withNativeWind(defaultConfig, { input: './src/global.css' })

module.exports = wrapWithReanimatedMetroConfig(config);