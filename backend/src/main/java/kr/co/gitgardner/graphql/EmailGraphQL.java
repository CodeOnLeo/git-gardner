package kr.co.gitgardner.graphql;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.HashSet;
import java.util.Set;

@Controller
public class EmailGraphQL {
    // TODO : DB 구현 후 수정할 것 !!
    private final Set<String> registeredEmails = new HashSet<>();

    public record RegisterResponse(boolean success, String message){}
    public record EmailResponse(String email, boolean isRegistered){}

    @QueryMapping
    public EmailResponse getUserEmail() {
        // TODO: 실제 구현시에는 인증된 사용자의 이메일을 조회해야 함
        if (registeredEmails.isEmpty()) {
            return new EmailResponse(null, false);
        }
        // 현재는 첫 번째 등록된 이메일을 반환 (임시)
        String firstEmail = registeredEmails.iterator().next();
        return new EmailResponse(firstEmail, true);
    }

    // TODO : 이메일 유효성 검증 로직 추가 필요
    @MutationMapping
    public RegisterResponse registerEmail(@Argument String email) {
        if(registeredEmails.contains(email)) {
            return new RegisterResponse(false, "이미 등록된 이메일입니다.");
        }

        registeredEmails.add(email);
        return new RegisterResponse(true, "이메일 등록이 완료되었습니다.");
    }

    @MutationMapping
    public RegisterResponse updateEmail(@Argument String email) {
        // 기존 이메일 모두 삭제하고 새 이메일로 교체
        registeredEmails.clear();
        registeredEmails.add(email);
        return new RegisterResponse(true, "이메일이 변경되었습니다.");
    }
}
