// jest.mock('react-native-navigation', () => {
//   return {
//     Navigation: {
//       registerComponent: jest.fn(),
//       registerComponentWithRedux: jest.fn(),
//       setRoot: jest.fn(),
//       setDefaultOptions: jest.fn(),
//       mergeOptions: jest.fn(),
//       showModal: jest.fn(),
//       dismissModal: jest.fn(),
//       dismissAllModals: jest.fn(),
//       push: jest.fn(),
//       pop: jest.fn(),
//       popTo: jest.fn(),
//       popToRoot: jest.fn(),
//       setStackRoot: jest.fn(),
//       showOverlay: jest.fn(),
//       dismissOverlay: jest.fn(),
//       getLaunchArgs: jest.fn(),
//       events: () => ({
//         registerAppLaunchedListener: jest.fn(),
//         registerComponentDidAppearListener: jest.fn(),
//         registerComponentDidDisappearListener: jest.fn(),
//         registerCommandCompletedListener: jest.fn(),
//         registerBottomTabSelectedListener: jest.fn(),
//         registerNavigationButtonPressedListener: jest.fn(),
//         registerModalDismissedListener: jest.fn(),
//         registerSearchBarUpdatedListener: jest.fn(),
//         registerSearchBarCancelPressedListener: jest.fn(),
//         registerPreviewCompletedListener: jest.fn(),
//         registerCommandListener: () => ({
//           remove: jest.fn(),
//         }),
//         bindComponent: () => ({
//           remove: jest.fn(),
//         }),
//       }),
//       constants: () => ({
//         statusBarHeight: 0,
//         topBarHeight: 0,
//         backButtonId: 0,
//         bottomTabsHeight: 0,
//       }),
//     },
//   }
// })
