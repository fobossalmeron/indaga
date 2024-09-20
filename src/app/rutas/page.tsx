"use client";

import { useState, useEffect } from "react";
import { RouteCard } from "./RouteCard";
import { Fade } from "react-awesome-reveal";
import FraseRutas from "@/assets/img/frase_rutas.svg";
import { Modal } from "@/app/components/Modal";
import { Button } from "@/app/components/Button";
import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";

export default function RoutesAll() {
  const [routes, setRoutes] = useState<Content.RouteDocument[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoutes() {
      const client = createClient();
      const fetchedRoutes = await client.getAllByType("route");
      setRoutes(fetchedRoutes);
      setIsLoading(false);
    }

    fetchRoutes();
  }, []);

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  if (isLoading) {
    return <div>Cargando rutas...</div>;
  }
  console.log(routes);

  return (
    <>
      <div className="flex justify-center text-ocre">
        <Fade>
          <FraseRutas />
        </Fade>
      </div>
      <div className="mt-16 flex w-full flex-wrap justify-center gap-8 pb-24">
        <Fade cascade damping={0.1}>
          {routes.map((route, index) => (
            <RouteCard
              key={index + "route"}
              route={route}
              openModal={openModal}
            />
          ))}
        </Fade>
      </div>
      <Modal show={showModal}>
        <div className="flex flex-col items-start gap-6">
          <p className="flex flex-col gap-2">
            <span className="text-xl font-medium leading-6 text-eerie">
              No contamos con <br />
              reservas por el momento
            </span>
            <span className="text-md text-eerie">
              Pero te escribiremos en la edición del Festival Santa Lucía en
              Septiembre del 2025
            </span>
          </p>
          <Button onClick={closeModal}>Entendido</Button>
        </div>
      </Modal>
    </>
  );
}
