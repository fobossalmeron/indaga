import { Button } from "@/app/components/ui/button";

interface EmailSentSuccessProps {
  email: string;
  isResending: boolean;
  resendMessage: string;
  onResend: () => Promise<void>;
  onBack: () => void;
}

export function EmailSentSuccess({ email, isResending, resendMessage, onResend, onBack }: EmailSentSuccessProps) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center px-4 py-25 sm:px-6 lg:px-8">
      <div className="w-full space-y-8 text-center sm:max-w-[370px]">
        <h2 className="text-3xl">Iniciar sesión</h2>
        <div className="rounded-2xl bg-white px-6 py-8 text-foreground">
          <svg
            className="mx-auto mb-6 h-8 w-8 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 19a1 1 0 0 1-1-1v-5a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v5a1 1 0 0 1-1 1H3Z" />
            <path d="M8 7a4 4 0 0 1 4 4v12M16 14V3h3M5 16h4" />
          </svg>
          <p className="text-base">
            Para continuar, haz clic en el enlace enviado a
            <strong className="mt-1 block break-words font-medium">{email}</strong>
          </p>
          <div className="mt-6 flex flex-col items-center">
            <Button variant="link" onClick={onResend} disabled={isResending} className="underline">
              {isResending ? "Enviando…" : "Reenviar email"}
            </Button>
            <Button variant="link" onClick={onBack} disabled={isResending} className="h-auto min-h-11 max-w-full whitespace-normal px-0 py-2 underline">
              Usar un correo electrónico diferente
            </Button>
          </div>
          <p role="status" aria-live="polite" className="text-sm empty:hidden">
            {resendMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
