import express from "express"
import cors from "cors"
import taskRoutes from "./routes/taskRoutes.js"
import userRoutes from "./routes/userRoutes.js"
const app = express()

app.use(
    cors({
        origin: `http://localhost:5173`,
        credentials: true
    })
)

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))


// routes
app.get("/", (req,res) => {
    res.send("hello world ! api is running")
})

app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users',userRoutes)


export {app}