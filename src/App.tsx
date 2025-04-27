import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/layout/PrivateRoute";
import GuestRoute from "./components/layout/GuestRoute";
import SignUpPage from "@pages/SignUpPage";
import SignInPage from "@pages/SignInPage";
// import DashboardPage from "@pages/DashboardPage";
import CustomerListPage from "@pages/CustomerListPage";
import PrivatePropertyListPage from "@pages/PrivatePropertyListPage";
import MyPage from "@pages/MyPage";
import EditSurveyPage from "@pages/MyPage/EditSurveyPage";
import SubmitSurveyPage from "@pages/SubmitSurveyPage";
import SubmitSurveySuccessPage from "@pages/SubmitSurveySuccessPage";
import NewbieSurveyRoute from "@components/layout/NewbieSurveyRoute";
import ErrorPage from "@pages/ErrorPage";
import ContractListPage from "@pages/ContractListPage/ContractListPage";
import PublicPropertyListPage from "@pages/PublicPropertyListPage";
import CustomerDetailPage from "@pages/CustomerDetailPage";
import BulkMessagePage from "@pages/BulkMessagePage";

const App = () => {
  return (
    <Routes>
      <Route path="form" element={<Navigate to="/error" replace />} />
      <Route path="form/:surveyId" element={<NewbieSurveyRoute />}>
        <Route index element={<SubmitSurveyPage />} />
        <Route path="thank-you" element={<SubmitSurveySuccessPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route index element={<Navigate to="/properties/private" replace />} />
        <Route path="customers" element={<CustomerListPage />} />
        <Route path="customers/:customerId" element={<CustomerDetailPage />} />

        <Route
          path="properties/private"
          element={<PrivatePropertyListPage />}
        />
        <Route path="properties/public" element={<PublicPropertyListPage />} />
        <Route path="messages/bulk" element={<BulkMessagePage />} />
        <Route path="/contracts" element={<ContractListPage />} />
        <Route path="my">
          <Route index element={<MyPage />} />
          <Route path="edit-survey" element={<EditSurveyPage />} />
        </Route>
      </Route>

      <Route element={<GuestRoute />}>
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="sign-in" element={<SignInPage />} />
      </Route>

      <Route path="error" element={<ErrorPage />} />
    </Routes>
  );
};

export default App;
