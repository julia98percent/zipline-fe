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
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Chip
          label="임차인"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEditChange(customer.uid, "tenant", !editingCustomer.tenant);
          }}
          sx={{
            backgroundColor: editingCustomer.tenant ? "#FCE8D4" : "#F5F5F5",
            color: editingCustomer.tenant ? "#E67E00" : "#757575",
            cursor: "pointer",
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
          sx={{
            backgroundColor: editingCustomer.landlord ? "#FCDADA" : "#F5F5F5",
            color: editingCustomer.landlord ? "#D63939" : "#757575",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: editingCustomer.landlord ? "#FCDADA" : "#E0E0E0",
            },
          }}
        />
        <Chip
          label="매수자"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEditChange(customer.uid, "buyer", !editingCustomer.buyer);
          }}
          sx={{
            backgroundColor: editingCustomer.buyer ? "#D4EDDC" : "#F5F5F5",
            color: editingCustomer.buyer ? "#0E8A3E" : "#757575",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: editingCustomer.buyer ? "#D4EDDC" : "#E0E0E0",
            },
          }}
        />
        <Chip
          label="매도자"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEditChange(customer.uid, "seller", !editingCustomer.seller);
          }}
          sx={{
            backgroundColor: editingCustomer.seller ? "#D6E6F9" : "#F5F5F5",
            color: editingCustomer.seller ? "#1B64C2" : "#757575",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: editingCustomer.seller ? "#D6E6F9" : "#E0E0E0",
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {customer.tenant && (
        <Chip
          label="임차인"
          size="small"
          sx={{ backgroundColor: "#FEF5EB", color: "#F2994A" }}
        />
      )}
      {customer.landlord && (
        <Chip
          label="임대인"
          size="small"
          sx={{ backgroundColor: "#FDEEEE", color: "#EB5757" }}
        />
      )}
      {customer.buyer && (
        <Chip
          label="매수자"
          size="small"
          sx={{ backgroundColor: "#E9F7EF", color: "#219653" }}
        />
      )}
      {customer.seller && (
        <Chip
          label="매도자"
          size="small"
          sx={{ backgroundColor: "#EBF2FC", color: "#2F80ED" }}
        />
      )}
      {!customer.tenant &&
        !customer.landlord &&
        !customer.buyer &&
        !customer.seller && (
          <Chip
            label="없음"
            size="small"
            sx={{ backgroundColor: "#F5F5F5", color: "#757575" }}
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
  onCreateLabel?: (name: string) => Promise<void>
) => {
  const editingCustomer = editingCustomers[customer.uid];

  if (editingCustomer?.isEditing) {
    return (
      <Autocomplete
        multiple
        freeSolo
        size="small"
        options={availableLabels}
        getOptionLabel={(option) => {
          return typeof option === "string" ? option : option.name;
        }}
        value={editingCustomer.labels || []}
        onChange={async (_, newValue) => {
          const processedLabels: Label[] = [];

          for (const value of newValue) {
            if (typeof value === "object" && value.uid === NEW_LABEL_TEMP_UID) {
              if (onCreateLabel && value.name.trim()) {
                try {
                  await onCreateLabel(value.name.trim());
                  // 새로 생성된 라벨은 임시 uid로 추가
                  processedLabels.push({
                    uid: Date.now() + Math.random(),
                    name: value.name.trim(),
                  });
                } catch (error) {
                  console.error("라벨 생성 실패:", error);
                }
              }
            } else if (typeof value === "object") {
              processedLabels.push(value);
            }
          }

          onEditChange(customer.uid, "labels", processedLabels);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="라벨 선택 또는 새 라벨 입력"
            FormHelperTextProps={{
              sx: { fontSize: "0.7rem", margin: 0, padding: 0 },
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
                backgroundColor: option.uid === NEW_LABEL_TEMP_UID ? "#e3f2fd" : undefined,
                borderColor: option.uid === NEW_LABEL_TEMP_UID ? "#2196f3" : undefined,
              }}
            />
          ))
        }
        isOptionEqualToValue={(option, value) => {
          return option.uid === value.uid;
        }}
        filterOptions={(options, params) => {
          const filtered = options.filter((option) =>
            option.name.toLowerCase().includes(params.inputValue.toLowerCase())
          );

          const { inputValue } = params;
          const isExisting = options.some(
            (option) => option.name.toLowerCase() === inputValue.toLowerCase()
          );

          if (inputValue !== "" && !isExisting) {
            return [...filtered, { uid: NEW_LABEL_TEMP_UID, name: inputValue } as Label];
          }
          return filtered;
        }}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.uid === NEW_LABEL_TEMP_UID ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {customer.labels && customer.labels.length > 0 ? (
        customer.labels.map((label) => (
          <Chip
            key={label.uid}
            label={label.name}
            size="small"
            variant="outlined"
          />
        ))
      ) : (
        <Chip
          label="없음"
          size="small"
          sx={{ backgroundColor: "#F5F5F5", color: "#757575" }}
        />
      )}
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
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
      {editingCustomer?.isEditing ? (
        <>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onEditSave(customer.uid);
            }}
            size="small"
            sx={{ zIndex: 10 }}
          >
            <DoneIcon sx={{ color: "#219653" }} />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onEditCancel(customer.uid);
            }}
            size="small"
            sx={{ zIndex: 10 }}
          >
            <CloseIcon sx={{ color: "#EB5757" }} />
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
            sx={{ zIndex: 100 }}
          >
            <EditIcon sx={{ color: "#164F9E" }} />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(customer);
            }}
            size="small"
            sx={{ zIndex: 100 }}
          >
            <DeleteIcon sx={{ color: "#E53535" }} />
          </IconButton>
        </>
      )}
    </Box>
  );
};
