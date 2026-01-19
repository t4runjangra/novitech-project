import Task from "../models/Task.js"

export const createTask = async (req, res) => {
    try {
        const { title, description, deadline, userId } = req.body

        const task = await Task.create({
            title,
            description,
            deadline,
            user: req.user._id
        })
        res.status(201).json(task);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}


export const getTask = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id })
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" })
        }

        const updated = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.json(updated)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not Authorized" })
        }
        await task.deleteOne();
        res.json({ message: "Task removed" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}