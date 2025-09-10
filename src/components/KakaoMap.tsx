"use client";

import { useRef, useEffect } from "react";
import { showToast } from "@/components/Toast";

interface KakaoMapProps {
  lat: number;
  lng: number;
  level?: number;
  width?: string;
  height?: string;
}

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: Record<string, unknown>) => unknown;
        LatLng: new (lat: number, lng: number) => unknown;
        Marker: new (options: Record<string, unknown>) => unknown;
      };
    };
  }
}

const KakaoMap = ({
  lat,
  lng,
  level = 3,
  width = "100%",
  height = "100%",
}: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const createMap = () => {
      if (!mapRef.current) return;

      const { kakao } = window;
      if (!kakao || !kakao.maps) {
        showToast({
          message: "카카오맵 객체가 없습니다.",
          type: "error",
        });
        return;
      }

      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(lat, lng),
        level,
      });

      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        map,
      });
    };

    const loadKakaoMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_SECRET}&autoload=false`;
        script.async = true;
        script.onload = () => {
          window.kakao.maps.load(createMap);
        };
        script.onerror = () => {
          showToast({
            message: "카카오맵 스크립트 로드 실패",
            type: "error",
          });
        };
        document.head.appendChild(script);
      } else {
        window.kakao.maps.load(createMap);
      }
    };

    loadKakaoMap();
  }, [lat, lng, level]);

  return <div ref={mapRef} style={{ width, height }} />;
};

export default KakaoMap;
