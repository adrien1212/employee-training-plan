import { Box, Heading, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import api from "../service/api";

interface Props {
  companyId: number;
}

const CreateDepartments: React.FC<Props> = ({ companyId }) => {
  const [departments, setDepartments] = useState<string[]>(['']);

  const handleAdd = () => setDepartments([...departments, '']);
  const handleChange = (index: number, value: string) => {
    const updated = [...departments];
    updated[index] = value;
    setDepartments(updated);
  };

  const handleSubmit = async () => {
    await Promise.all(departments.map(name =>
      api.post("/departments", { name, companyId })
    ));
    alert("Departments created!");
  };

  return (
    <Box p={4}>
      <Heading size="md">Create Departments</Heading>
      {departments.map((name, index) => (
        <Input
          key={index}
          placeholder={`Department ${index + 1}`}
          value={name}
          onChange={(e) => handleChange(index, e.target.value)}
          my={2}
        />
      ))}
      <Button onClick={handleAdd} mt={2} colorScheme="blue">Add More</Button>
      <Button onClick={handleSubmit} mt={2} colorScheme="teal" ml={2}>Submit</Button>
    </Box>
  );
};

export default CreateDepartments