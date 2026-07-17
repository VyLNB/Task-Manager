import FeatureUnderDevelopment from "../../components/common/FeatureUnderDevelopment";
import AdminDashboard from "./admin/AdminDashboard";
import PMDashboard from "./pm/PMDashboard";
import { usePermission } from "../../hooks/usePermission";

const Dashboard = () => {
    const { isAdmin, isProjectManager } = usePermission();

    if (isAdmin) {
        return <AdminDashboard />;
    }

    if (isProjectManager) {
        return <PMDashboard />;
    }

    return <FeatureUnderDevelopment />;
}

export default Dashboard;