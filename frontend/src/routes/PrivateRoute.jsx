import {useAuth} from "../context/AuthContext";
import {Navigate} from "react-router-dom";
import styled from "styled-components";

const LoadingWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    
    @media (prefers-color-scheme: dark) {
        background: #0f172a;
    }
`;

const LoadingContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 40px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    
    @media (prefers-color-scheme: dark) {
        background: #1e293b;
        border: 1px solid #334155;
        color: #f1f5f9;
    }
`;

const Spinner = styled.div`
    width: 32px;
    height: 32px;
    border: 3px solid #e5e7eb;
    border-radius: 50%;
    border-top-color: #2563eb;
    animation: spin 1s ease-in-out infinite;
    
    @media (prefers-color-scheme: dark) {
        border-color: #334155;
        border-top-color: #3b82f6;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

const PrivateRoute = ({children}) => {
    const {isAuthenticated} = useAuth();

    if (isAuthenticated === null) {
        return (
            <LoadingWrapper>
                <LoadingContent>
                    <Spinner />
                    <p>인증 상태를 확인하고 있습니다...</p>
                </LoadingContent>
            </LoadingWrapper>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;