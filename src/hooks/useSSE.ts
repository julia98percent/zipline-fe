import { useEffect, useRef, useCallback, useState } from "react";
import { EventSource } from "eventsource";
import useNotificationStore from "@stores/useNotificationStore";

const MAX_RECONNECT_ATTEMPTS = 5;

function useSSE() {
  const eventSourceRef = useRef<EventSource>(null);
  const reconnectTimeoutRef = useRef<number>(null);
  const reconnectCount = useRef(0);

  const [isConnected, setIsConnected] = useState(false);

  const { addNotificationList } = useNotificationStore();

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    const token = sessionStorage.getItem("_ZA");

    if (!token) {
      return;
    }

    if (
      eventSourceRef.current &&
      eventSourceRef.current.readyState === EventSource.OPEN
    ) {
      return;
    }

    cleanup();

    try {
      setIsConnected(true);

      const eventSource = new EventSource(
        `${import.meta.env.VITE_SERVER_URL}/notifications/stream`,
        {
          fetch: (input, init) =>
            fetch(input, {
              ...init,
              credentials: "include",
              headers: {
                ...init?.headers,
                Authorization: `Bearer ${token}`,
              },
            }),
        }
      );

      eventSource.onopen = () => {
        setIsConnected(true);
        reconnectCount.current = 0;
      };

      eventSource.addEventListener("notification", (event) => {
        try {
          const notification = JSON.parse(event.data);
          addNotificationList(notification);
        } catch (error) {
          console.error("알림 데이터 파싱 오류:", error);
        }
      });

      eventSource.onerror = (error) => {
        console.error("SSE 연결 오류:", error);
        setIsConnected(false);

        if (eventSource.readyState === EventSource.CLOSED) {
          if (reconnectCount.current < MAX_RECONNECT_ATTEMPTS) {
            const delay = Math.min(
              1000 * Math.pow(2, reconnectCount.current),
              30000
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectCount.current++;
              connect();
            }, delay);
          } else {
            setIsConnected(false);
          }
        }
      };

      eventSourceRef.current = eventSource;
    } catch {
      setIsConnected(false);
    }
  }, [cleanup]);

  useEffect(() => {
    connect();

    return () => {
      cleanup();
    };
  }, [connect, cleanup]);

  return {
    connect,
    disconnect: cleanup,
    isConnected,
  };
}

export default useSSE;
