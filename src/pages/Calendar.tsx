
import React, { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks, Task } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Filter tasks with due dates
  const tasksWithDueDate = tasks.filter(
    (task) => task.dueDate !== undefined
  );

  // Group tasks by date
  const tasksByDate: Record<string, Task[]> = {};
  tasksWithDueDate.forEach((task) => {
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-heading">Calendrier</h1>
      <p className="text-muted-foreground">Visualisez vos tâches par date</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Date</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={fr}
              modifiers={{
                hasTasks: hasTaskOnDate,
              }}
              modifiersStyles={{
                hasTasks: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(var(--brand-500), 0.1)",
                  borderBottom: "2px solid var(--brand-500)",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>
              {date
                ? `Tâches pour le ${format(date, "d MMMM yyyy", {
                    locale: fr,
                  })}`
                : "Sélectionnez une date"}
            </CardTitle>
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
                Aucune tâche pour cette date
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
