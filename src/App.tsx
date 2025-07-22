import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import Calendar from "../components/Calendar"
import Navbar from "../components/Navbar"
import Taskmanager from "../components/Taskmanager"
import RootRedirect from "../components/RootRedirect";
import './App.css'

function App() {
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/taskmanager" element={<Taskmanager />} />
      </Routes>
    </>
  );
}

export default App;
