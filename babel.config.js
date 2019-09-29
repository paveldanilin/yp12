module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          firefox: '60',
          chrome: '64',
          safari: '11.1',
          ie: '10',
        },
        useBuiltIns: 'usage', // эта настройка babel-polyfill, если стоит значение usage, то будут подставлятся полифилы для версий браузеров которые указали выше.
        corejs: '3.2.1', // явно проставить версию corejs
      },
    ],
  ],
};
