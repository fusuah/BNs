/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"randomuser.me",
			"nutribuddy-assist-portal.lovable.app",
			"firebasestorage.googleapis.com",
		],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
				pathname: "/**", // allow all Firebase image paths
			},
		],
	},
	devIndicators: false,
};

export default nextConfig;
