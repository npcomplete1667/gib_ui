/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['pbs.twimg.com', "cdn.discordapp.com"],
    },
    externals: ['pino-pretty'],
}

module.exports = nextConfig
