import { Box } from "@mui/material";
import {
  DetailPageContainer,
  DetailHeader,
  HeaderTitle,
  MapContainer,
  InfoGrid,
  InfoCard,
  PageContainer,
} from "./styles/AgentPropertyDetailPage.styles";
import DeleteConfirmModal from "@components/DeleteConfirmModal";
import PageHeader from "@components/PageHeader/PageHeader";
import PropertyEditModal from "@components/PropertyEditModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KakaoMap from "@components/KakaoMap";
import {
  AgentPropertyDetail,
  ContractHistoryItem,
  ContractInfo,
  CounselHistory,
} from "@apis/propertyService";
import {
  PropertyInfoSection,
  PropertyDetailSection,
  FacilityInfoSection,
  ContractInfoSection,
  PropertyHistorySection,
  PropertyDetailsSection,
} from "./components";
import Button from "@components/Button";
import CircularProgress from "@components/CircularProgress";

interface AgentPropertyDetailPageViewProps {
  loading: boolean;
  property: AgentPropertyDetail;
  contractInfo: ContractInfo | null;
  contractHistories: ContractHistoryItem[];
  counselHistories: CounselHistory[];
  tab: number;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  propertyUid: number;
  onTabChange: (value: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onConfirmDelete: () => void;
  onEditModalClose: () => void;
  onDeleteModalClose: () => void;
  onPropertyDataRefresh: () => void;
  onMobileMenuToggle: () => void;
}

function AgentPropertyDetailPageView({
  loading,
  property,
  contractInfo,
  contractHistories,
  counselHistories,
  tab,
  editModalOpen,
  deleteModalOpen,
  propertyUid,
  onTabChange,
  onEdit,
  onDelete,
  onConfirmDelete,
  onEditModalClose,
  onDeleteModalClose,
  onPropertyDataRefresh,
  onMobileMenuToggle,
}: AgentPropertyDetailPageViewProps) {
  if (loading) {
    return (
      <div className="flex-grow bg-gray-100 min-h-screen">
        <PageHeader
          title="매물 상세 조회"
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <div className="flex items-center justify-center h-[calc(100vh-72px)]">
          <CircularProgress />
        </div>
      </div>
    );
  }
  return (
    <PageContainer>
      <PageHeader
        title="매물 상세 조회"
        onMobileMenuToggle={onMobileMenuToggle}
      />
      <DetailPageContainer>
        {editModalOpen && property && (
          <PropertyEditModal
            open={editModalOpen}
            handleClose={onEditModalClose}
            initialData={property}
            propertyUid={propertyUid}
            fetchPropertyData={onPropertyDataRefresh}
          />
        )}
        <DeleteConfirmModal
          open={deleteModalOpen}
          onConfirm={onConfirmDelete}
          onCancel={onDeleteModalClose}
          category="매물"
        />
        <DetailHeader>
          <HeaderTitle>
            {`${property.address ?? ""} ${
              property.detailAddress ?? ""
            }`.trim() || "-"}
          </HeaderTitle>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button
              variant="outlined"
              onClick={onEdit}
              startIcon={<EditIcon />}
            >
              수정
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={onDelete}
              startIcon={<DeleteIcon />}
            >
              삭제
            </Button>
          </Box>
        </DetailHeader>

        {/* 지도 */}
        <InfoCard className="rounded-lg shadow-sm mb-6">
          <MapContainer>
            <KakaoMap lat={property.latitude} lng={property.longitude} />
          </MapContainer>
        </InfoCard>

        {/* 매물 정보 섹션들 */}
        <InfoGrid>
          <PropertyInfoSection property={property} />
          <PropertyDetailSection property={property} />
          <FacilityInfoSection property={property} />
          <ContractInfoSection contractInfo={contractInfo} />
        </InfoGrid>

        {/* 하단 섹션 */}
        <Box display="flex" gap={3} mt={3} className="h-fit">
          <PropertyDetailsSection details={property.details} />
          <PropertyHistorySection
            contractHistories={contractHistories}
            counselHistories={counselHistories}
            tab={tab}
            onTabChange={onTabChange}
          />
        </Box>
      </DetailPageContainer>
    </PageContainer>
  );
}

export default AgentPropertyDetailPageView;
