"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface TreasureNotificationProps {
  className?: string;
}

export function TreasureNotification({ className = "" }: TreasureNotificationProps) {
  const [notification, setNotification] = useState<{
    type: 'found' | 'already-found' | 'error';
    message: string;
  } | null>(null);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const treasure = searchParams.get('treasure');
    const errorMessage = searchParams.get('message');
    
    if (treasure) {
      switch (treasure) {
        case 'found':
          setNotification({
            type: 'found',
            message: '¡Tesoro encontrado con éxito! 🎉 Has avanzado en tu búsqueda del tesoro.'
          });
          break;
        case 'already-found':
          setNotification({
            type: 'already-found',
            message: '🔄 Ya habías encontrado este tesoro anteriormente. ¡Sigue explorando!'
          });
          break;
        case 'error':
          setNotification({
            type: 'error',
            message: `❌ ${errorMessage ? decodeURIComponent(errorMessage) : 'Error al procesar el código QR.'}`
          });
          break;
      }

      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!notification) return null;

  const bgColor = {
    found: 'bg-green-50 border-green-200',
    'already-found': 'bg-blue-50 border-blue-200',
    error: 'bg-red-50 border-red-200'
  }[notification.type];

  const textColor = {
    found: 'text-green-800',
    'already-found': 'text-blue-800',
    error: 'text-red-800'
  }[notification.type];

  const iconColor = {
    found: 'text-green-400',
    'already-found': 'text-blue-400',
    error: 'text-red-400'
  }[notification.type];

  return (
    <div className={`rounded-lg border-2 p-4 ${bgColor} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className={`h-5 w-5 ${iconColor}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {notification.type === 'found' && (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            )}
            {notification.type === 'already-found' && (
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            )}
            {notification.type === 'error' && (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${textColor}`}>
            {notification.message}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => setNotification(null)}
            className={`inline-flex rounded-md p-1.5 transition-colors ${iconColor} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2`}
          >
            <span className="sr-only">Cerrar</span>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}