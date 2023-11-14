/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['pdf2json']
    },
        images: {
        domains: ['www6b3.wolframalpha.com']
},

}

module.exports = nextConfig


