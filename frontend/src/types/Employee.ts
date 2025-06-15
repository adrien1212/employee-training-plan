import { Department } from "./Department";

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  codeEmployee: string
}