import Layout from "./Layout";
import Dashboard from "./pages/Dashboard/DashBoard";
import { Routes, Route, BrowserRouter } from "react-router";
import Calendar from "./pages/Calendar/Caledar";
import Projects from "./pages/Projects/Projects";
import Settings from "./pages/Dashboard/Settings";
import { TaskProvider } from "./context/TaskProvider";
import { TaskEditProvider } from "./context/TaskEditContext";

function App() {
  return (
    <TaskEditProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />}></Route>
            <Route path="/calendar" element={<Calendar />}></Route>
            <Route path="/projects" element={<Projects />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </TaskEditProvider>
  );
}

export default App;
