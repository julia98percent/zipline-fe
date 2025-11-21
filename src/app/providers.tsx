"use client";

import { useState, useEffect } from "react";
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { koKR } from "@mui/x-date-pickers/locales";
import ToastProvider from "@/components/Toast";
import {
  PRIMARY,
  SECONDARY,
  SUCCESS,
  WARNING,
  ERROR,
  INFO,
  TEXT,
  BACKGROUND,
} from "@/constants/colors";

const theme = createTheme({
  palette: {
    primary: {
      light: PRIMARY.light,
      main: PRIMARY.main,
      dark: PRIMARY.dark,
    },
    secondary: {
      main: SECONDARY.main,
    },
    success: {
      light: SUCCESS.light,
      main: SUCCESS.main,
      dark: SUCCESS.dark,
    },
    warning: {
      light: WARNING.light,
      main: WARNING.main,
      dark: WARNING.dark,
    },
    error: {
      light: ERROR.light,
      main: ERROR.main,
      dark: ERROR.dark,
    },
    info: {
      light: INFO.light,
      main: INFO.main,
      dark: INFO.dark,
    },
    text: {
      primary: TEXT.primary,
      secondary: TEXT.secondary,
      disabled: TEXT.disabled,
    },
    background: {
      default: BACKGROUND.default,
      paper: BACKGROUND.paper,
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={
        koKR.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <StyledEngineProvider enableCssLayer>
        <ThemeProvider theme={theme}>
          <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
          <ToastProvider />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </LocalizationProvider>
  );
}
