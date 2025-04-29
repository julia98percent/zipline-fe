import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/layout/PrivateRoute";
import GuestRoute from "./components/layout/GuestRoute";
import SignUpPage from "@pages/SignUpPage";
import SignInPage from "@pages/SignInPage";
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
import DashboardPage from "@pages/DashboardPage";
import SchedulePage from "@pages/SchedulePage";
import MessageTemplatePage from "@pages/MessageTemplatePage";
import MessageHistoryPage from "@pages/MessageHistoryPage";
import AgentPropertyDetailPage from "@pages/PrivatePropertyListPage/AgentPropertyDetailPage";
import CounselListPage from "@pages/CounselListPage";
import ContractDetailPage from "@pages/ContractDetailPage";
import CounselDetailPage from "@pages/CounselDetailPage";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="form" element={<Navigate to="/error" replace />} />
        <Route path=":surveyId" element={<NewbieSurveyRoute />}>
          <Route index element={<SubmitSurveyPage />} />
          <Route path="thank-you" element={<SubmitSurveySuccessPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path="customers" element={<CustomerListPage />} />
          <Route
            path="customers/:customerId"
            element={<CustomerDetailPage />}
          />

          <Route
            path="properties/private"
            element={<PrivatePropertyListPage />}
          />
          <Route
            path="/properties/:propertyUid"
            element={<AgentPropertyDetailPage />}
          />
          <Route
            path="properties/public"
            element={<PublicPropertyListPage />}
          />
          <Route path="messages/templates" element={<MessageTemplatePage />} />
          <Route path="messages/bulk" element={<BulkMessagePage />} />
          <Route path="messages/history" element={<MessageHistoryPage />} />
          <Route path="counsels" element={<CounselListPage />} />
          <Route path="/counsels/:counselUid" element={<CounselDetailPage />} />
          <Route path="/contracts" element={<ContractListPage />} />
          <Route
            path="/contracts/:contractUid"
            element={<ContractDetailPage />}
          />
          <Route path="my">
            <Route index element={<MyPage />} />
            <Route path="edit-survey" element={<EditSurveyPage />} />
          </Route>

          <Route path="schedules" element={<SchedulePage />} />
          <Route path="templates" element={<MessageTemplatePage />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="sign-in" element={<SignInPage />} />
        </Route>

        <Route path="error" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default App;
