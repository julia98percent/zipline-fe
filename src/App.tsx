import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/layout/PrivateRoute";
import GuestRoute from "./components/layout/GuestRoute";
import SignUpPage from "@pages/SignUpPage";
import SignInPage from "@pages/SignInPage";
import DashboardPage from "@pages/DashboardPage";

const App = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route index element={<DashboardPage />} />
      </Route>

      <Route element={<GuestRoute />}>
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="sign-in" element={<SignInPage />} />
      </Route>
    </Routes>
  );
};

export default App;
