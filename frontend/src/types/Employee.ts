import { Department } from "./Department";

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  codeEmployee: string
}