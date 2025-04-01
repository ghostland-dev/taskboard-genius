
import React, { useState } from "react";
import { useTasks, Task, TaskCategory, TaskPriority, RepetitionFrequency } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Tasks: React.FC = () => {
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: TaskPriority;
    category: TaskCategory;
    status: "todo" | "inprogress" | "completed";
    repeats: RepetitionFrequency;
    dueDate?: string;
    repeatUntil?: string;
  }>({
    title: "",
    description: "",
    priority: "medium",
    category: "work",
    status: "todo",
    repeats: "none",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      category: "work",
      status: "todo",
      repeats: "none",
    });
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      category: task.category,
      status: task.status,
      repeats: task.repeats,
      dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : undefined,
      repeatUntil: task.repeatUntil ? format(new Date(task.repeatUntil), "yyyy-MM-dd") : undefined,
    });
    setShowCreateDialog(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      category: formData.category,
      status: formData.status,
      repeats: formData.repeats,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      repeatUntil: formData.repeatUntil ? new Date(formData.repeatUntil) : undefined,
    };
    
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      createTask(taskData);
    }
    
    setShowCreateDialog(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const handleStatusChange = (newStatus: "todo" | "inprogress" | "completed") => {
      updateTask(task.id, { status: newStatus });
    };

    return (
      <div className="task-card mb-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{task.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditTask(task)}>
                <Edit2 size={14} className="mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteTask(task.id)}
                className="text-destructive"
              >
                <Trash2 size={14} className="mr-2" />
                Supprimer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("todo")}>
                <span className="mr-2">→</span>
                À faire
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("inprogress")}>
                <span className="mr-2">→</span>
                En cours
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                <Check size={14} className="mr-2" />
                Terminé
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-2">
          <span className={`task-tag task-category-${task.category}`}>
            {task.category}
          </span>
          <span className={`task-tag task-priority-${task.priority}`}>
            {task.priority === "high"
              ? "Haute"
              : task.priority === "medium"
              ? "Moyenne"
              : "Basse"}
          </span>
        </div>

        <div className="flex items-center text-xs text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center mr-3">
              <Calendar size={12} className="mr-1" />
              {format(new Date(task.dueDate), "dd MMM", { locale: fr })}
            </div>
          )}
          {task.repeats !== "none" && (
            <div className="flex items-center">
              <Clock size={12} className="mr-1" />
              {task.repeats === "daily"
                ? "Quotidien"
                : task.repeats === "weekly"
                ? "Hebdomadaire"
                : task.repeats === "monthly"
                ? "Mensuel"
                : "Annuel"}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Tâches</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et organisez vos tâches
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-brand-500 hover:bg-brand-600">
              <Plus size={16} className="mr-1" />
              Nouvelle tâche
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? "Modifier la tâche" : "Créer une nouvelle tâche"}
              </DialogTitle>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => 
                      handleSelectChange("status", value as "todo" | "inprogress" | "completed")
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">À faire</SelectItem>
                      <SelectItem value="inprogress">En cours</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repeats">Répétition</Label>
                  <Select
                    value={formData.repeats}
                    onValueChange={(value) => handleSelectChange("repeats", value)}
                  >
                    <SelectTrigger id="repeats">
                      <SelectValue placeholder="Sélectionner une fréquence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune</SelectItem>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                      <SelectItem value="yearly">Annuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Date d'échéance</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                  />
                </div>

                {formData.repeats !== "none" && (
                  <div className="space-y-2">
                    <Label htmlFor="repeatUntil">Se répète jusqu'au</Label>
                    <Input
                      id="repeatUntil"
                      name="repeatUntil"
                      type="date"
                      value={formData.repeatUntil}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
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
                  {editingTask ? "Mettre à jour" : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="kanban" className="w-full">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="grid">Grille</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* To Do Column */}
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-medium mb-4 flex items-center">
                <span className="h-2 w-2 bg-gray-500 rounded-full mr-2"></span>
                À faire <span className="ml-2 text-sm text-muted-foreground">({todoTasks.length})</span>
              </h3>
              <div className="space-y-3">
                {todoTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {todoTasks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune tâche en attente
                  </p>
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-medium mb-4 flex items-center">
                <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                En cours <span className="ml-2 text-sm text-muted-foreground">({inProgressTasks.length})</span>
              </h3>
              <div className="space-y-3">
                {inProgressTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {inProgressTasks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune tâche en cours
                  </p>
                )}
              </div>
            </div>

            {/* Completed Column */}
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-medium mb-4 flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                Terminé <span className="ml-2 text-sm text-muted-foreground">({completedTasks.length})</span>
              </h3>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {completedTasks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune tâche terminée
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="grid">
          <div className="mt-6">
            {tasks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Aucune tâche pour le moment</p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="mt-4 bg-brand-500 hover:bg-brand-600"
                >
                  <Plus size={16} className="mr-1" />
                  Créer votre première tâche
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
