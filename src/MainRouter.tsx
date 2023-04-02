import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/public/Dashboard";
import DetailPage from "./pages/main/Detail";

function MainRouter() {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/activity-detail/:activityID" element={<DetailPage />} />
        </Routes>
    );
}

export default MainRouter;
