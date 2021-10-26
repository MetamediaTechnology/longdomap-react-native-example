module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    ['@babel/preset-env', { "targets": "iOS >= 11, Android >= 56" }],
  ],
}