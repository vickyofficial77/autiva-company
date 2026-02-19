import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Activate from "./pages/Activate";
import Tasks from "./pages/Tasks";
import RequireAuth from "./components/RequireAuth";
import RequireActive from "./components/RequireActive";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/activate"
          element={
            <RequireAuth>
              <Activate />
            </RequireAuth>
          }
        />

        <Route
          path="/tasks"
          element={
            <RequireActive>
              <Tasks />
            </RequireActive>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
