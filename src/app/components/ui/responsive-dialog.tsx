"use client";

import * as React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "./drawer";
import { cn } from "@/utils/cn";

const DesktopContext = React.createContext(false);
const desktopQuery = "(min-width: 768px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(desktopQuery).matches;
}

function getServerSnapshot() {
  return false;
}

function ResponsiveDialog({ children, ...props }: React.ComponentProps<typeof Dialog>) {
  const isDesktop = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <DesktopContext.Provider value={isDesktop}>
      {isDesktop ? <Dialog {...props}>{children}</Dialog> : <Drawer {...props}>{children}</Drawer>}
    </DesktopContext.Provider>
  );
}

function ResponsiveDialogContent({ children }: { children: React.ReactNode }) {
  const isDesktop = React.useContext(DesktopContext);

  if (isDesktop) {
    return (
      <DialogContent aria-describedby={undefined} className="max-h-[90dvh] w-full !max-w-[400px] overflow-y-auto rounded-3xl">
        {children}
      </DialogContent>
    );
  }

  return (
    <DrawerContent aria-describedby={undefined} className="data-[vaul-drawer-direction=bottom]:max-h-[90dvh] data-[vaul-drawer-direction=bottom]:rounded-t-3xl">
      <div className="min-h-0 overflow-y-auto overscroll-contain px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {children}
      </div>
      <DrawerClose className="focus-visible:ring-primary absolute top-2 right-2 flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full opacity-70 transition-[background-color,color,opacity] duration-150 hover:bg-primary hover:text-background hover:opacity-100 active:bg-primary active:text-background active:opacity-100 focus-visible:ring-2 focus-visible:outline-none">
        <XIcon className="size-[18.4px]" aria-hidden="true" />
        <span className="sr-only">Cerrar</span>
      </DrawerClose>
    </DrawerContent>
  );
}

function ResponsiveDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  const isDesktop = React.useContext(DesktopContext);
  return isDesktop
    ? <DialogHeader className={cn("pr-8", className)} {...props} />
    : <DrawerHeader className={cn("p-0 pr-8", className)} {...props} />;
}

function ResponsiveDialogTitle(props: React.ComponentProps<typeof DialogTitle>) {
  const isDesktop = React.useContext(DesktopContext);
  return isDesktop ? <DialogTitle {...props} /> : <DrawerTitle {...props} />;
}

export { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogHeader, ResponsiveDialogTitle };
