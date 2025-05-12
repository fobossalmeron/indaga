import { RichTextField } from "@prismicio/client";

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
    end_date?: string;
    cost?: RichTextField;
    time?: RichTextField;
  };
}

export const categories = ["Arte", "Gastronomía", "Música", "Cultura"];
