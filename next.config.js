/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['pdf2json', 'node-magickwand']
    },
        images: {
        domains: ['www6b3.wolframalpha.com']
},

}

module.exports = nextConfig


