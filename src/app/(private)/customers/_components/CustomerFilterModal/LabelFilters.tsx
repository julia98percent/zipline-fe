import { Chip } from "@mui/material";
import { Label, CustomerBaseFilter } from "@/types/customer";
import { INFO, NEUTRAL } from "@/constants/colors";

interface Props {
  setFiltersTemp: (
    filters:
      | CustomerBaseFilter
      | ((prev: CustomerBaseFilter) => CustomerBaseFilter)
  ) => void;
  labels: Label[];
  selectedLabels: Label[];
  setSelectedLabels: (labels: Label[]) => void;
}

const LabelFilters = ({
  setFiltersTemp,
  labels,
  selectedLabels,
  setSelectedLabels,
}: Props) => {
  const handleLabelSelect = (label: { uid: number; name: string }) => {
    const isSelected = selectedLabels.some((l) => l.uid === label.uid);
    let newSelectedLabels: typeof selectedLabels;

    if (isSelected) {
      newSelectedLabels = selectedLabels.filter((l) => l.uid !== label.uid);
    } else {
      newSelectedLabels = [...selectedLabels, label];
    }

    setSelectedLabels(newSelectedLabels);
    setFiltersTemp((prev) => ({
      ...prev,
      labelUids: newSelectedLabels.map((l) => l.uid),
    }));
  };

  return (
    <div className="p-5 card">
      <h5 className="text-lg font-bold mb-4">라벨</h5>
      {labels.length ? (
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <Chip
              key={label.uid}
              label={label.name}
              clickable
              variant={
                selectedLabels.some((l) => l.uid === label.uid)
                  ? "filled"
                  : "outlined"
              }
              onClick={() => handleLabelSelect(label)}
              sx={{
                backgroundColor: selectedLabels.some((l) => l.uid === label.uid)
                  ? INFO.main
                  : "transparent",
                color: selectedLabels.some((l) => l.uid === label.uid)
                  ? "white"
                  : "inherit",
                "&:hover": {
                  backgroundColor: selectedLabels.some(
                    (l) => l.uid === label.uid
                  )
                    ? INFO.dark
                    : NEUTRAL[100],
                },
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default LabelFilters;
