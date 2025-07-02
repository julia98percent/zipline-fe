import { CounselCategory } from "@ts/counsel";
import styles from "../styles/CounselListPage.module.css";

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
        <button
          key={type.value}
          className={`${styles.filterButton} ${
            selectedType === type.value ? styles.filterButtonActive : ""
          }`}
          onClick={() => {
            onTypeChange(selectedType === type.value ? null : type.value);
          }}
        >
          {type.label}
        </button>
      ))}
      <span className={styles.filterDivider}>|</span>
      <button
        className={`${styles.filterButton} ${
          selectedCompleted === false ? styles.filterButtonActive : ""
        }`}
        onClick={() => {
          onCompletedChange(selectedCompleted === false ? null : false);
        }}
      >
        의뢰 진행중
      </button>
      <button
        className={`${styles.filterButton} ${
          selectedCompleted === true ? styles.filterButtonActive : ""
        }`}
        onClick={() => {
          onCompletedChange(selectedCompleted === true ? null : true);
        }}
      >
        의뢰 마감
      </button>
    </div>
  );
};

export default CounselTypeFilters;
