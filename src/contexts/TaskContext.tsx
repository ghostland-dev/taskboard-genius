
import React, { createContext, useState, useContext, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export type TaskPriority = "low" | "medium" | "high";
export type TaskCategory = "health" | "work" | "school" | "legal" | "personal" | "other";

export type RepetitionFrequency = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "inprogress" | "completed";
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  repeats: RepetitionFrequency;
  repeatUntil?: Date;
  tags?: string[];
}

type TaskContextType = {
  tasks: Task[];
  createTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    // Sample tasks
    {
      id: uuidv4(),
      title: "Finir la documentation du projet",
      description: "Compléter tous les schémas et les explications techniques",
      status: "inprogress",
      priority: "high",
      category: "work",
      dueDate: new Date(2023, 11, 15),
      createdAt: new Date(2023, 11, 5),
      updatedAt: new Date(2023, 11, 5),
      repeats: "none",
    },
    {
      id: uuidv4(),
      title: "Rendez-vous annuel chez le médecin",
      description: "Bilan de santé général",
      status: "todo",
      priority: "medium",
      category: "health",
      dueDate: new Date(2023, 11, 20),
      createdAt: new Date(2023, 11, 1),
      updatedAt: new Date(2023, 11, 1),
      repeats: "yearly",
      repeatUntil: new Date(2026, 11, 20),
    },
    {
      id: uuidv4(),
      title: "Payer les impôts",
      description: "Déclaration à faire avant la fin du mois",
      status: "todo",
      priority: "high",
      category: "legal",
      dueDate: new Date(2023, 11, 28),
      createdAt: new Date(2023, 11, 10),
      updatedAt: new Date(2023, 11, 10),
      repeats: "yearly",
    },
  ]);

  const createTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    toast.success("Tâche créée avec succès");
  };

  const updateTask = (id: string, updatedTaskData: Partial<Task>) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            ...updatedTaskData,
            updatedAt: new Date(),
          };
        }
        return task;
      })
    );
    toast.success("Tâche mise à jour avec succès");
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.info("Tâche supprimée");
  };

  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  const value = {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
