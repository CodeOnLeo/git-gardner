export const fetchContributionStatus = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
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
        return data?.getContributionStatus || null;
    }catch (e) {
        console.error("[ERROR]", e);
        throw e;
    }
};

export const hasCommitToday = async () => {
    try{
        const response = await fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                  query {
                    hasCommitToday
                  }
                `,
            }),
            credentials: "include",
        });

        if(!response.ok){
            throw new Error(`[ERROR] status: ${response.status}`);
        }

        const {data} = await  response.json();
        return data?.hasCommitToday || false;
    } catch (e) {
        console.error("[ERROR]", e);
        throw e;
    }
}