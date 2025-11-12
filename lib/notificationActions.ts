// lib/notificationActions.ts
'use client';

export async function fetchNotifications() {
  try {
    const res = await fetch('/api/notifications/fetch', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return await res.json();
  } catch (error) {
    console.error('[FETCH_NOTIFICATIONS_CLIENT_ERROR]', error);
    return { success: false, error: 'Failed to fetch notifications' };
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const res = await fetch('/api/notifications/mark-read', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId }),
    });

    if (!res.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return await res.json();
  } catch (error) {
    console.error('[MARK_READ_CLIENT_ERROR]', error);
    return { success: false, error: 'Failed to mark notification as read' };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const res = await fetch('/api/notifications/mark-all-read', {
      method: 'PATCH',
    });

    if (!res.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return await res.json();
  } catch (error) {
    console.error('[MARK_ALL_READ_CLIENT_ERROR]', error);
    return { success: false, error: 'Failed to mark all notifications as read' };
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    const res = await fetch('/api/notifications/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId }),
    });

    if (!res.ok) {
      throw new Error('Failed to delete notification');
    }

    return await res.json();
  } catch (error) {
    console.error('[DELETE_NOTIFICATION_CLIENT_ERROR]', error);
    return { success: false, error: 'Failed to delete notification' };
  }
}
