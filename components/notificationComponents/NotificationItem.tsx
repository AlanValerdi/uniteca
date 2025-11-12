// components/notificationComponents/NotificationItem.tsx
'use client';

import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  type: string;
  onMarkAsReadAction: (id: string) => void;
  onDeleteAction: (id: string) => void;
}

export function NotificationItem({
  id,
  title,
  message,
  read,
  createdAt,
  type,
  onMarkAsReadAction,
  onDeleteAction,
}: NotificationItemProps) {
  const getTypeColor = () => {
    switch (type) {
      case 'LOAN_APPROVED':
        return 'border-l-green-500';
      case 'LOAN_REJECTED':
        return 'border-l-red-500';
      case 'LOAN_DUE_SOON':
        return 'border-l-yellow-500';
      case 'LOAN_OVERDUE':
        return 'border-l-orange-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return notificationDate.toLocaleDateString('es-MX');
  };

  return (
    <div
      className={cn(
        'relative flex flex-col gap-2 p-3 border-l-4 rounded-md transition-colors',
        getTypeColor(),
        read ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'
      )}
    >
      {/* Indicador de no leído */}
      {!read && (
        <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full" />
      )}

      {/* Contenido */}
      <div className="flex flex-col gap-1 pr-8">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">{message}</p>
        <span className="text-xs text-gray-500">{formatTime(createdAt)}</span>
      </div>

      {/* Acciones */}
      <div className="flex gap-1 mt-1">
        {!read && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsReadAction(id);
            }}
          >
            <Check className="w-3 h-3 mr-1" />
            Marcar leída
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-red-500 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteAction(id);
          }}
        >
          <X className="w-3 h-3 mr-1" />
          Eliminar
        </Button>
      </div>
    </div>
  );
}
