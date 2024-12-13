package kr.co.gitgardner.graphql;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;

import java.util.HashSet;
import java.util.Set;

@Controller
public class EmailGraphQL {
    // TODO : DB 구현 후 수정할 것 !!
    private final Set<String> registeredEmails = new HashSet<>();

    public record RegisterResponse(boolean sucess, String message){}

    // TODO : 이메일 유효성 검증 로직 추가 필요
    @MutationMapping
    public RegisterResponse registerEmail(@Argument String email) {
        if(registeredEmails.contains(email)) {
            return new RegisterResponse(false, "이미 등록된 이메일입니다.");
        }

        registeredEmails.add(email);
        return new RegisterResponse(true, "이메일 등록이 완료되었습니다.");
    }
}
