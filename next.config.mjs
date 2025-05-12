/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.prismic.io",
        pathname: "/indaga/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/happenings",
        destination: "/agenda",
        permanent: true,
      },
      {
        source: "/happenings/:slug",
        destination: "/agenda/:slug",
        permanent: true,
      },
    ];
  },
  webpack(config) {
    // Encuentra la regla existente que maneja las importaciones de SVG
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    // Agrega nuevas reglas al arreglo de reglas de módulos
    config.module.rules.push(
      // Aplica la regla existente solo para importaciones de SVG que terminan en ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // Ejemplo: *.svg?url
      },
      // Convierte las importaciones de SVG que terminan en ?unoptimized a componentes React sin optimizaciones de svgo
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: /unoptimized/, // Ejemplo: *.svg?unoptimized
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: false, // Desactiva las optimizaciones de svgo
            },
          },
        ],
      },
      // Convierte todas las demás importaciones de SVG a componentes React con optimizaciones de svgo
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [
            ...(fileLoaderRule.resourceQuery?.not || []),
            /url/,
            /unoptimized/,
          ],
        }, // Excluye *.svg?url y *.svg?unoptimized
        use: ["@svgr/webpack"],
      },
    );

    // Modifica la regla del cargador de archivos para ignorar *.svg
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
