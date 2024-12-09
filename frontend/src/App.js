import './App.css';
import Login from "./pages/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Login />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
