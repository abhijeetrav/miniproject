// // next.config.js
// const path = require('path')
// module.exports = {
//   webpack(config) {
//     config.resolve.alias['@components'] = path.join(__dirname, 'components')
//     config.resolve.alias['@'] = path.join(__dirname, '')
//     return config
//   }
// }


// next.config.js
// const withTM = require('next-transpile-modules')(['some-package']); // example
// module.exports = withTM({
//   reactStrictMode: true,
//   // बाकी config
// });


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // allow external images
  },
  env: {
    API_URL: 'https://api.example.com',
  },
}

module.exports = nextConfig
