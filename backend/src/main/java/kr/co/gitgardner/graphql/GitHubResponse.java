package kr.co.gitgardner.graphql;

import java.util.List;

public class GitHubResponse {
    public Data data;

    public static class Data {
        public GitHubResponseUser user;
    }

    public static class GitHubResponseUser {
        public ContributionCollection contributionsCollection;
    }

    public static class ContributionCollection {
        public ContributionCalendar contributionCalendar;
    }

    public static class ContributionCalendar {
        public int totalContributions;
        public List<Week> weeks;
    }

    public static class Week {
        public List<ContributionDayData> contributionDays;
    }

    public static class ContributionDayData {
        public String date;
        public int contributionCount;
    }
}