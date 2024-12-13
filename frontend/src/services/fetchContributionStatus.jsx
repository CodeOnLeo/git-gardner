const fetchContributionStatus = async () => {
    try {
        const response = await fetch("http://localhost:8080/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                  query {
                    getContributionStatus {
                      totalContributions
                      days {
                        date
                        contributionCount
                      }
                    }
                  }
                `,
            }),
            credentials: "include",
        });

        if(!response.ok){
            throw new Error(`Network response was not ok. status: ${response.status}`);
        }

        const {data} = await response.json();
        return data.getContributionStatus;
    }catch (e) {
        console.error("[ERROR]", e);
        throw e;
    }
};

export default fetchContributionStatus;