export interface HappeningProps {
    attributes: {
        slug: string;
        category: (typeof categories)[number];
        title: string;
        image: {
            data: {
                attributes: {
                    url: string;
                };
            };
        };
        location: string;
        locationUrl: string;
        description: string;
        date: string;
    };
  }

  export const categories = ["Arte", "Gastronomía", "Música", "Cultura"];
