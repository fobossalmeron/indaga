import Image from "next/image";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import { HappeningProps } from "./happenings.types";

interface HappeningCardProps extends Omit<HappeningProps, 'description'> {}

export const HappeningCard: React.FC<HappeningCardProps> = ({
  category,
  title,
  location,
  locationUrl,
  fecha,
  image,
}) => {
  return (
    <article className="max-w-64 w-full bg-white rounded-xl flex flex-col">
      <div className="h-32 w-full bg-gray-200 relative">
        <Image
          src={image}
          alt={`Imagen de ${title}`}
          fill={true}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex flex-col p-8 py-4">
        <span className="text-sm text-gray-500">{category}</span>
        <h2>{title}</h2>
        <p className="text-blue">@{location}</p>
        <p>{fecha.toLocaleDateString()}</p>
        <Button>Ver evento</Button>
      </div>
    </article>
  );
};
