import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/public/Dashboard";

function MainRouter() {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
        </Routes>
    );
}

export default MainRouter;
