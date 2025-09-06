import React, { useState } from "react";
import { Button, LogoutInfo, LoadingSpinner, CardTitle } from "./styles/CommonStyles";
import styled from "styled-components";
import { getApiEndpoint } from '../utils/apiConfig';

const LogoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    text-align: center;
    
    @media (max-width: 1024px) {
        gap: 22px;
    }
    
    @media (max-width: 768px) {
        gap: 20px;
    }
    
    @media (max-width: 480px) {
        gap: 18px;
    }
`;

const SecondaryButton = styled(Button)`
    background: linear-gradient(135deg, #6b7280, #4b5563);
    max-width: 320px;
    
    @media (max-width: 1024px) {
        max-width: 300px;
    }
    
    @media (max-width: 768px) {
        max-width: 280px;
    }
    
    @media (max-width: 480px) {
        max-width: 260px;
    }
    
    @media (prefers-color-scheme: dark) {
        background: linear-gradient(135deg, #4b5563, #374151);
    }
    
    &:hover {
        background: linear-gradient(135deg, #4b5563, #374151);
        
        @media (prefers-color-scheme: dark) {
            background: linear-gradient(135deg, #374151, #1f2937);
        }
    }
`;

const LogoutButton = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            window.location.href = getApiEndpoint('/logout');
        }, 500);
    };

    return (
        <LogoutContainer>
            <CardTitle>🌿 정원사 관리</CardTitle>
            
            <SecondaryButton 
                type="button" 
                onClick={handleLogout} 
                disabled={isLoggingOut}
            >
                {isLoggingOut ? (
                    <>
                        <LoadingSpinner />
                        정원에서 나가는 중...
                    </>
                ) : (
                    <>
                        🚪 정원 나가기
                    </>
                )}
            </SecondaryButton>
            
            <LogoutInfo>
                GitHub 계정에서 완전히 로그아웃하려면
                <br />
                <a href="https://github.com/logout" target="_blank" rel="noopener noreferrer">
                    여기를 클릭
                </a>
                하세요.
            </LogoutInfo>
        </LogoutContainer>
    );
};

export default LogoutButton;