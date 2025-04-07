import { Dispatch, SetStateAction } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import Button from "@components/Button";

interface Props {
  setAddress: Dispatch<SetStateAction<string | null>>;
  setAddressForCoord: Dispatch<SetStateAction<string | null>>;
}

function DaumPost({ setAddress, setAddressForCoord }: Props) {
  const open = useDaumPostcodePopup();

  const handleComplete = (data: any) => {
    setAddress(data?.addressEnglish);
    setAddressForCoord(data?.address);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };
  return <Button text="주소 찾기" onClick={handleClick} />;
}

export default DaumPost;
