import { CounselCategory } from "@ts/counsel";
import styles from "../styles/CounselListPage.module.css";
import Button from "@components/Button";

interface Props {
  selectedType: string | null;
  selectedCompleted: boolean | null;
  onTypeChange: (type: string | null) => void;
  onCompletedChange: (completed: boolean | null) => void;
}

const COUNSEL_TYPES = Object.entries(CounselCategory).map(([value, label]) => ({
  value,
  label,
}));

const CounselTypeFilters = ({
  selectedType,
  selectedCompleted,
  onTypeChange,
  onCompletedChange,
}: Props) => {
  return (
    <div className={styles.typeFilterRow}>
      {COUNSEL_TYPES.map((type) => (
        <Button
          key={type.value}
          variant="text"
          className={`${styles.filterButton} ${
            selectedType === type.value ? styles.filterButtonActive : ""
          }`}
          onClick={() => {
            onTypeChange(selectedType === type.value ? null : type.value);
          }}
        >
          {type.label}
        </Button>
      ))}
      <span className={styles.filterDivider}>|</span>
      <Button
        variant="text"
        className={`${styles.filterButton} ${
          selectedCompleted === false ? styles.filterButtonActive : ""
        }`}
        onClick={() => {
          onCompletedChange(selectedCompleted === false ? null : false);
        }}
      >
        의뢰 진행중
      </Button>
      <Button
        variant="text"
        className={`${styles.filterButton} ${
          selectedCompleted === true ? styles.filterButtonActive : ""
        }`}
        onClick={() => {
          onCompletedChange(selectedCompleted === true ? null : true);
        }}
      >
        의뢰 마감
      </Button>
    </div>
  );
};

export default CounselTypeFilters;
