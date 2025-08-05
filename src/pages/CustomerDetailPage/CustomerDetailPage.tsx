import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  fetchCustomerDetail,
  updateCustomer,
  deleteCustomer,
  fetchLabels,
  createLabel,
} from "@apis/customerService";
import { formatPhoneNumber } from "@utils/numberUtil";
import { showToast } from "@components/Toast";
import CustomerDetailPageView from "./CustomerDetailPageView";
import { Customer, CustomerUpdateData, Label } from "@ts/customer";
import { API_ERROR_MESSAGES } from "@ts/apiResponse";
import { parseRegionCode, RegionHierarchy } from "@utils/regionUtil";

interface OutletContext {
  onMobileMenuToggle: () => void;
}

const CustomerDetailPage = () => {
  const { onMobileMenuToggle } = useOutletContext<OutletContext>();
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);
  const [availableLabels, setAvailableLabels] = useState<
    { uid: number; name: string }[]
  >([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [labelInputValue, setLabelInputValue] = useState("");
  const [regionValueList, setRegionValueList] =
    useState<RegionHierarchy | null>(null);

  const fetchCustomerData = useCallback(async () => {
    if (!customerId) return;

    setLoading(true);
    try {
      const customerData = await fetchCustomerDetail(customerId);
      setCustomer(customerData);
      setRegionValueList(parseRegionCode(customerData.preferredRegion));
    } catch (error) {
      console.error("Failed to fetch customer:", error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  useEffect(() => {
    if (isEditing) {
      fetchLabels()
        .then((labels) => {
          setAvailableLabels(labels);
        })
        .catch(console.error);
    }
  }, [isEditing]);

  const handleCreateLabel = async (name: string): Promise<Label> => {
    try {
      const newLabel = await createLabel(name);

      setAvailableLabels((prev) => [...prev, newLabel]);

      showToast({
        message: `라벨 "${name}"을 생성했습니다.`,
        type: "success",
      });

      return newLabel;
    } catch (error) {
      console.error("Failed to create label:", error);
      showToast({
        message: "라벨 생성에 실패했습니다.",
        type: "error",
      });
      throw error;
    }
  };

  const handleEditClick = () => {
    if (customer) {
      const editedData = {
        ...customer,
        minRent: customer.minRent || null,
        maxRent: customer.maxRent || null,
        minPrice: customer.minPrice || null,
        maxPrice: customer.maxPrice || null,
        minDeposit: customer.minDeposit || null,
        maxDeposit: customer.maxDeposit || null,
        birthday: customer.birthday || null,
        labels: [...(customer.labels || [])],
      };
      setEditedCustomer(editedData);
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedCustomer(null);
    setIsEditing(false);
    setLabelInputValue(""); // 라벨 입력값 초기화
  };

  const handleInputChange = useCallback(
    (
      field: keyof Customer,
      value: string | number | boolean | null | { uid: number; name: string }[]
    ) => {
      if (!editedCustomer) return;

      const processedValue = value === "" ? null : value;
      const updated = {
        ...editedCustomer,
        [field]: processedValue,
      };

      setEditedCustomer(updated);
    },
    [editedCustomer]
  );

  const handleSaveEdit = async () => {
    if (!editedCustomer || !customerId) return;

    try {
      if (!editedCustomer.name) {
        showToast({
          message: "이름을 입력해주세요.",
          type: "error",
        });
        return;
      }
      if (!editedCustomer.phoneNo) {
        showToast({
          message: "전화번호를 입력해주세요.",
          type: "error",
        });
        return;
      }
      if (editedCustomer.birthday && !/^\d{8}$/.test(editedCustomer.birthday)) {
        showToast({
          message: "생년월일을 올바르게 입력해주세요. ex)19910501",
          type: "error",
        });
        return;
      }

      const requestData: CustomerUpdateData = {
        name: editedCustomer.name,
        phoneNo: formatPhoneNumber(editedCustomer.phoneNo),
        telProvider: editedCustomer.telProvider,
        preferredRegion: editedCustomer.preferredRegion,
        minRent: editedCustomer.minRent,
        maxRent: editedCustomer.maxRent,
        trafficSource: editedCustomer.trafficSource,
        landlord: editedCustomer.landlord,
        tenant: editedCustomer.tenant,
        buyer: editedCustomer.buyer,
        seller: editedCustomer.seller,
        maxPrice: editedCustomer.maxPrice,
        minPrice: editedCustomer.minPrice,
        minDeposit: editedCustomer.minDeposit,
        maxDeposit: editedCustomer.maxDeposit,
        birthday: editedCustomer.birthday,
        labelUids: editedCustomer.labels.map((label) => label.uid),
      };

      await updateCustomer(customerId, requestData);

      showToast({
        message: "고객 정보를 수정했습니다.",
        type: "success",
      });
      setIsEditing(false);
      setLabelInputValue("");
      fetchCustomerData();
    } catch (e) {
      const error = e as API_ERROR_MESSAGES;

      const errorMessage =
        error?.response?.data.message || "고객 정보 수정에 실패했습니다.";

      showToast({
        message: errorMessage,
        type: "error",
      });
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!customerId) return;

    try {
      await deleteCustomer(customerId);
      showToast({
        message: "고객을 삭제했습니다.",
        type: "success",
      });
      navigate("/customers");
    } catch (error) {
      console.error("Failed to delete customer:", error);
      showToast({
        message: "고객 삭제에 실패했습니다.",
        type: "error",
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <CustomerDetailPageView
      loading={loading}
      customer={customer}
      customerId={customerId}
      isEditing={isEditing}
      editedCustomer={editedCustomer}
      availableLabels={availableLabels}
      isDeleteModalOpen={isDeleteModalOpen}
      onEditClick={handleEditClick}
      onCancelEdit={handleCancelEdit}
      onSaveEdit={handleSaveEdit}
      onInputChange={handleInputChange}
      onDeleteClick={handleDeleteClick}
      onDeleteCancel={handleDeleteCancel}
      onDeleteConfirm={handleDeleteConfirm}
      onCreateLabel={handleCreateLabel}
      labelInputValue={labelInputValue}
      onLabelInputChange={setLabelInputValue}
      onMobileMenuToggle={onMobileMenuToggle}
      initialRegionValueList={regionValueList}
    />
  );
};

export default CustomerDetailPage;
