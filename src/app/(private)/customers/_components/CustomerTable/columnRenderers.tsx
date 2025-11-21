import { Box, TextField, Chip, IconButton, Autocomplete } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { Customer, Label } from "@/types/customer";
import { CUSTOMER_ROLES, NEUTRAL, TEXT, SUCCESS, ERROR, INFO } from "@/constants/colors";

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
            backgroundColor: editingCustomer.tenant ? CUSTOMER_ROLES.tenant.background : NEUTRAL[50],
            color: editingCustomer.tenant ? CUSTOMER_ROLES.tenant.text : TEXT.secondary,
            "&:hover": {
              backgroundColor: editingCustomer.tenant ? CUSTOMER_ROLES.tenant.background : NEUTRAL[200],
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
            backgroundColor: editingCustomer.landlord ? CUSTOMER_ROLES.landlord.background : NEUTRAL[50],
            color: editingCustomer.landlord ? CUSTOMER_ROLES.landlord.text : TEXT.secondary,
            "&:hover": {
              backgroundColor: editingCustomer.landlord ? CUSTOMER_ROLES.landlord.background : NEUTRAL[200],
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
            backgroundColor: editingCustomer.buyer ? CUSTOMER_ROLES.buyer.background : NEUTRAL[50],
            color: editingCustomer.buyer ? CUSTOMER_ROLES.buyer.text : TEXT.secondary,
            "&:hover": {
              backgroundColor: editingCustomer.buyer ? CUSTOMER_ROLES.buyer.background : NEUTRAL[200],
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
            backgroundColor: editingCustomer.seller ? CUSTOMER_ROLES.seller.background : NEUTRAL[50],
            color: editingCustomer.seller ? CUSTOMER_ROLES.seller.text : TEXT.secondary,
            "&:hover": {
              backgroundColor: editingCustomer.seller ? CUSTOMER_ROLES.seller.background : NEUTRAL[200],
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
          sx={{ backgroundColor: CUSTOMER_ROLES.tenant.background, color: CUSTOMER_ROLES.tenant.text }}
        />
      )}
      {customer.landlord && (
        <Chip
          label="임대인"
          size="small"
          sx={{ backgroundColor: CUSTOMER_ROLES.landlord.background, color: CUSTOMER_ROLES.landlord.text }}
        />
      )}
      {customer.buyer && (
        <Chip
          label="매수인"
          size="small"
          sx={{ backgroundColor: CUSTOMER_ROLES.buyer.background, color: CUSTOMER_ROLES.buyer.text }}
        />
      )}
      {customer.seller && (
        <Chip
          label="매도인"
          size="small"
          sx={{ backgroundColor: CUSTOMER_ROLES.seller.background, color: CUSTOMER_ROLES.seller.text }}
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
                  option.uid === NEW_LABEL_TEMP_UID ? INFO.light : undefined,
                borderColor:
                  option.uid === NEW_LABEL_TEMP_UID ? INFO.alt : undefined,
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
                <span>&quot;{option.name}&quot; 새 라벨 생성</span>
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
            <DoneIcon style={{ color: SUCCESS.alt }} />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onEditCancel(customer.uid);
            }}
            size="small"
            className="z-10"
          >
            <CloseIcon style={{ color: ERROR.main }} />
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
            className="z-30"
          >
            <EditIcon className="text-primary-dark" />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(customer);
            }}
            size="small"
            className="z-30"
          >
            <DeleteIcon className="text-neutral-900" />
          </IconButton>
        </>
      )}
    </Box>
  );
};
