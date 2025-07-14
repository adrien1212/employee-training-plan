import { Building2, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Department } from "@/types/Department";
import { useCountEmployees, useEmployee } from "@/hooks/useEmployees";

interface DepartmentCardProps {
    department: Department;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ department }) => {
    const navigate = useNavigate();

    const {
        data: employeeNumber,
        isLoading: isEmployeeNumberLoading,
        isError: isEmployeeNumberError
    } = useCountEmployees({ departmentId: department.id })

    if (isEmployeeNumberLoading) return <div className="p-4 text-center text-gray-500">Chargement…</div>;
    if (isEmployeeNumberError) return <div className="p-4 text-center text-red-500">Erreur</div>;

    console.log(employeeNumber)

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <CardTitle
                            className="text-lg cursor-pointer hover:text-blue-600"
                            onClick={() => navigate(`/departments/${department.id}`)}
                        >
                            {department.name}
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Employés</span>
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {employeeNumber}
                        </Badge>
                    </div>
                    <div className="pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/departments/${department.id}`)}
                            className="w-full"
                        >
                            Voir les détails
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};