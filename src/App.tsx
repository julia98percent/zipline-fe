import { Routes, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./store";
import PrivateRoute from "./components/layout/PrivateRoute";
import GuestRoute from "./components/layout/GuestRoute";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import HomePage from "@pages/HomePage";

const App = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        {/* 로그인 해야 진입 가능한 페이지 */}
        <Route index element={<HomePage />} />
      </Route>

      <Route element={<GuestRoute />}>
        <Route path="sign-up" element={<SignUpPage />} />
      </Route>
    </Routes>
  );
};

export default App;
