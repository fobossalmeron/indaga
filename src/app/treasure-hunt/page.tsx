"use client";

import { TreasureLocation } from "./TreasureLocation";
import { Fade } from "react-awesome-reveal";
import { treasureLocations } from "./treasureLocations";

export default function TreasureHunt() {
  return treasureLocations.map((location) => (
    <Fade cascade damping={0.1} key={location.title}>
      <TreasureLocation location={location} />
    </Fade>
  ));
}
