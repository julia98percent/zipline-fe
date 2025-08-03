import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import App from "./App.tsx";
import "./main.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { koKR } from "@mui/x-date-pickers/locales";

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

createRoot(document.getElementById("root")!).render(
  <LocalizationProvider
    dateAdapter={AdapterDayjs}
    localeText={koKR.components.MuiLocalizationProvider.defaultProps.localeText}
  >
    <StyledEngineProvider enableCssLayer>
      <ThemeProvider theme={theme}>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  </LocalizationProvider>
);
