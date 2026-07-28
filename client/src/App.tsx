import Layout from "./Layout";
import Dashboard from "./pages//Dashboard/DashBoard";
import { Routes, Route, BrowserRouter } from "react-router";
import Calendar from "./pages/Dashboard/Caledar";
import Projects from "./pages/Dashboard/Projects";
import Settings from "./pages/Dashboard/Settings";

function App() {
  return (
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
  );
}

export default App;
