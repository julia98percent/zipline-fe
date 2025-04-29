import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@apis/apiClient";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

interface AgentPropertyDetail {
  customer: string; // 추가
  address: string;
  legalDistrictCode: string; // 추가
  deposit: number;
  monthlyRent: number;
  price: number;
  type: "SALE" | "DEPOSIT" | "MONTHLY"; // 추가
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
    | "COMMERCIAL"; // 명확하게
  petsAllowed: boolean;
  floor: number;
  hasElevator: boolean;
  constructionYear: string;
  parkingCapacity: number;
  netArea: number;
  totalArea: number; // 추가
  details: string;
}

function AgentPropertyDetailPage() {
  const { propertyUid } = useParams<{ propertyUid: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<AgentPropertyDetail | null>(null);

  useEffect(() => {
    if (propertyUid) {
      apiClient
        .get(`/properties/${propertyUid}`)
        .then((res) => {
          setProperty(res.data.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [propertyUid]);

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      apiClient
        .delete(`/properties/${propertyUid}`)
        .then(() => {
          alert("매물 삭제 성공");
          navigate("/properties/private");
        })
        .catch((err) => console.error(err));
    }
  };

  const handleEdit = () => {
    navigate(`/properties/${propertyUid}/edit`);
  };

  if (!property) return <div>Loading...</div>;

  console.log(property);
  if (!property) return <div>Loading...</div>;
  console.log("property:", property);

  return (
    <Box
      p={4}
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box width="100%" maxWidth="800px">
        {/* 주소 + 수정/삭제 버튼 */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h5" fontWeight="bold">
            {property.address}
          </Typography>
          <Box>
            <Button variant="outlined" sx={{ mr: 1 }} onClick={handleEdit}>
              수정
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              삭제
            </Button>
          </Box>
        </Box>

        {/* 지도 */}
        {property.latitude && property.longitude && (
          <Box mb={4}>
            <reactKakaoMapsSdk.Map
              center={{ lat: property.latitude, lng: property.longitude }}
              style={{ width: "100%", height: "300px", borderRadius: 8 }}
              level={3}
            >
              <reactKakaoMapsSdk.MapMarker
                position={{ lat: property.latitude, lng: property.longitude }}
              />
            </reactKakaoMapsSdk.Map>
          </Box>
        )}

        {/* 매물 정보 카드 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              🏠 매물 정보
            </Typography>
            <Typography>
              매매가:{" "}
              {property.price
                ? `${(property.price / 10000).toLocaleString()}억`
                : "-"}
            </Typography>
            <Typography>
              보증금:{" "}
              {property.deposit
                ? `${(property.deposit / 10000).toLocaleString()}만원`
                : "-"}
            </Typography>
            <Typography>
              월세:{" "}
              {property.monthlyRent
                ? `${(property.monthlyRent / 10000).toLocaleString()}만원`
                : "-"}
            </Typography>
            <Typography>전용 면적: {property.netArea ?? "-"} m²</Typography>
          </CardContent>
        </Card>

        {/* 상세 정보 카드 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              📋 상세 정보
            </Typography>
            <Typography>건물 유형: {property.realCategory}</Typography>
            <Typography>층수: {property.floor ?? "-"}</Typography>
            <Typography>입주 가능일: {property.moveInDate ?? "-"}</Typography>
            <Typography>
              반려동물: {property.petsAllowed ? "가능" : "불가"}
            </Typography>
            <Typography>
              엘리베이터: {property.hasElevator ? "있음" : "없음"}
            </Typography>
            <Typography>
              건축년도: {property.constructionYear ?? "-"}
            </Typography>
            <Typography>
              주차 가능 대수: {property.parkingCapacity ?? "-"}
            </Typography>
          </CardContent>
        </Card>

        {/* 계약 정보 카드 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              📑 계약 정보
            </Typography>
            <Typography>계약 시작일: {property.startDate ?? "-"}</Typography>
            <Typography>계약 종료일: {property.endDate ?? "-"}</Typography>
          </CardContent>
        </Card>

        {/* 특이사항 */}
        {property.details && (
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                📝 특이사항
              </Typography>
              <Typography>{property.details}</Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default AgentPropertyDetailPage;
