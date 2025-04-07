import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/layout/PrivateRoute";
import GuestRoute from "./components/layout/GuestRoute";
import SignUpPage from "@pages/SignUpPage";
import SignInPage from "@pages/SignInPage";
import DashboardPage from "@pages/DashboardPage";
import CustomerListPage from "@pages/CustomerListPage";
import PrivatePropertyListPage from "@pages/PrivatePropertyListPage";
import MyPage from "@pages/MyPage";

const App = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route index element={<DashboardPage />} />
        <Route path="customers" element={<CustomerListPage />} />
        <Route index element={<DashboardPage />} />
        <Route
          path="properties/private"
          element={<PrivatePropertyListPage />}
        />
        <Route path="my">
          <Route index element={<MyPage />} />
        </Route>
      </Route>

      <Route element={<GuestRoute />}>
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="sign-in" element={<SignInPage />} />
      </Route>
    </Routes>
  );
};

export default App;
