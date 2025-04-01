
import React, { useState } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Download } from "lucide-react";

const ExportSettings: React.FC = () => {
  const { tasks } = useTasks();
  const [exportFormat, setExportFormat] = useState("pdf");

  const handleExportData = () => {
    // In a real app, this would generate and download the file
    // For this demo, we'll just show a toast message
    toast.success(`Données exportées en format ${exportFormat.toUpperCase()} !`, {
      description: "Le fichier a été téléchargé avec succès."
    });

    // For demonstration, let's convert tasks to JSON
    const jsonData = JSON.stringify(tasks, null, 2);
    console.log("Exported data:", jsonData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exporter vos données</CardTitle>
        <CardDescription>
          Téléchargez vos tâches et informations dans différents formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="export-format">Format d'exportation</Label>
          <Select
            value={exportFormat}
            onValueChange={setExportFormat}
          >
            <SelectTrigger id="export-format">
              <SelectValue placeholder="Sélectionnez un format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Options d'exportation</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include-completed"
                className="rounded border-gray-300"
                defaultChecked
              />
              <Label htmlFor="include-completed">Inclure les tâches terminées</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include-details"
                className="rounded border-gray-300"
                defaultChecked
              />
              <Label htmlFor="include-details">Inclure les détails des tâches</Label>
            </div>
          </div>
        </div>

        <Button onClick={handleExportData} className="mt-4">
          <Download size={16} className="mr-2" />
          Exporter {tasks.length} tâches
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportSettings;
