export interface HappeningProps {
    slug: string;
    category: (typeof categories)[number];
    title: string;
    image: string;
    location: string;
    locationUrl: string;
    description: string;
    fecha: Date;
  }

  export const categories = ["Arte", "Gastronomía", "Música", "Cultura"];
