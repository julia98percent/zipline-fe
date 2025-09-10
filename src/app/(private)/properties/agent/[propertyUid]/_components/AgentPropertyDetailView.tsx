import { Divider } from "@mui/material";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import PropertyEditModal from "@/components/PropertyEditModal";
import KakaoMap from "@/components/KakaoMap";
import {
  AgentPropertyDetail,
  ContractHistoryItem,
  ContractInfo,
  CounselHistory,
} from "@/apis/propertyService";
import PropertyInfoSection from "./PropertyInfoSection";
import PropertyDetailSection from "./PropertyDetailSection";
import FacilityInfoSection from "./FacilityInfoSection";
import ContractInfoSection from "./ContractInfoSection";
import PropertyHistorySection from "./PropertyHistorySection";
import PropertyDetailsSection from "./PropertyDetailsSection";
import Button from "@/components/Button";
import CircularProgress from "@/components/CircularProgress";

interface AgentPropertyDetailViewProps {
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
}

function AgentPropertyDetailView({
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
}: AgentPropertyDetailViewProps) {
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-[calc(100vh-72px)]">
          <CircularProgress />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="pt-0 p-6">
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
        <div className="w-full flex flex-col sm:flex-row-reverse justify-between gap-1 sm:items-center mb-4">
          <div className="flex items-center justify-end gap-1">
            <Button variant="text" color="info" onClick={onEdit}>
              수정
            </Button>
            <Divider orientation="vertical" className="h-4 bg-neutral-300" />
            <Button variant="text" color="error" onClick={onDelete}>
              삭제
            </Button>
          </div>
          <h3 className="text-2xl font-semibold">
            {`${property.address ?? ""} ${
              property.detailAddress ?? ""
            }`.trim() || "-"}
          </h3>
        </div>

        <div className="card w-full h-full mb-6">
          <div className="w-full h-[400px] p-3">
            <KakaoMap lat={property.latitude} lng={property.longitude} />
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-3">
          <PropertyInfoSection property={property} />
          <PropertyDetailSection property={property} />
          <FacilityInfoSection property={property} />
          <ContractInfoSection contractInfo={contractInfo} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-fit">
          <PropertyDetailsSection details={property.details} />
          <PropertyHistorySection
            contractHistories={contractHistories}
            counselHistories={counselHistories}
            tab={tab}
            onTabChange={onTabChange}
          />
        </div>
      </div>
    </div>
  );
}

export default AgentPropertyDetailView;
