import { Box, TextField, Chip, IconButton, Autocomplete } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { Customer, Label } from "@ts/customer";

// 새로 생성할 라벨을 나타내는 임시 UID
const NEW_LABEL_TEMP_UID = -1;

interface EditingCustomer extends Customer {
  isEditing?: boolean;
}

type EditableFields = string | boolean | Label[];

export const renderNameColumn = (
  customer: Customer,
  editingCustomers: { [key: number]: EditingCustomer },
  onEditChange: (
    uid: number,
    field: keyof Customer,
    value: EditableFields
  ) => void
) => {
  const editingCustomer = editingCustomers[customer.uid];

  if (editingCustomer?.isEditing) {
    return (
      <TextField
        size="small"
        value={editingCustomer.name}
        onChange={(e) => onEditChange(customer.uid, "name", e.target.value)}
        fullWidth
      />
    );
  }
  return customer.name;
};

export const renderPhoneColumn = (
  customer: Customer,
  editingCustomers: { [key: number]: EditingCustomer },
  onEditChange: (
    uid: number,
    field: keyof Customer,
    value: EditableFields
  ) => void
) => {
  const editingCustomer = editingCustomers[customer.uid];

  if (editingCustomer?.isEditing) {
    return (
      <TextField
        size="small"
        value={editingCustomer.phoneNo}
        onChange={(e) => onEditChange(customer.uid, "phoneNo", e.target.value)}
        fullWidth
      />
    );
  }
  return customer.phoneNo;
};

