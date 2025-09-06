import { getApiEndpoint } from '../utils/apiConfig';

export const fetchContributionStatus = async () => {
    try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(getApiEndpoint('/graphql'), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
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
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(getApiEndpoint('/graphql'), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            },
            body: JSON.stringify({
                query: `
                  query {
                    hasCommitToday
                  }
                `,
            }),
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