import './App.css';
import LoginPage from "./pages/LoginPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import DashBoard from "./pages/DashBoard";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashBoard />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
