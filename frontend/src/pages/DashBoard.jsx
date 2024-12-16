import LogoutButton from "../components/LogoutButton";
import {Button, Form, Input, StyledWrapper, Title} from "../components/styles/CommonStyles";
import {useEffect, useRef, useState} from "react";
import {hasCommitToday, fetchContributionStatus} from "../services/fetchContributionStatus";
import HeatMapGrid from "react-heatmap-grid";

const DashBoard = () => {
    const [email, setEmail] = useState("");
    const [contributionData, setContributionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alertShown, setAlertShown] = useState(false);

    const handleEmailChange = (e) => setEmail(e.target.value);

    const handleEmailSubmit = async () => {
        if (!email) {
            alert("이메일 주소를 입력해주세요.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/graphql", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    query: `mutation {
                        registerEmail(email: "${email}") {
                            success
                            message
                        }
                    }`,
                }),
            });

            const data = await response.json();
            const result = data.data.registerEmail;
            alert(result.message);
        } catch (err) {
            console.error("[ERROR]", err);
            alert("서버 요청에 실패했습니다.");
        }
    };

    const hasAlerted = useRef(false);

    useEffect(() => {
        const initializeDashboard = async () => {
            try {
                const [committedToday, contributionData] = await Promise.all([
                    hasCommitToday(),
                    fetchContributionStatus()
                ]);

                if (!hasAlerted.current) {
                    if (!committedToday) {
                        alert("오늘의 커밋 없음");
                    } else {
                        alert("오늘 커밋 있음");
                    }
                    hasAlerted.current = true;
                }

                setContributionData(contributionData);
            } catch (e) {
                console.error("[ERROR]", e);
                setError("데이터 로딩 실패");
            } finally {
                setLoading(false);
            }
        };

        initializeDashboard();
    }, []);

    const prepareHeatmapData = () => {
        if (!contributionData) return {xLabels: [], yLabels: [], heatmapData: []};

        const daysInWeek = ["일", "월", "화", "수", "목", "금", "토"];
        const weeksCount = 4;

        const weeklyData = Array.from({length: 7}, () => Array(weeksCount).fill(null));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() - (weeksCount - 1) * 7);

        const contributionMap = {};
        contributionData.days.forEach(day => {
            const date = new Date(day.date);
            date.setHours(0, 0, 0, 0);
            const key = date.toISOString().split('T')[0];
            contributionMap[key] = (contributionMap[key] || 0) + day.contributionCount;
        });

        const totalDays = weeksCount * 7;
        for (let i = 0; i < totalDays; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dayOfWeek = currentDate.getDay();
            const weekIndex = Math.floor(i / 7);

            const dateKey = currentDate.toISOString().split("T")[0];
            const count = contributionMap[dateKey] || 0;
            const isToday = currentDate.getTime() === today.getTime();

            weeklyData[dayOfWeek][weekIndex] = {
                count,
                isToday
            };
        }

        return {
            xLabels: ["3주 전", "2주 전", "1주 전", "이번 주"],
            yLabels: daysInWeek,
            heatmapData: weeklyData
        };
    };

    const {xLabels, yLabels, heatmapData} = prepareHeatmapData();

    if (loading) {
        return <p>잔디 데이터를 불러오는 중입니다...</p>;
    }

    return (
        <StyledWrapper>
            <Form>
                <Title>
                    Git Gardner<span>알림을 받을 이메일을 입력하세요</span>
                </Title>
                <Input type="email" placeholder="Email 주소 입력" value={email} onChange={handleEmailChange}/>
                <Button type="button" onClick={handleEmailSubmit}>Email 등록하기</Button>
                {error && <p>{error}</p>}
                {contributionData && (
                    <div>
                        <h2>최근 4주간 커밋 이력</h2>
                        <HeatMapGrid
                            xLabels={xLabels}
                            yLabels={yLabels}
                            data={heatmapData}
                            cellHeight={30}
                            cellWidth="auto"
                            cellStyle={(_, cell) => {
                                if (!cell) {
                                    return {background: "#eee", border: "1px solid #fff"};
                                }

                                const {count, isToday} = cell;
                                return {
                                    background: isToday ? "rgba(255, 0, 0, 0.6)" : (count ? `rgba(0, 128, 0, ${count / 10})` : "#eee"),
                                    border: isToday ? "2px solid red" : "1px solid #fff",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "0.9rem",
                                    color: count > 5 ? "#fff" : "#000",
                                };
                            }}
                            cellRender={(cell) => cell && cell.count}
                        />
                    </div>
                )}
                <LogoutButton/>
            </Form>
        </StyledWrapper>
    );
};

export default DashBoard;