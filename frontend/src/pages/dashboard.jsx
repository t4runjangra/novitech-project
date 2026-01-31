import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, ListTodo } from "lucide-react";
import AddTaskModal from '../components/AddTask';
import { useToast } from '../context/toastContext';
import { Sidebar } from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { CheckSquare } from 'lucide-react';
const Dashboard = () => {
  const { showSuccess, showError } = useToast();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status.toLowerCase() === filter.toLowerCase();
  });

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
    <div className="flex min-h-screen bg-gray-200 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar
        activeFilter={filter}
        onFilterChange={setFilter}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 md:ml-64 p-4 md:p-8 flex flex-col space-y-6 transition-all duration-300">

        <div className="flex md:hidden items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 font-bold text-blue-600">
            <CheckSquare className="h-5 w-5" />
            <span>TaskFlow</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-slate-600 dark:text-slate-400" />
          </Button>
        </div>

        <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ListTodo className="text-blue-600 dark:text-blue-400 h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">My Tasks</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You have {tasks.length} total tasks
              </p>
            </div>
          </div>
          <AddTaskModal onTaskAdded={handleTaskAdded} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Card
                key={task._id}
                className={`group transition-all duration-300 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md ${task.status === 'completed'
                  ? 'opacity-70 bg-slate-50 dark:bg-slate-900/40'
                  : 'bg-white dark:bg-slate-900'
                  }`}
              >
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div className="space-y-1">
                    <CardTitle className={`text-lg font-bold transition-all ${task.status === 'completed'
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-100'
                      }`}>
                      {task.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 min-h-10">
                    {task.description}
                  </p>

                  <div className="flex justify-between gap-2 pt-2
                  w-full border-t border-slate-100 dark:border-slate-800 ">
                    <Badge
                      className={`capitalize border-2 transition-colors duration-300 ${task.status === 'completed'
                        ? 'text-green-500 border-green-500 bg-green-50 '
                        : 'bg-red-50 text-red-600 border-red-400'
                        }`}
                      variant={task.status === 'completed' ? 'outline' : 'secondary'}
                    >
                      {task.status}
                    </Badge>
                    <div className='gap-2 w-1/2 flex justify-end'>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleStatus(task)}
                        className={`rounded-full transition-colors ${task.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                      >
                        <CheckCircle className={`h-4 w-4 ${task.status === 'completed' ? 'text-green-600' : 'text-slate-400'
                          }`} />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(task._id)}
                        className="rounded-full hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            /* Empty State */
            <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4 bg-white/50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800">
              <div className="p-4 bg-slate-200 dark:bg-slate-800 rounded-full">
                <ListTodo className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No {filter !== 'all' ? filter : ''} tasks found.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;