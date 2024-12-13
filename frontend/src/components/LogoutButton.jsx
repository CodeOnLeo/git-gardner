import {Button, LogoutInfo} from "./styles/CommonStyles";

const LogoutButton = () => {
    const handleLogout = () => {
        window.location.href = "http://localhost:8080/logout";
    };

    return (
        <div>
            <Button type="button" onClick={handleLogout}>애플리케이션 로그아웃</Button>
            <br/>
            <LogoutInfo>
                GitHub 계정에서 완전히 로그아웃하려면 <br/>
                <a href="https://github.com/logout" target="_blank" rel="noopener noreferrer">
                    여기를 클릭
                </a>
                하세요.
            </LogoutInfo>
        </div>
    );
};

export default LogoutButton;