import { ImageFieldImage } from "@prismicio/types";
import { RichTextField } from "@prismicio/types";
export interface RouteProps {
    route: {
      data: {
        slug: string;
        category: (typeof routeCategories)[number];
        title: string;
        image: ImageFieldImage ;
        description: RichTextField;
      };
    };
    openModal: () => void;
  }

export const routeCategories = ["Fuera de la ciudad", "En la ciudad"] as const;