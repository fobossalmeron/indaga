"use client";
import { useState } from "react";
import { RouteCard } from "./RouteCard";
import { Fade } from "react-awesome-reveal";
import { Modal } from "@/app/components/Modal";
import { Button } from "@/app/components/Button";
import { Content } from "@prismicio/client";

export default function RoutesFull({
  routes,
}: {
  routes: Content.RouteDocument[];
}) {
  const [showModal, setShowModal] = useState(false);

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1020px] flex-col items-center pb-24">
      <div className="relative mt-10 grid grid-cols-1 gap-8 px-5 sm:mt-16 sm:grid-cols-2">
        <Fade>
          {routes &&
            routes.map((route, index) => (
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
            <span className="text-xl leading-6 font-medium">
              No contamos con <br />
              reservas por el momento
            </span>
            <span className="text-md">
              Pero te escribiremos en la edición del Festival Santa Lucía en
              Septiembre del 2025
            </span>
          </p>
          <Button onClick={closeModal}>Entendido</Button>
        </div>
      </Modal>
    </div>
  );
}
