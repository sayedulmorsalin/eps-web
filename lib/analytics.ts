import { getSupabaseClient } from './supabase/client';

export interface AnalyticsEventParams {
  eventName: string;
  eventCategory?: 'engagement' | 'ecommerce' | 'navigation' | 'auth' | 'search';
  pagePath?: string;
  properties?: Record<string, unknown>;
  platform?: string;
}

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// 1. Persistent Anonymous Visitor ID (device/browser identifier)
export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server_visitor';
  let vid = localStorage.getItem('epsr_visitor_id');
  if (!vid) {
    vid = 'vid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('epsr_visitor_id', vid);
  }
  return vid;
}

// 2. Rolling Session ID with 30-minute inactivity timeout
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  const now = Date.now();
  const lastActiveStr = localStorage.getItem('epsr_session_last_activity');
  let sid = localStorage.getItem('epsr_session_id');

  if (!sid || !lastActiveStr || now - parseInt(lastActiveStr, 10) > INACTIVITY_TIMEOUT_MS) {
    sid = 'sid_web_' + Math.random().toString(36).substring(2, 11) + '_' + now;
    localStorage.setItem('epsr_session_id', sid);
  }
  localStorage.setItem('epsr_session_last_activity', now.toString());
  return sid;
}

// 3. Get logged-in user ID if available
function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const rawUser = localStorage.getItem('epsr_user');
    if (rawUser) {
      const u = JSON.parse(rawUser);
      if (u?.id && u.id.length === 36) return u.id;
    }
  } catch {
    // Ignore invalid JSON in epsr_user
  }
  return null;
}

let rpcUnavailable = false;

function scheduleIdle(task: () => void, fallbackDelayMs = 1200): void {
  if (typeof window === 'undefined') return;
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number })
    .requestIdleCallback;
  if (typeof ric === 'function') {
    ric(task, { timeout: fallbackDelayMs });
  } else {
    setTimeout(task, fallbackDelayMs);
  }
}

// 4. Core non-blocking tracking function with server RPC or direct fallback
export async function trackEvent({
  eventName,
  eventCategory = 'engagement',
  pagePath,
  properties = {},
  platform = 'web',
}: AnalyticsEventParams): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const supabase = getSupabaseClient();
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const userId = getCurrentUserId();
    const currentPath = pagePath || window.location.pathname;
    const userAgent = window.navigator.userAgent;

    if (!rpcUnavailable) {
      // Call atomic server RPC if available
      const { error } = await supabase.rpc('log_analytics_event', {
        p_visitor_id: visitorId,
        p_session_id: sessionId,
        p_user_id: userId,
        p_event_name: eventName,
        p_event_category: eventCategory,
        p_page_path: currentPath,
        p_properties: properties,
        p_platform: platform,
        p_user_agent: userAgent,
      });

      if (!error) return;
      rpcUnavailable = true;
    }

    // Fallback: direct table insert
    await supabase.from('user_analytics').insert({
      visitor_id: visitorId,
      session_id: sessionId,
      user_id: userId,
      event_name: eventName,
      event_category: eventCategory,
      page_path: currentPath,
      properties: properties,
      platform: platform,
      user_agent: userAgent,
    });
  } catch (err) {
    console.debug('Analytics log notice:', err);
  }
}

// 5. Automated Session Heartbeat & Window State Listeners
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
export function initWebSessionHeartbeat(): void {
  if (typeof window === 'undefined' || heartbeatInterval) return;

  // Defer session start slightly so initial product data & images get full bandwidth
  scheduleIdle(() => {
    trackEvent({ eventName: 'session_start', eventCategory: 'engagement' });
  }, 2000);

  // 30-second active heartbeat
  heartbeatInterval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      trackEvent({ eventName: 'session_heartbeat', eventCategory: 'engagement' });
    }
  }, 30000);

  // Tab visibility change / page unload
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      trackEvent({ eventName: 'session_end', eventCategory: 'engagement' });
    } else {
      trackEvent({ eventName: 'session_heartbeat', eventCategory: 'engagement' });
    }
  });

  window.addEventListener('beforeunload', () => {
    trackEvent({ eventName: 'session_end', eventCategory: 'engagement' });
  });
}

// Auto-initialize heartbeat only when browser is idle after initial load
if (typeof window !== 'undefined') {
  scheduleIdle(() => {
    initWebSessionHeartbeat();
  }, 2000);
}

// 6. Helpers
export function trackPageView(pagePath: string, properties?: Record<string, unknown>) {
  scheduleIdle(() => {
    void trackEvent({
      eventName: 'page_view',
      eventCategory: 'navigation',
      pagePath,
      properties,
    });
  }, 800);
}

export function trackProductView(product: {
  id: string;
  nameBn?: string;
  nameEn?: string;
  price?: number;
  categoryId?: string;
  timeSpentSeconds?: number;
}) {
  scheduleIdle(() => {
    void trackEvent({
      eventName: 'product_view',
      eventCategory: 'ecommerce',
      pagePath: `/products/${product.id}`,
      properties: {
        productId: product.id,
        productName: product.nameBn || product.nameEn,
        price: product.price,
        categoryId: product.categoryId,
        timeSpentSeconds: product.timeSpentSeconds || 0,
      },
    });
  }, 800);
}

export function trackAddToCart(
  product: { id: string; nameBn?: string; nameEn?: string; price: number },
  quantity: number = 1
) {
  return trackEvent({
    eventName: 'add_to_cart',
    eventCategory: 'ecommerce',
    properties: {
      productId: product.id,
      productName: product.nameBn || product.nameEn,
      price: product.price,
      quantity,
      subtotal: product.price * quantity,
    },
  });
}

export function trackSearch(query: string, resultCount?: number) {
  if (!query || !query.trim()) return;
  const count = resultCount ?? 0;
  
  if (count === 0) {
    trackEvent({
      eventName: 'search_no_results',
      eventCategory: 'search',
      properties: { query: query.trim(), resultCount: 0 },
    });
  } else {
    trackEvent({
      eventName: 'search',
      eventCategory: 'search',
      properties: { query: query.trim(), resultCount: count },
    });
  }
}

export function trackOrderPlaced(orderId: string, total: number, paymentMethod: string = 'COD') {
  return trackEvent({
    eventName: 'order_placed',
    eventCategory: 'ecommerce',
    properties: {
      orderId,
      total,
      paymentMethod,
    },
  });
}

export function trackAuthEvent(action: 'login' | 'register' | 'logout', email?: string) {
  return trackEvent({
    eventName: action === 'register' ? 'user_signup' : action === 'login' ? 'user_login' : 'logout',
    eventCategory: 'auth',
    properties: {
      action,
      email: email ? email.replace(/(.{2})(.*)(?=@)/, '$1***') : undefined,
    },
  });
}
