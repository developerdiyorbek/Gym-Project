import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Navbar from "./components/shared/Navbar";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "./components/ui/sonner";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
};

export default App;
