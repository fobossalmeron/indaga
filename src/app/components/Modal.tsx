import React from "react";

interface ModalProps {
  show: boolean;
  children: React.ReactNode;
}

export function Modal({ show, children }: ModalProps) {

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-eerie bg-opacity-5 outline-none transition-opacity duration-300 focus:outline-none ${show ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div className="relative mx-auto my-6 w-auto max-w-[400px]">
        <div className="relative flex w-full flex-col items-start rounded-3xl border-0 bg-white p-8 shadow-lg outline-none focus:outline-none">
          {children}
        </div>
      </div>
    </div>
  );
}
