import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import FormBuilder from "./pages/FormBuilder";
import FormsList from "./pages/FormsList";
import FillForm from "./pages/FillForm";
import Submissions from "./pages/Submissions";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route path="/admin/forms" element={<FormsList />} />
        <Route path="/admin/review" element={<FormsList />} />
        <Route path="/admin/submissions/:id" element={<Submissions />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create" element={<FormBuilder />} />

        {/* User */}
        <Route path="/user" element={<UserDashboard />} /> 
        <Route path="/form/:id" element={<FillForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
