import { useState } from "react";
import Button from "@components/Button";
import TextField from "@components/TextField";
import {
  Modal,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from "@mui/material";
import useInput from "@hooks/useInput";
import apiClient from "@apis/apiClient";

const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;

function CustomerAddModal({
  open,
  handleClose: setModalClose,
  fetchCustomerList,
}: any) {
  const [userName, handleChangeUserName, setUserName] = useInput("");
  const [phoneNumber, handleChangePhoneNumber, setPhoneNumber] = useInput("");
  const [address, handleChangeAddress, setAddress] = useInput("");
  const [trafficSource, handleChangeTrafficSource, setTrafficSource] =
    useInput("");
  const [region, handleChangeRegion, setRegion] = useInput("");

  const [telProvider, setTelProvider] = useState<string | null>(null);
  const [buyingData, setBuyingData] = useState({
    minPrice: null,
    maxPrice: null,
  });
  const [rentData, setRentData] = useState({
    minDeposit: null,
    maxDeposit: null,
    minRent: null,
    maxRent: null,
  });
  const [roleData, setRoleData] = useState({
    landlord: false,
    tenant: false,
    buyer: false,
    seller: false,
  });

  const isSubmitButtonDisabled =
    !userName || !phoneRegex.test(phoneNumber) || !address;

  const resetCustomerData = () => {
    setUserName("");
    setPhoneNumber("");
    setAddress("");
    setTrafficSource("");
    setRegion("");
    setTelProvider(null);
    setBuyingData({ minPrice: null, maxPrice: null });
    setRentData({
      minDeposit: null,
      maxDeposit: null,
      minRent: null,
      maxRent: null,
    });
    setRoleData({
      landlord: false,
      tenant: false,
      buyer: false,
      seller: false,
    });
  };

  const handleChangeTelProvider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelProvider(e.target.value);
  };

  const handleChangeBuyingData = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setBuyingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeRentData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeRoleData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setRoleData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleClickSubmitButton = () => {
    const rentDataToSubmit = roleData.tenant
      ? rentData
      : { minDeposit: null, maxDeposit: null, minRent: null, maxRent: null };

    const buyingDataToSubmit = roleData.buyer
      ? buyingData
      : {
          minPrice: null,
          maxPrice: null,
        };

    apiClient
      .post("/customers", {
        name: userName,
        phoneNo: phoneNumber,
        address,
        telProvider,
        region,
        trafficSource,
        ...rentDataToSubmit,
        ...buyingDataToSubmit,
        isLandlord: roleData.landlord,
        isTenant: roleData.tenant,
        isBuyer: roleData.buyer,
        isSeller: roleData.seller,
      })
      .then((res) => {
        if (res.status === 201) {
          alert("고객 등록 성공");
          handleModalClose();
          fetchCustomerList();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleModalClose = () => {
    setModalClose();
    resetCustomerData();
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50vw",
          backgroundColor: "white",
          boxShadow: 24,
          borderRadius: 2,
          p: 0,
          height: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            overflowY: "scroll",
            flexGrow: 1,
            p: 4,
          }}
        >
          <Typography variant="h6">고객 데이터 등록</Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="이름"
              value={userName}
              onChange={handleChangeUserName}
              name="name"
              fullWidth
            />
            <TextField
              label="전화번호"
              value={phoneNumber}
              onChange={handleChangePhoneNumber}
              name="phone"
              sx={{ mt: 2 }}
              fullWidth
            />
            <TextField
              label="주소"
              value={address}
              onChange={handleChangeAddress}
              name="address"
              sx={{ mt: 2 }}
              fullWidth
            />
            <Typography sx={{ mt: 2 }}>통신사</Typography>
            <RadioGroup
              value={telProvider}
              onChange={handleChangeTelProvider}
              row
            >
              <FormControlLabel value="SKT" control={<Radio />} label="SKT" />
              <FormControlLabel value="KT" control={<Radio />} label="KT" />
              <FormControlLabel value="LG" control={<Radio />} label="LG" />
              <FormControlLabel
                value="SKT+"
                control={<Radio />}
                label="SKT 알뜰폰"
              />
              <FormControlLabel
                value="KT+"
                control={<Radio />}
                label="KT 알뜰폰"
              />
              <FormControlLabel
                value="LG+"
                control={<Radio />}
                label="LG 알뜰폰"
              />
            </RadioGroup>
            <TextField
              label="지역"
              value={region}
              onChange={handleChangeRegion}
              sx={{ mt: 2 }}
              fullWidth
            />
            <TextField
              label="유입경로"
              value={trafficSource}
              onChange={handleChangeTrafficSource}
              name="source"
              sx={{ mt: 2 }}
              fullWidth
            />
            <Box sx={{ mt: 2, gap: 2, mb: 8 }}>
              <Typography sx={{ mt: 2 }}>고객 타입</Typography>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={roleData.landlord}
                    onChange={handleChangeRoleData}
                    name="landlord"
                  />
                }
                label="임대인"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={roleData.tenant}
                    onChange={handleChangeRoleData}
                    name="tenant"
                  />
                }
                label="임차인"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={roleData.buyer}
                    onChange={handleChangeRoleData}
                    name="buyer"
                  />
                }
                label="매수자"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={roleData.seller}
                    onChange={handleChangeRoleData}
                    name="seller"
                  />
                }
                label="매도자"
              />

              {roleData.tenant && (
                <>
                  <div className="flex items-center gap-4">
                    <TextField
                      label="최소 보증금"
                      value={rentData.minDeposit ?? "0"}
                      onChange={handleChangeRentData}
                      name="minDeposit"
                      fullWidth
                      sx={{ mt: 2, width: "50%" }}
                    />
                    <span>~</span>
                    <TextField
                      label="최대 보증금"
                      value={rentData.maxDeposit ?? "0"}
                      onChange={handleChangeRentData}
                      name="maxDeposit"
                      sx={{ mt: 2, width: "50%" }}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <TextField
                      label="최소 월세"
                      value={rentData.minRent ?? "0"}
                      onChange={handleChangeRentData}
                      name="minRent"
                      sx={{ mt: 2, width: "50%" }}
                    />
                    <span>~</span>
                    <TextField
                      label="최대 월세"
                      value={rentData.maxRent ?? "0"}
                      onChange={handleChangeRentData}
                      name="maxRent"
                      sx={{ mt: 2, width: "50%" }}
                    />
                  </div>
                </>
              )}
              {roleData.buyer && (
                <div className="flex items-center gap-4">
                  <TextField
                    label="최소 가격"
                    value={buyingData.minPrice ?? "0"}
                    onChange={handleChangeBuyingData}
                    name="minPrice"
                    sx={{ mt: 2, width: "50%" }}
                  />
                  <span>~</span>
                  <TextField
                    label="최대 가격"
                    value={buyingData.maxPrice ?? "0"}
                    onChange={handleChangeBuyingData}
                    name="maxPrice"
                    sx={{ mt: 2, width: "50%" }}
                  />
                </div>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              paddingTop: 2,
              paddingBottom: 2,
              borderTop: "1px solid #ddd",
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              backgroundColor: "white",
              width: "calc(100% - 64px)",
              zIndex: 10,
            }}
          >
            <Button
              text="닫기"
              onClick={handleModalClose}
              sx={{
                color: "white",
                backgroundColor: "gray",
              }}
            />
            <Button
              text="등록"
              disabled={isSubmitButtonDisabled}
              onClick={() => {
                handleClickSubmitButton();
              }}
              sx={{
                color: "white",
                backgroundColor: "#2E5D9F",
                "&:disabled": { backgroundColor: "darkgray", color: "white" },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
export default CustomerAddModal;
