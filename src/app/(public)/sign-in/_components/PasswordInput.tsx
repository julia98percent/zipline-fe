"use client";

import { useState, useEffect } from "react";
import TextField from "@/components/TextField";
import CapsLockWarning from "@/components/CapsLockWarning";

interface Props {
  password: string;
  handleChangePassword: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const PasswordInput = ({
  password,
  handleChangePassword,
  onKeyDown,
}: Props) => {
  const [showCapsLockWarning, setShowCapsLockWarning] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isCapsLockOn = e.getModifierState("CapsLock");
    const isEnglishLetter = /^[a-zA-Z]$/.test(e.key);

    if (isCapsLockOn && isEnglishLetter && !showCapsLockWarning) {
      setShowCapsLockWarning(true);
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  useEffect(() => {
    if (showCapsLockWarning) {
      const timer = setTimeout(() => {
        setShowCapsLockWarning(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showCapsLockWarning]);

  return (
    <div style={{ position: "relative" }}>
      <CapsLockWarning show={showCapsLockWarning} />
      <TextField
        label="비밀번호"
        type="password"
        value={password}
        onChange={handleChangePassword}
        onKeyDown={handleKeyPress}
        fullWidth
      />
    </div>
  );
};

export default PasswordInput;
