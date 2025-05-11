import React, { useEffect, useState, useRef } from "react";
import { Box, Button, Chip, Typography, Tabs, Tab } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "@apis/apiClient";
import {
  DetailPageContainer,
  DetailHeader,
  HeaderTitle,
  MapContainer,
  InfoGrid,
  InfoCard,
  InfoItem,
  InfoLabel,
  InfoValue,
  PageContainer,
} from "./styles/AgentPropertyDetailPage.styles";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import DeleteConfirmModal from "@components/DeleteConfirm/DeleteConfirmModal";
import PageHeader from "@components/PageHeader/PageHeader";
import useUserStore from "@stores/useUserStore";
import PropertyEditModal from "../PropertyAddButtonList/PropertyEditModal/PropertyEditModal";

interface AgentPropertyDetail {
  customer: string;
  address: string;
  detailAddress: string;
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

interface ContractCustomer {
  customerUid: number;
  customerName: string;
  customerRole: "LESSOR_OR_SELLER" | "LESSEE_OR_BUYER";
}

interface ContractHistoryItem {
  contractUid: number;
  contractCategory: string | null;
  endDate: string;
  contractStatus: string;
  customers: ContractCustomer[];
}

interface ContractInfo {
  contractUid: number;
  contractCategory: "SALE" | "DEPOSIT" | "MONTHLY";
  contractStartDate: string | null;
  contractEndDate: string | null;
  contractDate: string | null;
  customers: ContractCustomer[];
}

// 상담 히스토리 타입
interface CounselHistory {
  counselUid: number;
  counselTitle: string;
  counselDate: string;
  customerName: string;
  customerPhoneNo: string;
}

const CONTRACT_STATUS_TYPES = [
  { value: "LISTED", name: "매물 등록", color: "default" },
  { value: "NEGOTIATING", name: "협상 중", color: "info" },
  { value: "INTENT_SIGNED", name: "가계약", color: "warning" },
  { value: "CANCELLED", name: "계약 취소", color: "error" },
  { value: "CONTRACTED", name: "계약 체결", color: "success" },
  { value: "IN_PROGRESS", name: "계약 진행 중", color: "primary" },
  { value: "PAID_COMPLETE", name: "잔금 지급 완료", color: "secondary" },
  { value: "REGISTERED", name: "등기 완료", color: "success" },
  { value: "MOVED_IN", name: "입주 완료", color: "success" },
  { value: "TERMINATED", name: "계약 해지", color: "error" },
];

const categoryKoreanMap: Record<string, string> = {
  SALE: "매매",
  DEPOSIT: "전세",
  MONTHLY: "월세",
};

const getColor = (color: string) => {
  switch (color) {
    case "primary":
      return "#1976d2";
    case "success":
      return "#2e7d32";
    case "error":
      return "#d32f2f";
    case "warning":
      return "#ed6c02";
    case "info":
      return "#0288d1";
    case "secondary":
      return "#9c27b0";
    default:
      return "#999";
  }
};

const getStatusChip = (status: string) => {
  const statusInfo = CONTRACT_STATUS_TYPES.find(
    (item) => item.value === status
  );
  if (!statusInfo) return status;

  return (
    <Chip
      label={statusInfo.name}
      variant="outlined"
      sx={{
        color: getColor(statusInfo.color),
        borderColor: getColor(statusInfo.color),
        fontWeight: 500,
        height: 28,
        fontSize: 13,
      }}
    />
  );
};

const getCategoryChip = (category: string | null) => {
  if (!category || category === "null") return "-";
  const label = categoryKoreanMap[category] ?? category;
  const colorMap: Record<string, string> = {
    SALE: "#4caf50",
    DEPOSIT: "#2196f3",
    MONTHLY: "#ff9800",
  };
  return (
    <Chip
      label={label}
      variant="outlined"
      sx={{
        color: colorMap[category],
        borderColor: colorMap[category],
        fontWeight: 500,
        height: 26,
        fontSize: 13,
      }}
    />
  );
};

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

const KakaoMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const createMap = () => {
      if (!mapRef.current) return;
      const kakao = (window as any).kakao;
      if (!kakao || !kakao.maps) {
        toast.error("카카오맵 객체가 없습니다.");
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
      script.src = `http://dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAP_SECRET
      }&autoload=false`;
      script.async = true;
      script.onload = () => {
        (window as any).kakao.maps.load(createMap);
      };
      script.onerror = () => {
        toast.error("카카오맵 스크립트 로드 실패");
      };
      document.head.appendChild(script);
    } else {
      (window as any).kakao.maps.load(createMap);
    }
  }, [lat, lng]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

const AgentPropertyDetailPage = () => {
  const { propertyUid } = useParams<{ propertyUid: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<AgentPropertyDetail | null>(null);
  const { user } = useUserStore();
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [contractHistories, setContractHistories] = useState<
    ContractHistoryItem[]
  >([]);
  const [tab, setTab] = useState(0);
  const [counselHistories, setCounselHistories] = useState<CounselHistory[]>([]);

  useEffect(() => {
    if (!propertyUid) return;

    const fetchPropertyAndContract = async () => {
      try {
        const propertyRes = await apiClient.get(`/properties/${propertyUid}`);
        setProperty(propertyRes.data.data);
      } catch (err) {
        console.error(err);
        toast.error("매물 정보를 불러오는 데 실패했습니다.");
      }

      try {
        const contractRes = await apiClient.get(
          `/properties/${propertyUid}/contract`
        );
        setContractInfo(contractRes.data.data);
      } catch {
        setContractInfo(null);
      }
    };

    fetchPropertyAndContract();
  }, [propertyUid]);

  useEffect(() => {
    if (!propertyUid) return;

    const fetchContractHistories = async () => {
      try {
        const res = await apiClient.get(
          `/properties/${propertyUid}/contract-history`
        );
        setContractHistories(res.data.data);
      } catch (err) {
        console.error("계약 히스토리 불러오기 실패", err);
        toast.error("계약 히스토리를 불러오는 데 실패했습니다.");
      }
    };

    fetchContractHistories();
  }, [propertyUid]);

  useEffect(() => {
    if (!propertyUid) return;
      apiClient
      .get(`/properties/${propertyUid}/counsels`)
        .then((res) => {
        setCounselHistories(res.data.data.counsels || []);
      })
      .catch(() => {
        setCounselHistories([]);
      });
  }, [propertyUid]);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEdit = () => setEditModalOpen(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    setDeleteModalOpen(true); // 모달 열기
  };

  const confirmDelete = () => {
    apiClient
      .delete(`/properties/${propertyUid}`)
      .then(() => {
        toast.success("매물 삭제 성공");
        navigate("/properties/private");
      })
      .catch((err) => {
        console.error("매물 삭제 실패", err);
        toast.error("매물 삭제 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setDeleteModalOpen(false);
      });
  };

  if (!property) return null;

  const formatPrice = (price: number | null) => {
    return price ? price.toLocaleString() + "원" : "-";
  };

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      ONE_ROOM: "원룸",
      TWO_ROOM: "투룸",
      APARTMENT: "아파트",
      VILLA: "빌라",
      HOUSE: "주택",
      OFFICETEL: "오피스텔",
      COMMERCIAL: "상가",
    };
    return categories[category] || category;
  };

  const getTransactionType = (type: string) => {
    const types: { [key: string]: string } = {
      SALE: "매매",
      DEPOSIT: "전세",
      MONTHLY: "월세",
    };
    return types[type] || type;
  };

  const formatValue = (
    value: number | null | undefined,
    suffix: string = ""
  ) => {
    if (value === null || value === undefined) return "-";
    return `${value}${suffix}`;
  };

  const getCustomerNames = (customers: ContractCustomer[], role: ContractCustomer["customerRole"]) => {
    const names = customers.filter((c) => c.customerRole === role).map((c) => c.customerName);
    if (names.length === 0) return "-";
    return names.join(", ");
  };

  const getCustomerSummary = (customers: ContractCustomer[], role: ContractCustomer["customerRole"]) => {
    const names = customers.filter((c) => c.customerRole === role).map((c) => c.customerName);
    if (names.length === 0) return "-";
    if (names.length === 1) return names[0];
    return `${names[0]} 외 ${names.length - 1}명`;
  };

  return (
    <PageContainer>
        <PageHeader title="매물 상세 조회" userName={user?.name || "-"} />
      <DetailPageContainer>
        {editModalOpen && property && (
          <PropertyEditModal
            open={editModalOpen}
            handleClose={() => setEditModalOpen(false)}
            initialData={property}
            propertyUid={Number(propertyUid)}
            fetchPropertyData={() => {
              apiClient
                .get(`/properties/${propertyUid}`)
                .then((res) => setProperty(res.data.data))
                .catch((err) => {
                  console.error(err);
                  toast.error("매물 정보를 불러오는 데 실패했습니다.");
                });
            }}
          />
        )}
        <DeleteConfirmModal
          open={deleteModalOpen}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
        <DetailHeader>
          <HeaderTitle>
            {`${property.address ?? ""} ${
              property.detailAddress ?? ""
            }`.trim() || "-"}
          </HeaderTitle>
        <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
          <Button variant="outlined" onClick={handleEdit}>
            수정
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            삭제
          </Button>
        </Box>
        </DetailHeader>
        <InfoCard sx={{ mb: 3 }}>
          <MapContainer>
            <KakaoMap lat={property.latitude} lng={property.longitude} />
          </MapContainer>
        </InfoCard>

        <InfoGrid>
          <InfoCard>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              매물 정보
            </Typography>

            <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={1}>
              {/* 고객명 */}
              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>고객명</InfoLabel>
                  <InfoValue>{property.customer || "-"}</InfoValue>
                </InfoItem>
              </Box>

              {/* 거래 유형 */}
              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>거래 유형</InfoLabel>
                  <InfoValue>
                    <Chip
                      label={getTransactionType(property.type)}
                      color={typeColors[property.type] || "default"}
                      variant="filled"
                      size="small"
                      sx={{ fontWeight: 500, fontSize: 13 }}
                    />
                  </InfoValue>
                </InfoItem>
              </Box>

              {/* 매물 종류 */}
              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>매물 종류</InfoLabel>
                  <InfoValue>
                    <Chip
                      label={getCategoryName(property.realCategory)}
                      color={categoryColors[property.realCategory] || "default"}
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 500, fontSize: 13 }}
                    />
                  </InfoValue>
                </InfoItem>
              </Box>

