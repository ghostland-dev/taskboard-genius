
import React, { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks, Task, TaskCategory, TaskPriority } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, CalendarPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const { tasks, createTask } = useTasks();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Filtrage
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority[]>([]);
  
  // Form state pour la création de tâche
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: TaskPriority;
    category: TaskCategory;
    status: "todo";
    dueDate: string;
  }>({
    title: "",
    description: "",
    priority: "medium",
    category: "work",
    status: "todo",
    dueDate: date ? format(date, "yyyy-MM-dd") : "",
  });

  // Update form due date when selected date changes
  React.useEffect(() => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dueDate: format(date, "yyyy-MM-dd"),
      }));
    }
  }, [date]);

  // Filter tasks with due dates
  const tasksWithDueDate = tasks.filter(
    (task) => task.dueDate !== undefined
  );

  // Apply filters if any
  const filteredTasks = tasksWithDueDate.filter(task => {
    // Apply category filter if set
    if (categoryFilter.length > 0 && !categoryFilter.includes(task.category)) {
      return false;
    }
    
    // Apply priority filter if set
    if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority)) {
      return false;
    }
    
    return true;
  });

  // Group tasks by date
  const tasksByDate: Record<string, Task[]> = {};
  filteredTasks.forEach((task) => {
    if (task.dueDate) {
      const dateStr = format(new Date(task.dueDate), "yyyy-MM-dd");
      if (!tasksByDate[dateStr]) {
        tasksByDate[dateStr] = [];
      }
      tasksByDate[dateStr].push(task);
    }
  });

  // Get tasks for selected date
  const selectedDateStr = date ? format(date, "yyyy-MM-dd") : "";
  const selectedDateTasks = tasksByDate[selectedDateStr] || [];

  // Function to determine if a date has tasks
  const hasTaskOnDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return tasksByDate[dateStr] !== undefined;
  };

  // Fonction pour déterminer la couleur du marqueur en fonction des tâches sur cette date
  const getDateHighlightInfo = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayTasks = tasksByDate[dateStr];
    
    if (!dayTasks || dayTasks.length === 0) return null;
    
    // Vérifier si la date contient une tâche de haute priorité
    if (dayTasks.some(task => task.priority === "high")) {
      return "high";
    }
    
    // Si pas de haute priorité, vérifier pour priorité moyenne
    if (dayTasks.some(task => task.priority === "medium")) {
      return "medium";
    }
    
    // Sinon, c'est une tâche de faible priorité
    return "low";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority as TaskPriority,
      category: formData.category as TaskCategory,
      status: "todo" as const,
      dueDate: new Date(formData.dueDate),
      repeats: "none" as const,
    };
    
    createTask(taskData);
    setShowCreateDialog(false);
    resetForm();
    toast.success("Tâche créée avec succès !");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      category: "work",
      status: "todo",
      dueDate: date ? format(date, "yyyy-MM-dd") : "",
    });
  };

  const toggleCategoryFilter = (category: TaskCategory) => {
    setCategoryFilter(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const togglePriorityFilter = (priority: TaskPriority) => {
    setPriorityFilter(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const clearFilters = () => {
    setCategoryFilter([]);
    setPriorityFilter([]);
    toast.info("Filtres réinitialisés");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Calendrier</h1>
          <p className="text-muted-foreground">Visualisez vos tâches par date</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter size={16} />
                Filtrer
                {(categoryFilter.length > 0 || priorityFilter.length > 0) && (
                  <Badge variant="secondary" className="ml-1">
                    {categoryFilter.length + priorityFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrer par catégorie</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={categoryFilter.includes("work")}
                onCheckedChange={() => toggleCategoryFilter("work")}
              >
                Travail
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={categoryFilter.includes("health")}
                onCheckedChange={() => toggleCategoryFilter("health")}
              >
                Santé
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={categoryFilter.includes("legal")}
                onCheckedChange={() => toggleCategoryFilter("legal")}
              >
                Légal
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={categoryFilter.includes("school")}
                onCheckedChange={() => toggleCategoryFilter("school")}
              >
                École
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={categoryFilter.includes("personal")}
                onCheckedChange={() => toggleCategoryFilter("personal")}
              >
                Personnel
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filtrer par priorité</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes("high")}
                onCheckedChange={() => togglePriorityFilter("high")}
              >
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                  Haute
                </span>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes("medium")}
                onCheckedChange={() => togglePriorityFilter("medium")}
              >
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                  Moyenne
                </span>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes("low")}
                onCheckedChange={() => togglePriorityFilter("low")}
              >
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                  Basse
                </span>
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearFilters}>
                Réinitialiser les filtres
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-brand-500 hover:bg-brand-600">
                <PlusCircle size={16} className="mr-2" />
                Nouvelle tâche
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle tâche</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Titre de la tâche"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description de la tâche (optionnel)"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Santé</SelectItem>
                        <SelectItem value="work">Travail</SelectItem>
                        <SelectItem value="school">Scolaire</SelectItem>
                        <SelectItem value="legal">Légal</SelectItem>
                        <SelectItem value="personal">Personnel</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priorité</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleSelectChange("priority", value as TaskPriority)}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Sélectionner une priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Date d'échéance</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setShowCreateDialog(false);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-brand-500 hover:bg-brand-600">
                    Créer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Date</CardTitle>
            <CardDescription>
              {filteredTasks.length} tâches au total
              {(categoryFilter.length > 0 || priorityFilter.length > 0) && " (filtrées)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={fr}
              modifiers={{
                hasTasks: hasTaskOnDate,
                highPriority: (date) => getDateHighlightInfo(date) === "high",
                mediumPriority: (date) => getDateHighlightInfo(date) === "medium",
                lowPriority: (date) => getDateHighlightInfo(date) === "low"
              }}
              modifiersStyles={{
                hasTasks: {
                  fontWeight: "bold"
                },
                highPriority: {
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderBottom: "2px solid rgb(239, 68, 68)"
                },
                mediumPriority: {
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  borderBottom: "2px solid rgb(245, 158, 11)"
                },
                lowPriority: {
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderBottom: "2px solid rgb(59, 130, 246)"
                }
              }}
              className="p-0 pointer-events-auto"
            />
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                Haute
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
                Moyenne
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
                Basse
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {date
                  ? `Tâches pour le ${format(date, "d MMMM yyyy", {
                      locale: fr,
                    })}`
                  : "Sélectionnez une date"}
              </CardTitle>
              <CardDescription>
                {selectedDateTasks.length} tâche{selectedDateTasks.length > 1 ? "s" : ""}
              </CardDescription>
            </div>
            {date && (
              <Button
                variant="outline"
                className="gap-1"
                onClick={() => {
                  setFormData({
                    ...formData,
                    dueDate: format(date, "yyyy-MM-dd")
                  });
                  setShowCreateDialog(true);
                }}
              >
                <CalendarPlus size={16} className="mr-1" />
                Ajouter
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length > 0 ? (
              <div className="space-y-4">
                {selectedDateTasks.map((task) => (
                  <Card key={task.id} className="overflow-hidden">
                    <div
                      className={`h-2 ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <CardContent className="p-4">
                      <h3 className="font-medium">{task.title}</h3>
                      {task.description && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center mt-2 gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : task.status === "inprogress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {task.status === "completed"
                            ? "Terminé"
                            : task.status === "inprogress"
                            ? "En cours"
                            : "À faire"}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs ${
                            task.category === "work"
                              ? "bg-purple-100 text-purple-800"
                              : task.category === "health"
                              ? "bg-green-100 text-green-800"
                              : task.category === "legal"
                              ? "bg-red-100 text-red-800"
                              : task.category === "school"
                              ? "bg-blue-100 text-blue-800"
                              : task.category === "personal"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {task.category === "work"
                            ? "Travail"
                            : task.category === "health"
                            ? "Santé"
                            : task.category === "legal"
                            ? "Légal"
                            : task.category === "school"
                            ? "École"
                            : task.category === "personal"
                            ? "Personnel"
                            : "Autre"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {date ? (
                  <>
                    <p>Aucune tâche pour cette date</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          dueDate: format(date, "yyyy-MM-dd")
                        });
                        setShowCreateDialog(true);
                      }}
                    >
                      <PlusCircle size={16} className="mr-2" />
                      Ajouter une tâche
                    </Button>
                  </>
                ) : (
                  "Veuillez sélectionner une date"
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
