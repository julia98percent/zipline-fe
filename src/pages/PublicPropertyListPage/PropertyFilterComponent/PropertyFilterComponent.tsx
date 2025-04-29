import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";

function PropertyFilterComponent({ onSearch }) {
  // Form state
  const [formData, setFormData] = useState({
    regionCode: "",
    buildingName: "",
    buildingType: "",
    category: "SALE",
    minPrice: 100000,
    maxPrice: 2000000,
    minDeposit: 100000,
    maxDeposit: 2000000,
    minMonthlyRent: 50,
    maxMonthlyRent: 2000,
    minArea: 10,
    maxArea: 185,
    page: 0,
    size: 20,
    sortFields: { id: "ASC" }
  });

  // Building types
  const buildingTypes = [
    "단독/다가구", "사무실", "건물", "빌라", "상가", "토지", "상가주택",
    "아파트", "한옥주택", "연립", "오피스텔", "다세대", "원룸", "재개발",
    "고시원", "공장/창고", "지식산업센터", "아파트분양권", "오피스텔분양권",
    "재건축", "전원주택"
  ];

  // Categories
  const categories = [
    { value: "SALE", label: "매매" },
    { value: "MONTHLY", label: "월세" },
    { value: "DEPOSIT", label: "전세" }
  ];

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle range slider changes
  const handleRangeChange = (name) => (event, newValue) => {
    setFormData({
      ...formData,
      [`min${name}`]: newValue[0],
      [`max${name}`]: newValue[1]
    });
  };

  // Handle search submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Create search parameters object based on the selected category
    const searchParams = {
      page: formData.page,
      size: formData.size,
      sortFields: formData.sortFields,
      regionCode: formData.regionCode,
      buildingName: formData.buildingName || null,
      buildingType: formData.buildingType || null,
      category: formData.category,
      minArea: formData.minArea,
      maxArea: formData.maxArea
    };

    // Add price parameters based on category
    if (formData.category === "SALE") {
      searchParams.minPrice = formData.minPrice;
      searchParams.maxPrice = formData.maxPrice;
    } else if (formData.category === "DEPOSIT") {
      searchParams.minDeposit = formData.minDeposit;
      searchParams.maxDeposit = formData.maxDeposit;
    } else if (formData.category === "MONTHLY") {
      searchParams.minDeposit = formData.minDeposit;
      searchParams.maxDeposit = formData.maxDeposit;
      searchParams.minMonthlyRent = formData.minMonthlyRent;
      searchParams.maxMonthlyRent = formData.maxMonthlyRent;
    }

    // Pass search parameters to parent component
    onSearch(searchParams);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        mb: 3,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        backgroundColor: "#f9f9f9"
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        매물 검색
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="지역 코드"
            name="regionCode"
            value={formData.regionCode}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="건물명"
            name="buildingName"
            value={formData.buildingName}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>건물 유형</InputLabel>
            <Select
              name="buildingType"
              value={formData.buildingType}
              onChange={handleChange}
              label="건물 유형"
            >
              <MenuItem value="">
                <em>선택 안함</em>
              </MenuItem>
              {buildingTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>거래 유형</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="거래 유형"
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Conditional Price fields based on category */}
      <Grid container spacing={2}>
        {(formData.category === "SALE") && (
          <Grid item xs={12}>
            <Typography gutterBottom>
              매매가 범위 (₩{formData.minPrice.toLocaleString()} - ₩{formData.maxPrice.toLocaleString()})
            </Typography>
            <Slider
              value={[formData.minPrice, formData.maxPrice]}
              onChange={handleRangeChange("Price")}
              min={100000}
              max={10000000}
              step={100000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `₩${value.toLocaleString()}`}
            />
          </Grid>
        )}

        {(formData.category === "DEPOSIT" || formData.category === "MONTHLY") && (
          <Grid item xs={12}>
            <Typography gutterBottom>
              보증금 범위 (₩{formData.minDeposit.toLocaleString()} - ₩{formData.maxDeposit.toLocaleString()})
            </Typography>
            <Slider
              value={[formData.minDeposit, formData.maxDeposit]}
              onChange={handleRangeChange("Deposit")}
              min={100000}
              max={10000000}
              step={100000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `₩${value.toLocaleString()}`}
            />
          </Grid>
        )}

        {formData.category === "MONTHLY" && (
          <Grid item xs={12}>
            <Typography gutterBottom>
              월세 범위 (₩{formData.minMonthlyRent.toLocaleString()} - ₩{formData.maxMonthlyRent.toLocaleString()})
            </Typography>
            <Slider
              value={[formData.minMonthlyRent, formData.maxMonthlyRent]}
              onChange={handleRangeChange("MonthlyRent")}
              min={50}
              max={5000}
              step={50}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `₩${value.toLocaleString()}`}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography gutterBottom>
            면적 범위 ({formData.minArea}㎡ - {formData.maxArea}㎡)
          </Typography>
          <Slider
            value={[formData.minArea, formData.maxArea]}
            onChange={handleRangeChange("Area")}
            min={10}
            max={330}
            step={5}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}㎡`}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
        >
          검색
        </Button>
      </Box>
    </Box>
  );
}

export default PropertyFilterComponent;
