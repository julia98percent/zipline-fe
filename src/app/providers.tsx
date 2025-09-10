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

const theme = createTheme({
  palette: {
    primary: {
      main: "#164F9E",
    },
    secondary: {
      main: "#2E5D9F",
    },
    info: {
      main: "#525252",
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
