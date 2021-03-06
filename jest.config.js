module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    '/node_modules/(?!(@react-native|react-native|react-native-navigation|@react-native-community)/)'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/unit-tests-setup.js',
    "@testing-library/jest-native/extend-expect",
  ],
}
