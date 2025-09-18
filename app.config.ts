import 'dotenv/config';

export default {
  expo: {
    name: 'PetFarewell',
    slug: 'PetFarewell',
    scheme: 'petfarewell',
    version: '1.0.0',
    updates: {
      url: 'https://u.expo.dev/a2951c35-3011-49d9-a5c1-a4b9d04d8ae6',
    },
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash-logo.png',
      resizeMode: 'contain',
      backgroundColor: '#121826',
    },
    ios: {
      supportsTablet: true,
      runtimeVersion: {
        policy: '1.0.0',
      },
      bundleIdentifier: 'org.name.PetFarewell',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#121826',
      },
      edgeToEdgeEnabled: true,
      package: 'com.PetFarewell',
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          category: ['BROWSABLE', 'DEFAULT'],
          data: [
            {
              scheme: 'https',
              host: 'petfarewell.site',
              pathPrefix: '/',
            },
          ],
        },
      ],
      runtimeVersion: '1.0.0',
    },
    plugins: [
      [
        'react-native-bootsplash',
        {
          assetsDir: 'assets/bootsplash',
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            kotlinVersion: '2.0.21',
            extraMavenRepos: ['https://devrepo.kakao.com/nexus/content/groups/public/'],
          },
        },
      ],
      [
        '@react-native-seoul/kakao-login',
        {
          kakaoAppKey: process.env.KAKAO_NATIVE_APP_KEY,
          overrideKakaoSDKVersion: 'latest',
        },
      ],
    ],
    web: {
      favicon: './assets/images/favicon.png',
    },
    extra: {
      eas: {
        projectId: 'a2951c35-3011-49d9-a5c1-a4b9d04d8ae6',
      },
    },
  },
};
