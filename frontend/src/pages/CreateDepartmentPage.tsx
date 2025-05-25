import { useParams } from 'react-router-dom';
import CreateDepartments from '../components/CreateDeparment';

const CreateDepartmentPage = () => {
  const { companyId } = useParams();

  return (
    <CreateDepartments companyId={Number(companyId)} />
  );
};

export default CreateDepartmentPage;