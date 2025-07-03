import { Box, Button } from "@mui/material";
import {
  DetailPageContainer,
  DetailHeader,
  HeaderTitle,
  MapContainer,
  InfoGrid,
  InfoCard,
  PageContainer,
} from "./styles/AgentPropertyDetailPage.styles";
import DeleteConfirmModal from "@components/DeleteConfirm/DeleteConfirmModal";
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

interface AgentPropertyDetailPageViewProps {
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
}

function AgentPropertyDetailPageView({
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
}: AgentPropertyDetailPageViewProps) {
  if (!property) return null;

  return (
    <PageContainer>
      <PageHeader title="매물 상세 조회" />
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
              color="primary"
              startIcon={<EditIcon />}
              onClick={onEdit}
              sx={{ mr: 1, backgroundColor: "white" }}
            >
              수정
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
              sx={{ backgroundColor: "white" }}
            >
              삭제
            </Button>
          </Box>
        </DetailHeader>

        {/* 지도 */}
        <InfoCard sx={{ mb: 3 }}>
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
        <Box display="flex" gap={3} mt={3} sx={{ height: "fit-content" }}>
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
