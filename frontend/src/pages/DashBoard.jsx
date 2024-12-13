import LogoutButton from "../components/LogoutButton";
import {Button, Form, Input, StyledWrapper, Title} from "../components/styles/CommonStyles";

const DashBoard = () => {
    const handleEmailSubmit = () => {
        const email = document.querySelector('input[name="email"]').value;

        if(!email){
            alert("이메일 주소를 입력해주세요.")
            return;
        }

        fetch("http://localhost:8080/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `mutation {
                    registerEmail(email: "${email}") {
                        success
                        message
                    }
                }
                `,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
            const result = data.data.registerEmail;
            if(result.success){
                alert(result.message);
            }else{
                alert(result.message);
            }
            })
            .catch((err) => {
                console.log("[ERROR]" + err);
                alert("서버 요청에 실패했습니다.");
            });
    };

    return (
        <StyledWrapper>
            <Form>
                <Title>
                    Git Gardner<span>알림을 받을 이메일을 입력하세요</span>
                </Title>
                <Input type="email" placeholder="Email 주소 입력" name="email"/>
                <Button type={"button"} onClick={ handleEmailSubmit}>
                    Email 등록하기
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 17 5-5-5-5"/>
                        <path d="m13 17 5-5-5-5"/>
                    </svg>
                </Button>
                <LogoutButton/>
            </Form>
        </StyledWrapper>
    );
}

export default DashBoard;