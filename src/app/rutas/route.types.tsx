export interface RouteProps {
    slug: string;
    category: (typeof routeCategories)[number];
    title: string;
    image: string;
    description: string;
  }

export const routeCategories = ["Fuera de la ciudad", "En la ciudad"] as const;