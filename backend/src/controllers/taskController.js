import Task from "../models/Task.js"

export const createTask = async (req, res) => {
    try {
        const { title, description, deadline, userId } = req.body

        const task = await Task.create({
            title,
            description,
            deadline,
            user: userId
        })
        res.status(201).json(task);
    }
    catch (error) {
        res.status(400).json({ message: error.message})
    }
}