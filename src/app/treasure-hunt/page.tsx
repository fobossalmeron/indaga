import { Header } from "@/app/components/Header";
import { TSLocation } from "./TSLocation";
import treasure_hunt_icon from "@/assets/img/hunt_icon.svg?url";

const treasureLocations = [
  {
    title: "Seis Tierras",
    audioSrc: "/audio/seis-tierras.mp3",
    logoSrc: "/img/seis-tierras-logo.svg",
  },

  {
    title: "Ray Bar",
    audioSrc: "/audio/ray-bar.mp3",
    logoSrc: "/img/ray-bar-logo.svg",
  },
  {
    title: "Taller Vegánico",
    audioSrc: "/audio/taller-veganico.mp3",
    logoSrc: "/img/taller-veganico-logo.svg",
  },
];

export default function TreasureHunt() {
  return (
    <>
      <Header
        title="Treasure Hunt"
        subtitle="Descubre nuevas historias"
        image={treasure_hunt_icon}
      />
      <div className="mx-auto flex w-full max-w-[1020px] flex-col items-center pb-24">
        <div className="mx-auto mt-8 w-full max-w-2xl">
          {treasureLocations.map((location) => (
            <TSLocation key={location.title} location={location} />
          ))}
        </div>
      </div>
    </>
  );
}
