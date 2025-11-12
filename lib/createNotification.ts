// lib/createNotification.ts
import { prisma } from '@/app/lib/prisma';

export type NotificationType = 'LOAN_APPROVED' | 'LOAN_REJECTED' | 'LOAN_RETURNED' | 'LOAN_RENEWED' | 'LOAN_DUE_SOON' | 'LOAN_OVERDUE';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  loanId?: string;
}

/**
 * Server-side helper to create notifications
 * Can be called from any API route
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  loanId,
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        loanId,
      },
    });

    return { success: true, notification };
  } catch (error) {
    console.error('[CREATE_NOTIFICATION_ERROR]', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

/**
 * Helper to generate notification content based on type
 */
export function getNotificationContent(type: NotificationType, bookTitle?: string) {
  switch (type) {
    case 'LOAN_APPROVED':
      return {
        title: '✅ Préstamo Aprobado',
        message: bookTitle 
          ? `Tu solicitud de "${bookTitle}" ha sido aprobada. Tienes 14 días para devolverlo.`
          : 'Tu solicitud de préstamo ha sido aprobada.',
      };
    case 'LOAN_REJECTED':
      return {
        title: '❌ Préstamo Rechazado',
        message: bookTitle
          ? `Tu solicitud de "${bookTitle}" ha sido rechazada.`
          : 'Tu solicitud de préstamo ha sido rechazada.',
      };
    case 'LOAN_RETURNED':
      return {
        title: '📚 Libro Devuelto',
        message: bookTitle
          ? `El libro "${bookTitle}" ha sido marcado como devuelto. ¡Gracias por devolverlo a tiempo!`
          : 'Tu préstamo ha sido marcado como devuelto.',
      };
    case 'LOAN_RENEWED':
      return {
        title: '🔄 Préstamo Renovado',
        message: bookTitle
          ? `Tu préstamo de "${bookTitle}" ha sido renovado. Ahora tienes 14 días más.`
          : 'Tu préstamo ha sido renovado por 14 días más.',
      };
    case 'LOAN_DUE_SOON':
      return {
        title: '⏰ Préstamo por Vencer',
        message: bookTitle
          ? `El libro "${bookTitle}" vence en menos de 24 horas. Renueva o devuélvelo pronto.`
          : 'Tu préstamo vence en menos de 24 horas.',
      };
    case 'LOAN_OVERDUE':
      return {
        title: '🚨 Préstamo Vencido',
        message: bookTitle
          ? `El libro "${bookTitle}" está vencido. Por favor, devuélvelo lo antes posible.`
          : 'Tienes un préstamo vencido.',
      };
    default:
      return {
        title: '🔔 Notificación',
        message: 'Tienes una nueva notificación.',
      };
  }
}
