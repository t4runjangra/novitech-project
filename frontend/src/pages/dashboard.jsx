import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, CheckCircle } from "lucide-react"; // Icons for better UI

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const { user, logout } = useContext(AuthContext);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      alert("Failed to delete task");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
        <Button variant="destructive" onClick={logout}>Logout</Button>
      </div>

      <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
        <p className="text-slate-600">You have {tasks.length} tasks</p>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card key={task._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{task.title}</CardTitle>
              <Badge variant={task.status === 'completed' ? 'success' : 'secondary'}>
                {task.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="icon">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleDelete(task._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;