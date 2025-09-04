import './App.css';
import LoginPage from "./pages/LoginPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import {AuthProvider} from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
    console.log("🚀 App 컴포넌트 렌더링 시작");
    console.log("📱 User Agent:", navigator.userAgent);
    console.log("🌍 현재 URL:", window.location.href);
    
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/dashboard" element={<PrivateRoute><DashBoard/></PrivateRoute>}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
