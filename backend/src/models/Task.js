import mongoose from 'mongoose'


const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "please add a task title"],
        trim: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: 'pending'
    },
    deadline: {
        type: Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

export default mongoose.model("Task", taskSchema)