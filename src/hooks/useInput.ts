import { useState } from "react";

const useInput = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return [value, handleChange, setValue];
};

export default useInput;