export const renderRolesColumn = (
  customer: Customer,
  editingCustomers: { [key: number]: EditingCustomer },
  onEditChange: (
    uid: number,
    field: keyof Customer,
    value: EditableFields
  ) => void
) => {
  const editingCustomer = editingCustomers[customer.uid];

  if (editingCustomer?.isEditing) {
    return (
      <Box className="flex flex-wrap gap-2">
        <Chip
          label="임차인"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEditChange(customer.uid, "tenant", !editingCustomer.tenant);
          }}
          className="cursor-pointer"
          sx={{
            backgroundColor: editingCustomer.tenant ? "#FCE8D4" : "#F5F5F5",
            color: editingCustomer.tenant ? "#E67E00" : "#757575",
            "&:hover": {
              backgroundColor: editingCustomer.tenant ? "#FCE8D4" : "#E0E0E0",
            },
          }}
        />
        <Chip
          label="임대인"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEditChange(customer.uid, "landlord", !editingCustomer.landlord);
          }}
          className="cursor-pointer"
          sx={{
            backgroundColor: editingCustomer.landlord ? "#FCDADA" : "#F5F5F5",
            color: editingCustomer.landlord ? "#D63939" : "#757575",
            "&:hover": {
              backgroundColor: editingCustomer.landlord ? "#FCDADA" : "#E0E0E0",
            },
          }}
        />
        <Chip
          label="매수인"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEditChange(customer.uid, "buyer", !editingCustomer.buyer);
          }}
          className="cursor-pointer"
          sx={{
            backgroundColor: editingCustomer.buyer ? "#D4EDDC" : "#F5F5F5",
            color: editingCustomer.buyer ? "#0E8A3E" : "#757575",
            "&:hover": {
              backgroundColor: editingCustomer.buyer ? "#D4EDDC" : "#E0E0E0",
            },
          }}
        />
        <Chip
          label="매도인"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEditChange(customer.uid, "seller", !editingCustomer.seller);
          }}
          className="cursor-pointer"
          sx={{
            backgroundColor: editingCustomer.seller ? "#D6E6F9" : "#F5F5F5",
            color: editingCustomer.seller ? "#1B64C2" : "#757575",
            "&:hover": {
              backgroundColor: editingCustomer.seller ? "#D6E6F9" : "#E0E0E0",
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box className="flex gap-1">
      {customer.tenant && (
        <Chip
          label="임차인"
          size="small"
          className="bg-[#FEF5EB] text-[#F2994A]"
        />
      )}
      {customer.landlord && (
        <Chip
          label="임대인"
          size="small"
          className="bg-[#FDEEEE] text-[#EB5757]"
        />
      )}
      {customer.buyer && (
        <Chip
          label="매수인"
          size="small"
          className="bg-[#E9F7EF] text-[#219653]"
        />
      )}
      {customer.seller && (
        <Chip
          label="매도인"
          size="small"
          className="bg-[#EBF2FC] text-[#2F80ED]"
        />
      )}
    </Box>
  );
};

export const renderLabelsColumn = (
  customer: Customer,
  editingCustomers: { [key: number]: EditingCustomer },
  availableLabels: Label[],
  onEditChange: (
    uid: number,
    field: keyof Customer,
    value: EditableFields
  ) => void,
  onCreateLabel?: (name: string) => Promise<Label>,
  inputValue?: string,
  onInputChange?: (value: string) => void
) => {
  const editingCustomer = editingCustomers[customer.uid];

  if (editingCustomer?.isEditing) {
    return (
      <Autocomplete
        multiple
        freeSolo
        size="small"
        options={availableLabels}
        disableClearable
        blurOnSelect={false}
        clearOnBlur={false}
        handleHomeEndKeys={false}
        inputValue={inputValue || ""}
        onInputChange={(_, newInputValue) => {
          onInputChange?.(newInputValue);
        }}
        getOptionLabel={(option) => {
          return typeof option === "string" ? option : option.name;
        }}
        value={editingCustomer.labels || []}
        onChange={async (_, newValue) => {
          // onChange에서는 기존 라벨만 처리하고, 새 라벨 생성은 Enter 키에서만 처리
          const processedLabels: Label[] = [];

          for (const value of newValue) {
            if (typeof value === "object" && value.uid !== NEW_LABEL_TEMP_UID) {
              // 기존 라벨만 추가
              processedLabels.push(value);
            }
          }

          onEditChange(customer.uid, "labels", processedLabels);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="라벨 검색 및 추가"
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

                const currentInputValue = inputValue?.trim();

                if (currentInputValue) {
                  const exactMatch = availableLabels.find(
                    (label) =>
                      label.name.toLowerCase() ===
                      currentInputValue.toLowerCase()
                  );

                  if (exactMatch) {
                    const currentLabels = editingCustomer.labels || [];
                    const isAlreadySelected = currentLabels.some(
                      (label) => label.uid === exactMatch.uid
                    );

                    if (!isAlreadySelected) {
                      onEditChange(customer.uid, "labels", [
                        ...currentLabels,
                        exactMatch,
                      ]);
                    }

                    onInputChange?.("");
                  } else {
                    const partialMatches = availableLabels.filter((label) =>
                      label.name
                        .toLowerCase()
                        .includes(currentInputValue.toLowerCase())
                    );

                    if (partialMatches.length > 0) {
                      const bestMatch = partialMatches.sort(
                        (a, b) => a.name.length - b.name.length
                      )[0];
                      const currentLabels = editingCustomer.labels || [];
                      const isAlreadySelected = currentLabels.some(
                        (label) => label.uid === bestMatch.uid
                      );

                      if (!isAlreadySelected) {
                        onEditChange(customer.uid, "labels", [
                          ...currentLabels,
                          bestMatch,
                        ]);
                      }

                      onInputChange?.("");
                    } else {
                      if (onCreateLabel) {
                        onCreateLabel(currentInputValue)
                          .then((createdLabel) => {
                            const currentLabels = editingCustomer.labels || [];
                            onEditChange(customer.uid, "labels", [
                              ...currentLabels,
                              createdLabel,
                            ]);
                            onInputChange?.("");
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
                  option.uid === NEW_LABEL_TEMP_UID ? "#e3f2fd" : undefined,
                borderColor:
                  option.uid === NEW_LABEL_TEMP_UID ? "#2196f3" : undefined,
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
            (option) => option.name.toLowerCase() === searchValue.toLowerCase()
          );

          const startsWithMatches = options.filter(
            (option) =>
              option.name.toLowerCase().startsWith(searchValue.toLowerCase()) &&
              option.name.toLowerCase() !== searchValue.toLowerCase()
          );

          const partialMatches = options.filter(
            (option) =>
              option.name.toLowerCase().includes(searchValue.toLowerCase()) &&
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
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.uid === NEW_LABEL_TEMP_UID ? (
              <Box className="flex items-center gap-1">
                <span>"{option.name}" 새 라벨 생성</span>
                <Chip
                  label="NEW"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            ) : (
              option.name
            )}
          </Box>
        )}
      />
    );
  }

  return (
    <Box className="flex flex-wrap gap-1">
      {customer.labels && customer.labels.length > 0
        ? customer.labels.map((label) => (
            <Chip
              key={label.uid}
              label={label.name}
              size="small"
              variant="outlined"
            />
          ))
        : null}
    </Box>
  );
};

export const renderActionsColumn = (
  customer: Customer,
  editingCustomers: { [key: number]: EditingCustomer },
  onEditStart: (customer: Customer) => void,
  onEditCancel: (uid: number) => void,
  onEditSave: (uid: number) => void,
  onDelete: (customer: Customer) => void
) => {
  const editingCustomer = editingCustomers[customer.uid];

  return (
    <Box className="flex gap-2 justify-center">
      {editingCustomer?.isEditing ? (
        <>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onEditSave(customer.uid);
            }}
            size="small"
            className="z-10"
          >
            <DoneIcon style={{ color: "#219653" }} />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onEditCancel(customer.uid);
            }}
            size="small"
            className="z-10"
          >
            <CloseIcon style={{ color: "#EB5757" }} />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onEditStart(customer);
            }}
            size="small"
            className="z-50"
          >
            <EditIcon style={{ color: "#164F9E" }} />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(customer);
            }}
            size="small"
            className="z-50"
          >
            <DeleteIcon style={{ color: "#E53535" }} />
          </IconButton>
        </>
      )}
    </Box>
  );
};