              {/* 가격 정보 */}
              {property.type === "SALE" && (
                <Box width="calc(50% - 8px)">
                  <InfoItem>
                    <InfoLabel>매매가</InfoLabel>
                    <InfoValue>{formatPrice(property.price)}</InfoValue>
                  </InfoItem>
                </Box>
              )}

              {property.type === "DEPOSIT" && (
                <Box width="calc(50% - 8px)">
                  <InfoItem>
                    <InfoLabel>보증금</InfoLabel>
                    <InfoValue>{formatPrice(property.deposit)}</InfoValue>
                  </InfoItem>
                </Box>
              )}

              {property.type === "MONTHLY" && (
                <>
                  <Box width="calc(50% - 8px)">
                    <InfoItem>
                      <InfoLabel>보증금</InfoLabel>
                      <InfoValue>{formatPrice(property.deposit)}</InfoValue>
                    </InfoItem>
                  </Box>
                  <Box width="calc(50% - 8px)">
                    <InfoItem>
                      <InfoLabel>월세</InfoLabel>
                      <InfoValue>{formatPrice(property.monthlyRent)}</InfoValue>
                    </InfoItem>
                  </Box>
                </>
              )}
            </Box>
          </InfoCard>

          <InfoCard>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              매물 세부정보
            </Typography>

