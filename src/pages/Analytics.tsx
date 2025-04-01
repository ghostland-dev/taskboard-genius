
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasks } from "@/contexts/TaskContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const Analytics: React.FC = () => {
  const { tasks } = useTasks();
  const [timeFrame, setTimeFrame] = useState("all");

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress").length;
  const todoTasks = tasks.filter((task) => task.status === "todo").length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Data for status pie chart
  const statusData = [
    { name: "À faire", value: todoTasks, color: "#94a3b8" },
    { name: "En cours", value: inProgressTasks, color: "#3b82f6" },
    { name: "Terminé", value: completedTasks, color: "#22c55e" },
  ];

  // Data for priority distribution
  const priorityData = [
    { name: "Haute", value: tasks.filter((task) => task.priority === "high").length, color: "#ef4444" },
    { name: "Moyenne", value: tasks.filter((task) => task.priority === "medium").length, color: "#f97316" },
    { name: "Basse", value: tasks.filter((task) => task.priority === "low").length, color: "#22c55e" },
  ];

  // Data for category distribution
  const categoryData = [
    { name: "Santé", value: tasks.filter((task) => task.category === "health").length },
    { name: "Travail", value: tasks.filter((task) => task.category === "work").length },
    { name: "École", value: tasks.filter((task) => task.category === "school").length },
    { name: "Légal", value: tasks.filter((task) => task.category === "legal").length },
    { name: "Personnel", value: tasks.filter((task) => task.category === "personal").length },
    { name: "Autre", value: tasks.filter((task) => task.category === "other").length },
  ].filter((item) => item.value > 0);

  // Colors for categories
  const categoryColors = ["#3b82f6", "#8b5cf6", "#f59e0b", "#64748b", "#ec4899", "#10b981"];

  // Data for task creation over time (mocked for demo)
  const taskCreationData = [
    { name: "Lun", tasks: 3 },
    { name: "Mar", tasks: 5 },
    { name: "Mer", tasks: 2 },
    { name: "Jeu", tasks: 8 },
    { name: "Ven", tasks: 4 },
    { name: "Sam", tasks: 1 },
    { name: "Dim", tasks: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-heading">Statistiques</h1>
        <p className="text-muted-foreground mt-1">
          Visualisez les données et performances de vos tâches
        </p>
      </div>

      <div className="flex justify-end">
        <Select value={timeFrame} onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois-ci</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
            <SelectItem value="all">Toutes les données</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Tâches totales</p>
              <p className="text-4xl font-bold">{totalTasks}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Tâches terminées</p>
              <p className="text-4xl font-bold">{completedTasks}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Tâches en cours</p>
              <p className="text-4xl font-bold">{inProgressTasks}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Taux de complétion</p>
              <p className="text-4xl font-bold">{completionRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Création de tâches au fil du temps</CardTitle>
            <CardDescription>
              Nombre de tâches créées par jour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskCreationData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution par statut</CardTitle>
            <CardDescription>
              Répartition des tâches selon leur statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution par priorité</CardTitle>
            <CardDescription>
              Répartition des tâches selon leur niveau de priorité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {categoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribution par catégorie</CardTitle>
            <CardDescription>
              Répartition des tâches selon leur catégorie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" nameKey="name">
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={categoryColors[index % categoryColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
