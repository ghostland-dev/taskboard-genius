
import React, { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useTasks } from "@/contexts/TaskContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

const Calendar: React.FC = () => {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Filter tasks for the selected date
  const tasksForSelectedDate = selectedDate
    ? tasks.filter(
        (task) =>
          task.dueDate && isSameDay(new Date(task.dueDate), selectedDate)
      )
    : [];

  // Function to get days with tasks for highlighting in the calendar
  const getDaysWithTasks = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const hasTask = tasks.some((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === month &&
        taskDate.getFullYear() === year
      );
    });

    if (hasTask) {
      return (
        <div className="flex flex-col h-full">
          <span className="flex justify-center items-center h-8 w-8">{day}</span>
          <Badge className="w-1 h-1 p-0 rounded-full bg-brand-500 mx-auto" />
        </div>
      );
    }
    
    return day;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-heading">Calendrier</h1>
        <p className="text-muted-foreground mt-1">
          Visualisez vos tâches selon leur échéance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des tâches</CardTitle>
              <CardDescription>
                Sélectionnez une date pour voir les tâches associées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
                className="border rounded-md"
                formatters={{
                  day: getDaysWithTasks
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                Tâches du{" "}
                {selectedDate
                  ? format(selectedDate, "d MMMM yyyy", { locale: fr })
                  : "jour sélectionné"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {tasksForSelectedDate.map((task) => (
                    <div key={task.id} className="task-card">
                      <h3 className="font-medium">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
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
                      <div className="text-xs text-muted-foreground mt-2">
                        Statut:{" "}
                        {task.status === "todo"
                          ? "À faire"
                          : task.status === "inprogress"
                          ? "En cours"
                          : "Terminé"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">
                  Aucune tâche pour cette date
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
