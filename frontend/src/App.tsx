import './App.css'
import { Route, Routes } from 'react-router-dom';
import CompanyPage from './pages/CompanyPage';
import DepartmentPage from './pages/DepartmentPage';
import EmployeePage from './pages/EmployeePage';
import Layout from './components/Layout';
import EmployeeListPage from './pages/EmployeeListPage';
import TrainingPage from './pages/TrainingPage';
import SessionPage from './pages/SessionPage';
import TrainingListPage from './pages/TrainingListPage';
import ListSessionPage from './pages/ListSessionPage';
import TrainingDetailPage from './pages/TrainingDetailPage';
import DepartmentListPage from './pages/DepartmentListPage';
import PrivateRoutes from './components/PrivateRoute';
import EmployeeDetail from './components/EmployeeDetail';
import DashboardPage from './pages/DashboardPage';
import SessionEmployeePage from './pages/SessionEmployeePage';
import DepartmentDetail from './components/DepartmentDetail';
import CreateDepartmentPage from './pages/CreateDepartmentPage';


function App() {
  return (
    <Layout>
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<CompanyPage />} />

      {/* Private Routes */}
      <Route element={<PrivateRoutes />}>
        <Route path="/departments" element={<DepartmentListPage />} />
        <Route path="/departments/:id" element={<DepartmentPage />} />
        <Route path="/departments/new" element={<CreateDepartmentPage />} />
        <Route path="/departments/:id" element={<DepartmentDetail />} />
        <Route path="/employees/new" element={<EmployeePage />} />
        <Route path="/employees" element={<EmployeeListPage />} />
        <Route path="/employees/:id" element={<EmployeeDetail />} />
        <Route path="/trainings/new" element={<TrainingPage />} />
        <Route path="/trainings" element={<TrainingListPage />} />
        <Route path="/trainings/:trainingId/sessions/new" element={<SessionPage />} />
        <Route path="/trainings/:trainingId/employee/new" element={<SessionEmployeePage />} />
        <Route path="/trainings/:id" element={<TrainingDetailPage />} />
        <Route path="/sessions/subscribe" element={<ListSessionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

    </Routes>
  </Layout>
  );
}
export default App
