import { useState } from "react";
import ContractAddModal from "./ContractAddModal";
import Button from "@components/Button";

interface Props {
  fetchContractData: () => void;
}

const ContractAddButtonList = ({ fetchContractData }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className="bg-[#164F9E] text-white hover:bg-[#1E4A8B]"
      >
        계약 등록
      </Button>

      {/* 계약 등록 모달 */}
      <ContractAddModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        fetchContractData={fetchContractData}
      />
    </>
  );
};

export default ContractAddButtonList;
