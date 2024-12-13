const LogoutButton = () => {
    const handleLogout = () => {
        window.location.href = "http://localhost:8080/logout";
    };

    return (
        <div>
            <button onClick={handleLogout}>애플리케이션 로그아웃</button>
            <p>
                GitHub 계정에서 완전히 로그아웃하려면
                <a href="https://github.com/logout" target="_blank" rel="noopener noreferrer">
                    여기를 클릭
                </a>
                하세요.
            </p>
        </div>
    );
};

export default LogoutButton;