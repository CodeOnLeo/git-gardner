import LogoutButton from "../components/LogoutButton";
import {Button, Form, Input, StyledWrapper, Title} from "../components/styles/CommonStyles";

const DashBoard = () => {
    return (
        <StyledWrapper>
            <Form>
                <Title>
                    Git Gardner<span>알림을 받을 이메일을 입력하세요</span>
                </Title>
                <Input type="email" placeholder="Email 주소 입력" name="email"/>
                <Button>
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