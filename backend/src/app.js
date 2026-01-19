import express from "express"
import cors from "cors"
import taskRoutes from "./routes/taskRoutes.js"
import userRoutes from "./routes/userRoutes.js"
const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
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

app.use('/api/tasks', taskRoutes);
app.use('/api/users',userRoutes)


export {app}