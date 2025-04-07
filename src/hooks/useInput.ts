import { useState } from "react";

const useInput = <T>(initialValue: T) => {
  const [value, setValue] = useState(<T>initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as T);
  };

  return [value, handleChange, setValue] as const;
};

export default useInput;
