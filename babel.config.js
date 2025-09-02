module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@icons': './assets/icons',
            '@images/*': './assets/images',
            '@fonts/*': './assets/fonts',
            '@auth/*': './src/components/auth',
            '@common/*': './src/components/common',
            '@home/*': './src/components/home',
            '@diary/*': './src/components/diary',
            '@letter/*': './src/components/letter',
            '@counseling/*': './src/components/counseling',
            '@navigation/*': './src/components/navigation',
          },
          extensions: ['.tsx', '.ts', '.js', '.jsx'],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
