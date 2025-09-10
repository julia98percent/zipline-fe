import { Chip, TextField, Autocomplete } from "@mui/material";
import { Label, Customer } from "@/types/customer";

// 새로 생성할 라벨을 나타내는 임시 UID
const NEW_LABEL_TEMP_UID = -1;

interface CustomerRoleLabelsProps {
  customer: Customer;
  isEditing: boolean;
  editedCustomer: Customer | null;
  availableLabels: { uid: number; name: string }[];
  onInputChange: (
    field: keyof Customer,
    value: string | number | boolean | null | { uid: number; name: string }[]
  ) => void;
  onCreateLabel?: (name: string) => Promise<Label>;
  labelInputValue?: string;
  onLabelInputChange?: (value: string) => void;
}

const CustomerRoleLabels = ({
  customer,
  isEditing,
  editedCustomer,
  availableLabels,
  onInputChange,
  onCreateLabel,
  labelInputValue,
  onLabelInputChange,
}: CustomerRoleLabelsProps) => {
  return (
    <div className="flex-1 p-5 card">
      {/* 역할 정보 영역 */}
      <div className="mb-8">
        <h6 className="text-lg font-semibold text-primary mb-2">역할</h6>
        <div className="flex gap-2 flex-wrap">
          {isEditing ? (
            <>
              <Chip
                label="임차인"
                onClick={() => onInputChange("tenant", !editedCustomer?.tenant)}
                className="cursor-pointer"
                sx={{
                  backgroundColor: editedCustomer?.tenant
                    ? "#FEF5EB"
                    : "#F5F5F5",
                  color: editedCustomer?.tenant ? "#F2994A" : "#757575",
                }}
              />
              <Chip
                label="임대인"
                onClick={() =>
                  onInputChange("landlord", !editedCustomer?.landlord)
                }
                className="cursor-pointer"
                sx={{
                  backgroundColor: editedCustomer?.landlord
                    ? "#FDEEEE"
                    : "#F5F5F5",
                  color: editedCustomer?.landlord ? "#EB5757" : "#757575",
                }}
              />
              <Chip
                label="매수인"
                onClick={() => onInputChange("buyer", !editedCustomer?.buyer)}
                className="cursor-pointer"
                sx={{
                  backgroundColor: editedCustomer?.buyer
                    ? "#E9F7EF"
                    : "#F5F5F5",
                  color: editedCustomer?.buyer ? "#219653" : "#757575",
                }}
              />
              <Chip
                label="매도인"
                onClick={() => onInputChange("seller", !editedCustomer?.seller)}
                className="cursor-pointer"
                sx={{
                  backgroundColor: editedCustomer?.seller
                    ? "#EBF2FC"
                    : "#F5F5F5",
                  color: editedCustomer?.seller ? "#2F80ED" : "#757575",
                }}
              />
            </>
          ) : (
            <>
              {customer.tenant && (
                <Chip
                  label="임차인"
                  sx={{ backgroundColor: "#FEF5EB", color: "#F2994A" }}
                />
              )}
              {customer.landlord && (
                <Chip
                  label="임대인"
                  sx={{ backgroundColor: "#FDEEEE", color: "#EB5757" }}
                />
              )}
              {customer.buyer && (
                <Chip
                  label="매수인"
                  sx={{ backgroundColor: "#E9F7EF", color: "#219653" }}
                />
              )}
              {customer.seller && (
                <Chip
                  label="매도인"
                  sx={{ backgroundColor: "#EBF2FC", color: "#2F80ED" }}
                />
              )}
              {!customer.tenant &&
                !customer.landlord &&
                !customer.buyer &&
                !customer.seller && <div>없음</div>}
            </>
          )}
        </div>
      </div>

      {/* 라벨 영역 */}
      <div>
        <h6 className="text-lg font-semibold text-primary mb-2">라벨</h6>
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <Autocomplete
              multiple
              freeSolo
              size="small"
              options={availableLabels}
              disableClearable
              blurOnSelect={false}
              clearOnBlur={false}
              handleHomeEndKeys={false}
              inputValue={labelInputValue || ""}
              onInputChange={(_, newInputValue) => {
                onLabelInputChange?.(newInputValue);
              }}
              getOptionLabel={(option) => {
                return typeof option === "string" ? option : option.name;
              }}
              value={editedCustomer?.labels || []}
              onChange={async (_, newValue) => {
                const processedLabels: Label[] = [];

                for (const value of newValue) {
                  if (
                    typeof value === "object" &&
                    value.uid !== NEW_LABEL_TEMP_UID
                  ) {
                    processedLabels.push(value);
                  }
                }

                onInputChange("labels", processedLabels);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="라벨 검색 및 추가"
                  helperText="텍스트 입력 후 Enter 키로 라벨 추가"
                  FormHelperTextProps={{
                    sx: { fontSize: "0.7rem", margin: 0, padding: 0 },
                  }}
                  onKeyDown={(event) => {
                    const nativeEvent = event.nativeEvent as KeyboardEvent;
                    if (nativeEvent.isComposing || event.keyCode === 229) {
                      return;
                    }

                    if (event.key === "Enter") {
                      event.stopPropagation();

                      const currentInputValue = labelInputValue?.trim();

                      if (currentInputValue) {
                        const exactMatch = availableLabels.find(
                          (label) =>
                            label.name.toLowerCase() ===
                            currentInputValue.toLowerCase()
                        );

                        if (exactMatch) {
                          const currentLabels = editedCustomer?.labels || [];
                          const isAlreadySelected = currentLabels.some(
                            (label) => label.uid === exactMatch.uid
                          );

                          if (!isAlreadySelected) {
                            onInputChange("labels", [
                              ...currentLabels,
                              exactMatch,
                            ]);
                          }

                          onLabelInputChange?.("");
                        } else {
                          const partialMatches = availableLabels.filter(
                            (label) =>
                              label.name
                                .toLowerCase()
                                .includes(currentInputValue.toLowerCase())
                          );

                          if (partialMatches.length > 0) {
                            const bestMatch = partialMatches.sort(
                              (a, b) => a.name.length - b.name.length
                            )[0];
                            const currentLabels = editedCustomer?.labels || [];
                            const isAlreadySelected = currentLabels.some(
                              (label) => label.uid === bestMatch.uid
                            );

                            if (!isAlreadySelected) {
                              onInputChange("labels", [
                                ...currentLabels,
                                bestMatch,
                              ]);
                            }

                            onLabelInputChange?.("");
                          } else {
                            if (onCreateLabel) {
                              onCreateLabel(currentInputValue)
                                .then((createdLabel) => {
                                  const currentLabels =
                                    editedCustomer?.labels || [];
                                  onInputChange("labels", [
                                    ...currentLabels,
                                    createdLabel,
                                  ]);

                                  onLabelInputChange?.("");
                                })
                                .catch((error) => {
                                  console.error("라벨 생성 실패:", error);
                                });
                            }
                          }
                        }

                        event.preventDefault();
                      }
                    }
                  }}
                  fullWidth
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.uid}
                    label={option.name}
                    size="small"
                    variant="outlined"
                    sx={{
                      backgroundColor:
                        option.uid === NEW_LABEL_TEMP_UID
                          ? "#e3f2fd"
                          : undefined,
                      borderColor:
                        option.uid === NEW_LABEL_TEMP_UID
                          ? "#2196f3"
                          : undefined,
                    }}
                  />
                ))
              }
              isOptionEqualToValue={(option, value) => {
                return option.uid === value.uid;
              }}
              filterOptions={(options, params) => {
                const { inputValue: searchValue } = params;

                if (!searchValue) return options;

                const exactMatches = options.filter(
                  (option) =>
                    option.name.toLowerCase() === searchValue.toLowerCase()
                );

                const startsWithMatches = options.filter(
                  (option) =>
                    option.name
                      .toLowerCase()
                      .startsWith(searchValue.toLowerCase()) &&
                    option.name.toLowerCase() !== searchValue.toLowerCase()
                );

                const partialMatches = options.filter(
                  (option) =>
                    option.name
                      .toLowerCase()
                      .includes(searchValue.toLowerCase()) &&
                    !option.name
                      .toLowerCase()
                      .startsWith(searchValue.toLowerCase()) &&
                    option.name.toLowerCase() !== searchValue.toLowerCase()
                );

                const hasExactMatch = exactMatches.length > 0;

                const filtered = [
                  ...exactMatches,
                  ...startsWithMatches,
                  ...partialMatches,
                ];

                if (!hasExactMatch) {
                  filtered.push({
                    uid: NEW_LABEL_TEMP_UID,
                    name: searchValue,
                  } as Label);
                }

                return filtered;
              }}
              renderOption={(props, option) => {
                const { key: _, ...newProps } = props;
                return (
                  <li key={option.uid + option.name} {...newProps}>
                    {option.uid === NEW_LABEL_TEMP_UID ? (
                      <div className="flex items-center gap-2">
                        <span>"{option.name}" 새 라벨 생성</span>
                        <Chip
                          label="NEW"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </div>
                    ) : (
                      option.name
                    )}
                  </li>
                );
              }}
              className="w-full"
            />
          ) : (
            <>
              {customer.labels && customer.labels.length > 0 ? (
                customer.labels.map((label: Label) => (
                  <Chip key={label.uid} label={label.name} variant="outlined" />
                ))
              ) : (
                <span>-</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerRoleLabels;
