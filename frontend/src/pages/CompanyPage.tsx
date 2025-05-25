import { useNavigate } from 'react-router-dom';
import CreateCompany from '../components/CreateCompany';

const CompanyPage = () => {
  const navigate = useNavigate();

  const handleCompanyCreated = (companyId: number) => {
    navigate(`/departments/${companyId}`);
  };

  return <CreateCompany onCreated={handleCompanyCreated} />;
};

export default CompanyPage;
