import { Dispatch, SetStateAction } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import Button from "@components/Button";

interface Props {
  setAddress: Dispatch<SetStateAction<string | null>>;
  setDong: React.Dispatch<React.SetStateAction<string | null>>;
  setRoadName: React.Dispatch<React.SetStateAction<string | null>>;
}

interface DaumPostcodeData {
  address: string;
  roadAddress: string;
  bname: string;
}

function DaumPost({ setAddress, setDong, setRoadName }: Props) {
  const open = useDaumPostcodePopup();

  const handleComplete = (data: DaumPostcodeData) => {
    setAddress(data.address);
    setDong(data.bname);
    setRoadName(data.roadAddress);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };
  return <Button text="주소 찾기" onClick={handleClick} />;
}

export default DaumPost;
