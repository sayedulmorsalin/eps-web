import { getSupabaseClient } from './client';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Subscribes to real-time status updates for a specific order.
 */
export function subscribeToOrderStatus(
  orderId: string,
  onStatusChange: (status: string, payload: any) => void
): RealtimeChannel {
  const supabase = getSupabaseClient();
  const channel = supabase
    .channel(`order-status-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      },
      (payload) => {
        if (payload.new && 'status' in payload.new) {
          onStatusChange(payload.new.status as string, payload.new);
        }
      }
    )
    .subscribe();

  return channel;
}

/**
 * Unsubscribes from an active real-time channel.
 */
export function unsubscribeChannel(channel: RealtimeChannel) {
  const supabase = getSupabaseClient();
  supabase.removeChannel(channel);
}
