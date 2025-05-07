import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import { useEffect, useRef } from "react";

interface AgentPropertyDetail {
  customer: string;
  address: string;
  legalDistrictCode: string;
  deposit: number;
  monthlyRent: number;
  price: number;
  type: "SALE" | "DEPOSIT" | "MONTHLY";
  longitude: number;
  latitude: number;
  startDate: string;
  endDate: string;
  moveInDate: string;
  realCategory:
    | "ONE_ROOM"
    | "TWO_ROOM"
    | "APARTMENT"
    | "VILLA"
    | "HOUSE"
    | "OFFICETEL"
    | "COMMERCIAL";
  petsAllowed: boolean;
  floor: number;
  hasElevator: boolean;
  constructionYear: string;
  parkingCapacity: number;
  netArea: number;
  totalArea: number;
  details: string;
}

interface Props {
  property: AgentPropertyDetail;
}

const categoryColors: Record<
  AgentPropertyDetail["realCategory"],
  "primary" | "secondary" | "default" | "success" | "error" | "warning" | "info"
> = {
  ONE_ROOM: "primary",
  TWO_ROOM: "primary",
  APARTMENT: "success",
  VILLA: "info",
  HOUSE: "warning",
  OFFICETEL: "secondary",
  COMMERCIAL: "error",
};
const typeColors: Record<
  AgentPropertyDetail["type"],
  "default" | "primary" | "secondary" | "success" | "error" | "warning" | "info"
> = {
  SALE: "primary",
  DEPOSIT: "success",
  MONTHLY: "warning",
};

const categoryKoreanMap: Record<string, string> = {
  ONE_ROOM: "원룸",
  TWO_ROOM: "투룸",
  APARTMENT: "아파트",
  VILLA: "빌라",
  HOUSE: "주택",
  OFFICETEL: "오피스텔",
  COMMERCIAL: "상가",
};
const typeKoreanMap: Record<string, string> = {
  SALE: "매매",
  DEPOSIT: "전세",
  MONTHLY: "월세",
};

const KakaoMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const createMap = () => {
      if (!mapRef.current) return;
      const kakao = (window as any).kakao;
      if (!kakao || !kakao.maps) {
        console.error("카카오맵 객체가 없습니다.");
        return;
      }
      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3,
      });
      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        map,
      });
    };

    if (!(window as any).kakao || !(window as any).kakao.maps) {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_SECRET}&autoload=false`;
      script.async = true;
      script.onload = () => {
        (window as any).kakao.maps.load(createMap);
      };
      script.onerror = () => {
        console.error("카카오맵 스크립트 로드 실패");
      };
      document.head.appendChild(script);
    } else {
      (window as any).kakao.maps.load(createMap);
    }
  }, [lat, lng]);

  return <Box ref={mapRef} sx={{ width: "100%", height: 300, borderRadius: 2, overflow: "hidden" }} />;
};

const AgentPropertyDetailContent = ({ property }: Props) => {
  return (
    <>
      {/* 지도 카드 - 상단 */}
      {property.latitude && property.longitude && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              위치 지도
            </Typography>
            <KakaoMap lat={Number(property.latitude)} lng={Number(property.longitude)} />
          </CardContent>
        </Card>
      )}
      <Box display="flex" gap={3} mb={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              매물 기본 정보
            </Typography>
            <InfoRow
              label="카테고리"
              value={
                <Chip
                  label={categoryKoreanMap[property.realCategory]}
                  color={categoryColors[property.realCategory] || "default"}
                  variant="outlined"
                  sx={{ height: 26, fontWeight: 500, fontSize: 13 }}
                />
              }
            />
            <InfoRow
              label="거래유형"
              value={
                <Chip
                  label={typeKoreanMap[property.type]}
                  color={typeColors[property.type] || "default"}
                  variant="filled"
                  sx={{ height: 26, fontWeight: 500, fontSize: 13 }}
                />
              }
            />
            <InfoRow label="주소" value={property.address} />
            <InfoRow
              label="보증금"
              value={
                property.deposit
                  ? `${property.deposit.toLocaleString()}원`
                  : "- 원"
              }
            />
            <InfoRow
              label="월세"
              value={
                property.monthlyRent
                  ? `${property.monthlyRent.toLocaleString()}원`
                  : "- 원"
              }
            />
            <InfoRow
              label="매매가"
              value={
                property.price ? `${property.price.toLocaleString()}원` : "- 원"
              }
            />
            <InfoRow
              label="전용면적"
              value={property.netArea ? `${property.netArea}㎡` : "-"}
            />
            <InfoRow
              label="공급면적"
              value={property.totalArea ? `${property.totalArea}㎡` : "-"}
            />
            <InfoRow label="계약 시작일" value={property.startDate ?? "-"} />
            <InfoRow label="계약 종료일" value={property.endDate ?? "-"} />
            <InfoRow label="입주 가능일" value={property.moveInDate ?? "-"} />
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              상세 정보
            </Typography>
            <InfoRow
              label="건물 유형"
              value={categoryKoreanMap[property.realCategory]}
            />
            <InfoRow
              label="층수"
              value={property.floor ? `${property.floor}층` : "-"}
            />
            <InfoRow
              label="반려동물"
              value={
                <Chip
                  label={property.petsAllowed ? "O" : "X"}
                  color={property.petsAllowed ? "success" : "error"}
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: 600, fontSize: 13 }}
                />
              }
            />
            <InfoRow
              label="엘리베이터"
              value={
                <Chip
                  label={property.hasElevator ? "O" : "X"}
                  color={property.hasElevator ? "success" : "error"}
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: 600, fontSize: 13 }}
                />
              }
            />
            <InfoRow
              label="건축년도"
              value={property.constructionYear ?? "-"}
            />
            <InfoRow
              label="주차 가능 대수"
              value={property.parkingCapacity ?? "-"}
            />
            <InfoRow label="고객명" value={property.customer ?? "-"} />
          </CardContent>
        </Card>
      </Box>
      {property.details && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              특이사항
            </Typography>
            <Typography>{property.details}</Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Box display="flex" alignItems="center" mb={1}>
    <Box width={110} color="#888" fontWeight={500} fontSize={14}>
      {label}
    </Box>
    <Box fontSize={15}>{value}</Box>
  </Box>
);

export default AgentPropertyDetailContent;
