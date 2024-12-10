import React from 'react';
import styled from 'styled-components';

const LoginPage = () => {
    const handleGithubLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/github";
    }
    return (
        <StyledWrapper>
            <form action className="form">
                <p>
                    Git Gardner<span>매일매일 잔디를 관리하세요</span>
                </p>
                <button type="button" className="oauthButton" onClick={handleGithubLogin}>
                    <svg className="icon" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    Github 계정으로 로그인
                </button>
            </form>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .form {
        --background: #d3d3d3;
        --input-focus: #2d8cf0;
        --font-color: #323232;
        --font-color-sub: #666;
        --bg-color: #fff;
        --main-color: #323232;
        padding: 20px;
        background: var(--background);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 20px;
        border-radius: 5px;
        border: 2px solid var(--main-color);
        box-shadow: 4px 4px var(--main-color);
    }

    .form > p {
        font-family: var(--font-DelaGothicOne);
        color: var(--font-color);
        font-weight: 700;
        font-size: 20px;
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
    }

    .form > p > span {
        font-family: var(--font-SpaceMono);
        color: var(--font-color-sub);
        font-weight: 600;
        font-size: 17px;
    }

    .oauthButton {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        /* margin: 50px auto 0 auto; */
        padding: auto 15px 15px auto;
        width: 250px;
        height: 40px;
        border-radius: 5px;
        border: 2px solid var(--main-color);
        background-color: var(--bg-color);
        box-shadow: 4px 4px var(--main-color);
        font-size: 16px;
        font-weight: 600;
        color: var(--font-color);
        cursor: pointer;
        transition: all 250ms;
        position: relative;
        overflow: hidden;
        z-index: 1;
    }

    .oauthButton::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0;
        background-color: #212121;
        z-index: -1;
        -webkit-box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
        box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
        transition: all 250ms;
    }

    .oauthButton:hover {
        color: #e8e8e8;
    }

    .oauthButton:hover::before {
        width: 100%;
    }

    .icon {
        width: 1.5rem;
        height: 1.5rem;
    }`;

export default LoginPage;