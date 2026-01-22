import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle } from "lucide-react";
import AddTaskModal from '../components/AddTask';
import { useToast } from '../context/toastContext';
import { Sidebar } from '../components/SIdebar';
const Dashboard = () => {
  const { showSuccess, showError } = useToast();
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks", error);
      showError(`Error fetching tasks`);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      showError("Task deleted Successfully!");
    } catch (error) {
      showError("Failed to delete task");
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';

      const { data } = await API.put(`/tasks/${task._id}`, { status: newStatus });

      setTasks(tasks.map(t => t._id === task._id ? data : t));
      showSuccess(`Task marked as ${newStatus}`);
    } catch (error) {
      showError("Failed to update status");
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };


  return (
    <>
      <Sidebar />
      <div className=" h-screen p-8  space-y-6 ml-64  bg-gray-200  flex flex-col ">

        <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
          <p className="text-slate-600">You have {tasks.length} tasks</p>
          <AddTaskModal onTaskAdded={handleTaskAdded} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card
              key={task._id}
              className={`hover:shadow-md transition-all ${task.status === 'completed' ? 'opacity-60 bg-slate-50' : 'opacity-100'
                }`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-slate-500' : ''
                  }`}>
                  {task.title}
                </CardTitle>
                <Badge variant={task.status === 'completed' ? 'success' : 'secondary'}>
                  {task.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleStatus(task)}
                    className={task.status === 'completed' ? 'bg-green-100 border-green-500' : ''}
                  >
                    <CheckCircle className={`h-4 w-4 ${task.status === 'completed' ? 'text-green-600' : 'text-slate-400'}`} />
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
    </>
  );
};

export default Dashboard;