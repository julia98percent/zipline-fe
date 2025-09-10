"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const reconnectCount = useRef<number>(0);
  const isConnectingRef = useRef<boolean>(false);
  const csrfTokenRef = useRef<string | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const { addNotificationList } = useNotificationStore();

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    isConnectingRef.current = false;
    setIsConnected(false);
  }, []);

  const connect = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    if (isConnectingRef.current || abortControllerRef.current) {
      return;
    }

    isConnectingRef.current = true;
    cleanup();

    try {
      if (!csrfTokenRef.current) {
        csrfTokenRef.current = await getCsrfToken();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      await fetchEventSource(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/notifications/stream`,
        {
          signal: abortController.signal,
          credentials: "include",
          headers: {
            "X-XSRF-TOKEN": `${csrfTokenRef.current}`,
          },
          async onopen(response) {
            if (response.ok && response.status === 200) {
              setIsConnected(true);
              reconnectCount.current = 0;
              isConnectingRef.current = false;
            } else {
              throw new Error(
                `Failed to connect: ${response.status} ${response.statusText}`
              );
            }
          },
          onmessage(event) {
            try {
              if (event.data && event.data.startsWith("{")) {
                const notification = JSON.parse(event.data);
                addNotificationList(notification);
              }
            } catch (error) {
              console.error("Error parsing notification:", error);
              console.error("Raw event data:", event.data);
            }
          },
          onerror(err) {
            if (err.name === "AbortError" || err.message?.includes("aborted")) {
              return;
            }

            console.error("SSE connection error:", err);
            setIsConnected(false);
            isConnectingRef.current = false;

            if (reconnectCount.current < MAX_RECONNECT_ATTEMPTS) {
              reconnectCount.current++;
              const delay = Math.min(
                1000 * Math.pow(2, reconnectCount.current),
                30000
              );

              reconnectTimeoutRef.current = setTimeout(() => {
                connect();
              }, delay);
            }
            return;
          },
        }
      );
    } catch (error: any) {
      if (error?.name === "AbortError" || error?.message?.includes("aborted")) {
        return;
      }

      console.error("SSE connection setup error:", error);
      isConnectingRef.current = false;
      setIsConnected(false);
    }
  }, [cleanup, addNotificationList]);

  const reconnect = useCallback(() => {
    reconnectCount.current = 0;
    csrfTokenRef.current = null;
    connect();
  }, [connect]);

  const disconnect = useCallback(() => {
    cleanup();
  }, [cleanup]);

  useEffect(() => {
    connect();
    return cleanup;
  }, [connect, cleanup]);

  const contextValue: SSEContextValue = {
    isConnected,
    reconnect,
    disconnect,
  };

  return (
    <SSEContext.Provider value={contextValue}>{children}</SSEContext.Provider>
  );
}

export function useSSE(): SSEContextValue {
  const context = useContext(SSEContext);
  if (!context) {
    throw new Error("useSSE must be used within an SSEProvider");
  }
  return context;
}
