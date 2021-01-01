const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  images: {
    domains: ['localhost'],
  },
  compress: true, // html, js, css등을 gzip으로 압축하여 용량을 줄여준다.
  // 커스텀 웹팩을 설정하려면 next.config.js에서 한다.
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production';
    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-source-map' : 'eval',
      plugins: [
        ...config.plugins,
        // moment 용량을 줄위기 위한 설정 코드.
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
      ],
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {

          },
        ],
      },
    };
  },
});
