export { default } from "./Select";
export type { SelectProps } from "./Select";

export { default as FormControl } from "./FormControl";
export type { FormControlProps } from "./FormControl";

export { default as InputLabel } from "./InputLabel";
export type { InputLabelProps } from "./InputLabel";

export { default as MenuItem } from "./MenuItem";
export type { MenuItemProps } from "./MenuItem";

// 타입 특화 Select
import Select from "./Select";

export const StringSelect = Select<string>;
export const NumberSelect = Select<number>;
export const BooleanSelect = Select<boolean>;
export const StringNumberSelect = Select<string | number>;
export const StringBooleanSelect = Select<string | boolean>;
export const NumberBooleanSelect = Select<number | boolean>;
export const AllTypesSelect = Select<string | number | boolean>;
