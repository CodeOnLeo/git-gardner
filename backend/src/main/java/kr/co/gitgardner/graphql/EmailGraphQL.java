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

    // TODO : 이메일 유효성 검증 로직 추가 필요
    @MutationMapping
    public String registerEmail(@Argument String email) {
        registeredEmails.add(email);
        return "등록 완료";
    }
}
