import { PrismicRichText } from "@prismicio/react";
import { Content, RichTextField } from "@prismicio/client";

export interface HappeningProps {
    uid: string;
    data: {
        category: (typeof categories)[number];
        title: string;
        image: {
                    url: string;
        };
        location_name: string;
        location_url: string;
        description: RichTextField;
        date: string;
    };
  }

  export const categories = ["Arte", "Gastronomía", "Música", "Cultura"];
