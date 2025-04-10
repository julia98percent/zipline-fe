import { Outlet, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const NewbieSurveyRoute = () => {
  const { surveyId } = useParams();
  const isValidSurvey = Boolean(surveyId);

  if (!isValidSurvey) {
    return <Navigate to="/error" replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default NewbieSurveyRoute;
