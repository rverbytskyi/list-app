module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    '/node_modules/(?!(react-native-navigation)/)'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/unit-tests-setup.js',
    "@testing-library/jest-native/extend-expect",
  ],
}
