    module.exports = function(api) {
      api.cache(true);
      return {
      presets: [
      ["babel-preset-expo"],
    ],
        plugins: [
          [
            'module-resolver',
            {
              alias: {
                '@': './src',
                '@assets': './assets',
                '@api': './src/api',
                '@components': './src/components',
                '@features': './src/features',
                '@store': './src/store',
                '@services': './src/services',
                '@navigation': './src/navigation',
                '@theme': './src/theme',
                '@utils': './src/utils',
                '@hoc': './src/hoc',
              },
            },
          ],
        ],
      };
    };