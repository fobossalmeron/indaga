"use client";

import { TSLocation } from "./TSLocation";
import { Fade } from "react-awesome-reveal";

const treasureLocations = [
  {
    title: "Seis Tierras",
    audioSrc: "/audio/test.ogg",
    logoSrc: "/img/seis-tierras-logo.svg",
  },
  {
    title: "Taller Vegánico",
    audioSrc: "/audio/taller-veganico.mp3",
    logoSrc: "/img/taller-veganico-logo.svg",
  },
  {
    title: "Ray Bar",
    audioSrc: "/audio/ray-bar.mp3",
    logoSrc: "/img/ray-bar-logo.svg",
  },
];

export default function TreasureHunt() {
  return treasureLocations.map((location) => (
    <Fade cascade damping={0.1} key={location.title}>
      <TSLocation location={location} />
    </Fade>
  ));
}
