import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectToMongoDB } from './config/db.js'
import taskRoutes from './routes/Task.routes.js'
import projectRoutes from './routes/Project.routes.js'
import settingsRoutes from './routes/Settings.routes.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use("/api/tasks", taskRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/settings", settingsRoutes)

const PORT = 3000

const startServer = async () => {
  try {
    await connectToMongoDB();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();


// const tasks = [
//   { title: "Study", status: "pending" },
//   { title: "Exercise", status: "completed" },
//   { title: "Code", status: "pending" },
// ];
//                             // initial , value object
// const groupedTask = tasks.reduce((groups, task) => {
//   groups[task.status].push(task)
//   return groups
// }, {
//   pending: [],
//   "in-progress": [],
//   completed: []
// })

// console.log(groupedTask)