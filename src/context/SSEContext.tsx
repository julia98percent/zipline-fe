"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { EventSource } from "eventsource";
import useNotificationStore from "@/stores/useNotificationStore";
import { getCsrfToken } from "@/apis/apiClient";

interface SSEContextValue {
  isConnected: boolean;
  reconnect: () => void;
  disconnect: () => void;
}

const SSEContext = createContext<SSEContextValue | null>(null);

const MAX_RECONNECT_ATTEMPTS = 3;

export function SSEProvider({ children }: { children: React.ReactNode }) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectCount = useRef<number>(0);
  const isConnectingRef = useRef<boolean>(false);
  const csrfTokenRef = useRef<string | null>(null);

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

    isConnectingRef.current = false;
    setIsConnected(false);
  }, []);

  const connect = useCallback(async () => {
    if (
      isConnectingRef.current ||
      (eventSourceRef.current &&
        eventSourceRef.current.readyState === EventSource.OPEN)
    ) {
      return;
    }

    isConnectingRef.current = true;
    cleanup();

    try {
      if (!csrfTokenRef.current) {
        csrfTokenRef.current = await getCsrfToken();
      }

      const eventSource = new EventSource(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/notifications/stream`,
        {
          fetch: (input, init) =>
            fetch(input, {
              ...init,
              credentials: "include",
              headers: {
                ...init?.headers,
                "X-XSRF-TOKEN": `${csrfTokenRef.current}`,
              },
            }),
        }
      );

      eventSource.onopen = () => {
        setIsConnected(true);
        reconnectCount.current = 0;
        isConnectingRef.current = false;
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
        isConnectingRef.current = false;
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
          }
        }
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error("SSE 연결 생성 오류:", error);
      isConnectingRef.current = false;
      setIsConnected(false);
    }
  }, [cleanup, addNotificationList]);

  const reconnect = useCallback(() => {
    reconnectCount.current = 0;
    csrfTokenRef.current = null;
    connect();
  }, [connect]);

  useEffect(() => {
    connect();
    return cleanup;
  }, []);

  const value = {
    isConnected,
    reconnect,
    disconnect: cleanup,
  };

  return <SSEContext.Provider value={value}>{children}</SSEContext.Provider>;
}

export function useSSE() {
  const context = useContext(SSEContext);
  if (!context) {
    throw new Error("useSSE must be used within SSEProvider");
  }
  return context;
}
