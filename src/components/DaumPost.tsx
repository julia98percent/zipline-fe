import { Dispatch, SetStateAction } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import Button from "@components/Button";

interface Props {
  setAddress: Dispatch<SetStateAction<string | null>>;
}

interface DaumPostcodeData {
  address: string;
  roadAddress: string;
  bname: string;
}

function DaumPost({ setAddress }: Props) {
  const open = useDaumPostcodePopup();

  const handleComplete = (data: DaumPostcodeData) => {
    setAddress(data.address);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };
  return (
    <Button variant="text" color="primary" onClick={handleClick}>
      주소 찾기
    </Button>
  );
}

export default DaumPost;
