import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import API from '../services/api';
import { useToast } from '../context/toastContext';

const AddTaskModal = ({ onTaskAdded }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: ''
    });

    const { showSuccess, showError } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/tasks', formData);
            onTaskAdded(data);
            setFormData({ title: '', description: '', deadline: '' });
            setOpen(false);
            showSuccess('Task created successfully!');
        } catch (error) {
            showError(`Error creating task: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a new task.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input
                                id="title"
                                placeholder="What needs to be done?"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                                id="description"
                                placeholder="Add some details..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full">Save Task</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddTaskModal;