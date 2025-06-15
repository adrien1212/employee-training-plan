import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    FileSpreadsheet,
    FileText,
    Download,
    Filter,
    Calendar,
    Users,
    GraduationCap,
    Building2,
    BarChart3,
    Clock
} from "lucide-react";
import { toast } from "sonner";

const Reports = () => {
    const [reportType, setReportType] = useState("");
    const [dateRange, setDateRange] = useState(null);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedFormations, setSelectedFormations] = useState([]);
    const [includeStats, setIncludeStats] = useState(true);
    const [includeAttendance, setIncludeAttendance] = useState(true);
    const [includeFeedback, setIncludeFeedback] = useState(false);
    const [exportFormat, setExportFormat] = useState("excel");

    const reportTypes = [
        { value: "formations", label: "Rapport des formations", icon: GraduationCap },
        { value: "employees", label: "Rapport des employés", icon: Users },
        { value: "departments", label: "Rapport par département", icon: Building2 },
        { value: "attendance", label: "Rapport de présence", icon: Clock },
        { value: "statistics", label: "Rapport statistique global", icon: BarChart3 },
        { value: "budget", label: "Rapport budgétaire", icon: FileText },
    ];

    const departments = [
        "Ressources Humaines",
        "Informatique",
        "Marketing",
        "Finance",
        "Production",
        "Commercial"
    ];

    const formations = [
        "Sécurité au travail",
        "Développement web",
        "Gestion de projet",
        "Communication",
        "Leadership",
        "Excel avancé"
    ];

    const handleDepartmentChange = (dept, checked) => {
        if (checked) {
            setSelectedDepartments([...selectedDepartments, dept]);
        } else {
            setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
        }
    };

    const handleFormationChange = (formation, checked) => {
        if (checked) {
            setSelectedFormations([...selectedFormations, formation]);
        } else {
            setSelectedFormations(selectedFormations.filter(f => f !== formation));
        }
    };

    const handleExport = (format) => {
        if (!reportType) {
            toast.error("Veuillez sélectionner un type de rapport");
            return;
        }

        const formatLabel = format === "excel" ? "Excel" : "PDF";
        const reportLabel = reportTypes.find(r => r.value === reportType)?.label || "Rapport";

        toast.success(`Export ${formatLabel} en cours...`, {
            description: `Génération du ${reportLabel} au format ${formatLabel}`
        });

        // Simulation de l'export
        setTimeout(() => {
            toast.success(`${reportLabel} exporté avec succès!`, {
                description: `Le fichier ${formatLabel} a été téléchargé`
            });
        }, 2000);
    };

    const clearFilters = () => {
        setReportType("");
        setDateRange(null);
        setSelectedDepartments([]);
        setSelectedFormations([]);
        setIncludeStats(true);
        setIncludeAttendance(true);
        setIncludeFeedback(false);
        setExportFormat("excel");
        toast.info("Filtres réinitialisés");
    };

    const selectedReportType = reportTypes.find(r => r.value === reportType);

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Rapports & Exports</h1>
                    <p className="text-gray-600 mt-2">
                        Générez des rapports personnalisés et exportez-les au format Excel ou PDF
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={clearFilters}>
                        <Filter className="h-4 w-4 mr-2" />
                        Réinitialiser
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration des filtres */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Configuration du rapport
                            </CardTitle>
                            <CardDescription>
                                Sélectionnez les critères pour générer votre rapport personnalisé
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Type de rapport */}
                            <div className="space-y-2">
                                <Label htmlFor="report-type">Type de rapport *</Label>
                                <Select value={reportType} onValueChange={setReportType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un type de rapport" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {reportTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                <div className="flex items-center gap-2">
                                                    <type.icon className="h-4 w-4" />
                                                    {type.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Période */}
                            <div className="space-y-2">
                                <Label>Période</Label>
                                <DatePickerWithRange
                                    date={dateRange}
                                    onDateChange={setDateRange}
                                    placeholder="Sélectionnez une période"
                                />
                            </div>

                            {/* Départements */}
                            <div className="space-y-3">
                                <Label>Départements</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {departments.map((dept) => (
                                        <div key={dept} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={dept}
                                                checked={selectedDepartments.includes(dept)}
                                                onCheckedChange={(checked) => handleDepartmentChange(dept, checked)}
                                            />
                                            <Label htmlFor={dept} className="text-sm font-normal cursor-pointer">
                                                {dept}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Formations */}
                            <div className="space-y-3">
                                <Label>Formations spécifiques</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {formations.map((formation) => (
                                        <div key={formation} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={formation}
                                                checked={selectedFormations.includes(formation)}
                                                onCheckedChange={(checked) => handleFormationChange(formation, checked)}
                                            />
                                            <Label htmlFor={formation} className="text-sm font-normal cursor-pointer">
                                                {formation}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Options d'inclusion */}
                            <div className="space-y-3">
                                <Label>Données à inclure</Label>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="stats"
                                            checked={includeStats}
                                            onCheckedChange={setIncludeStats}
                                        />
                                        <Label htmlFor="stats" className="text-sm font-normal cursor-pointer">
                                            Statistiques et métriques
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="attendance"
                                            checked={includeAttendance}
                                            onCheckedChange={setIncludeAttendance}
                                        />
                                        <Label htmlFor="attendance" className="text-sm font-normal cursor-pointer">
                                            Données de présence
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="feedback"
                                            checked={includeFeedback}
                                            onCheckedChange={setIncludeFeedback}
                                        />
                                        <Label htmlFor="feedback" className="text-sm font-normal cursor-pointer">
                                            Commentaires et évaluations
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Aperçu et export */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Aperçu du rapport
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {selectedReportType ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <selectedReportType.icon className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">{selectedReportType.label}</span>
                                    </div>

                                    {dateRange && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>Période sélectionnée</span>
                                        </div>
                                    )}

                                    {selectedDepartments.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium mb-1">Départements :</p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedDepartments.map((dept) => (
                                                    <Badge key={dept} variant="secondary" className="text-xs">
                                                        {dept}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedFormations.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium mb-1">Formations :</p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedFormations.map((formation) => (
                                                    <Badge key={formation} variant="outline" className="text-xs">
                                                        {formation}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-sm text-gray-600">
                                        <p>Données incluses :</p>
                                        <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                                            {includeStats && <li>Statistiques et métriques</li>}
                                            {includeAttendance && <li>Données de présence</li>}
                                            {includeFeedback && <li>Commentaires et évaluations</li>}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Sélectionnez un type de rapport pour voir l'aperçu
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                Export
                            </CardTitle>
                            <CardDescription>
                                Choisissez le format d'export et téléchargez votre rapport
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Format d'export</Label>
                                <Select value={exportFormat} onValueChange={setExportFormat}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="excel">
                                            <div className="flex items-center gap-2">
                                                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                                Excel (.xlsx)
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="pdf">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-red-600" />
                                                PDF (.pdf)
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={() => handleExport(exportFormat)}
                                    disabled={!reportType}
                                    className="w-full"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Exporter en {exportFormat === "excel" ? "Excel" : "PDF"}
                                </Button>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport("excel")}
                                        disabled={!reportType}
                                        className="flex-1"
                                    >
                                        <FileSpreadsheet className="h-4 w-4 mr-1" />
                                        Excel
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport("pdf")}
                                        disabled={!reportType}
                                        className="flex-1"
                                    >
                                        <FileText className="h-4 w-4 mr-1" />
                                        PDF
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Reports;
