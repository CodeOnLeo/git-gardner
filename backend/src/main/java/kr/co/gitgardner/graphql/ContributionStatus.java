package kr.co.gitgardner.graphql;

import java.util.List;

public record ContributionStatus(
        int totalContributions,
        List<ContributionDay> days
) {
}
