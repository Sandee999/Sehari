const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config'); 

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.unstable_enablePackageExports = false;
 
const nativewindConfig = withNativeWind(defaultConfig, { input: './src/global.css' });

const reanimatedConfig = wrapWithReanimatedMetroConfig(nativewindConfig);
 
module.exports = reanimatedConfig;