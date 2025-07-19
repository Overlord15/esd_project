import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import Calendar from "../components/Calendar"
import Navbar from "../components/Navbar"
import Taskboard from "../components/Taskboard"

function App() {
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/taskboard" element={<Taskboard />} />
      </Routes>
    </>
  );
}

export default App;