            <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={1}>
              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>공급 면적</InfoLabel>
                  <InfoValue>{formatValue(property.totalArea, "m²")}</InfoValue>
                </InfoItem>
              </Box>

              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>전용 면적</InfoLabel>
                  <InfoValue>{formatValue(property.netArea, "m²")}</InfoValue>
                </InfoItem>
              </Box>

              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>층수</InfoLabel>
                  <InfoValue>{formatValue(property.floor, "층")}</InfoValue>
                </InfoItem>
              </Box>

              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>건축년도</InfoLabel>
                  <InfoValue>
                    {formatValue(Number(property.constructionYear), "년")}
                  </InfoValue>
                </InfoItem>
              </Box>
            </Box>
          </InfoCard>

          <InfoCard>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              시설 정보
            </Typography>

            <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={1}>
              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>엘리베이터</InfoLabel>
                  <InfoValue>
                    <Chip
                      label={property.hasElevator ? "O" : "X"}
                      color={property.hasElevator ? "success" : "error"}
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 600, fontSize: 13 }}
                    />
                  </InfoValue>
                </InfoItem>
              </Box>

              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>주차</InfoLabel>
                  <InfoValue>
                    {property.parkingCapacity
                      ? `세대당 ${property.parkingCapacity}대`
                      : "-"}
                  </InfoValue>
                </InfoItem>
              </Box>

              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>반려동물</InfoLabel>
                  <InfoValue>
                    <Chip
                      label={property.petsAllowed ? "O" : "X"}
                      color={property.petsAllowed ? "success" : "error"}
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 600, fontSize: 13 }}
                    />
                  </InfoValue>
                </InfoItem>
              </Box>

              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>입주가능일</InfoLabel>
                  <InfoValue>
                    {property.moveInDate
                      ? dayjs(property.moveInDate).format("YYYY.MM.DD")
                      : "-"}
                  </InfoValue>
                </InfoItem>
              </Box>
            </Box>
          </InfoCard>

          <InfoCard>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              계약 정보
            </Typography>

            <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={1}>
              {/* 계약 시작일 */}
              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>계약 시작일</InfoLabel>
                  <InfoValue>
                    {contractInfo?.contractStartDate
                      ? dayjs(contractInfo.contractStartDate).format(
                          "YYYY.MM.DD"
                        )
                      : "-"}
                  </InfoValue>
                </InfoItem>
              </Box>

              {/* 계약 종료일 */}
              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>계약 종료일</InfoLabel>
                  <InfoValue>
                    {contractInfo?.contractEndDate
                      ? dayjs(contractInfo.contractEndDate).format("YYYY.MM.DD")
                      : "-"}
                  </InfoValue>
                </InfoItem>
              </Box>

              {/* 계약일 */}
              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>계약일</InfoLabel>
                  <InfoValue>
                    {contractInfo?.contractDate
                      ? dayjs(contractInfo.contractDate).format("YYYY.MM.DD")
                      : "-"}
                  </InfoValue>
                </InfoItem>
              </Box>

              {/* 임대인/매도인 */}
              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>임대인/매도인</InfoLabel>
                  <InfoValue>
                    {contractInfo ? getCustomerNames(contractInfo.customers, "LESSOR_OR_SELLER") : "-"}
                  </InfoValue>
                </InfoItem>
              </Box>

              {/* 임차인/매수인 */}
              <Box width="calc(50% - 8px)">
                <InfoItem>
                  <InfoLabel>임차인/매수인</InfoLabel>
                  <InfoValue>
                    {contractInfo ? getCustomerNames(contractInfo.customers, "LESSEE_OR_BUYER") : "-"}
                  </InfoValue>
                </InfoItem>
              </Box>
            </Box>
          </InfoCard>
        </InfoGrid>

        <Box
          display="flex"
          gap={3}
          mt={3}
          alignItems="stretch"
          sx={{ height: "fit-content", alignItems: "stretch" }}
        >
          {property.details && (
            <InfoCard
              sx={{ flex: 4, display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                상세 정보
              </Typography>
              <InfoItem>
                <InfoLabel>특이사항</InfoLabel>
                <InfoValue>{property.details || "-"}</InfoValue>
              </InfoItem>
            </InfoCard>
          )}

          <InfoCard sx={{ flex: 6, display: "flex", flexDirection: "column", height: "100%" }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
              <Tab label="계약 히스토리" />
              <Tab label="상담 히스토리" />
            </Tabs>

            {tab === 0 && (
              <>
                <Box
                  display="flex"
                  fontWeight="bold"
                  fontSize={14}
                  sx={{ borderBottom: "1px solid #ccc", pb: 1, mb: 1 }}
                >
                  <Box flex={1} textAlign="center">임대인/매도인</Box>
                  <Box flex={1} textAlign="center">임차인/매수인</Box>
                  <Box flex={1} textAlign="center">카테고리</Box>
                  <Box flex={1} textAlign="center">상태</Box>
                  <Box flex={1} textAlign="center">변경일</Box>
                </Box>
                {contractHistories.length === 0 ? (
                  <Typography color="text.secondary" align="center">히스토리 없음</Typography>
                ) : (
                  contractHistories.map((history, idx) => {
                    return (
                      <Box
                        key={idx}
                        display="flex"
                        alignItems="center"
                        fontSize={14}
                        sx={{
                          borderBottom: "1px solid #eee",
                          py: 1,
                        }}
                      >
                        <Box flex={1} textAlign="center">{getCustomerSummary(history.customers, "LESSOR_OR_SELLER")}</Box>
                        <Box flex={1} textAlign="center">{getCustomerSummary(history.customers, "LESSEE_OR_BUYER")}</Box>
                        <Box flex={1} textAlign="center">
                          {getCategoryChip(history.contractCategory)}
                        </Box>
                        <Box flex={1} textAlign="center">
                          {getStatusChip(history.contractStatus)}
                        </Box>
                        <Box flex={1} textAlign="center">
                          {dayjs(history.endDate).format("YYYY.MM.DD")}
                        </Box>
                      </Box>
                    );
                  })
                )}
              </>
            )}

            {tab === 1 && (
              <>
                <Box display="flex" fontWeight="bold" fontSize={14} sx={{ borderBottom: "1px solid #ccc", pb: 1, mb: 1 }}>
                  <Box flex={1} textAlign="center">상담 제목</Box>
                  <Box flex={1} textAlign="center">상담일</Box>
                  <Box flex={1} textAlign="center">고객명</Box>
                  <Box flex={1} textAlign="center">연락처</Box>
                </Box>
                {counselHistories.length === 0 ? (
                  <Typography color="text.secondary" align="center">히스토리 없음</Typography>
                ) : (
                  counselHistories.map((counsel) => (
                    <Box key={counsel.counselUid} display="flex" alignItems="center" fontSize={14} sx={{ borderBottom: "1px solid #eee", py: 1 }}>
                      <Box flex={1} textAlign="center">{counsel.counselTitle}</Box>
                      <Box flex={1} textAlign="center">{counsel.counselDate}</Box>
                      <Box flex={1} textAlign="center">{counsel.customerName}</Box>
                      <Box flex={1} textAlign="center">{counsel.customerPhoneNo}</Box>
                    </Box>
                  ))
                )}
              </>
            )}
          </InfoCard>
        </Box>
      </DetailPageContainer>
    </PageContainer>
  );
};

export default AgentPropertyDetailPage;
