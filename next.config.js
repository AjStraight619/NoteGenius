/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['pdf2json', 'node-magickwand']
    }
}

module.exports = nextConfig
