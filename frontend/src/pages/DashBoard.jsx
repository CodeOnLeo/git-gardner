import LogoutButton from "../components/LogoutButton";
import {Button, Form, Input, StyledWrapper, Title} from "../components/styles/CommonStyles";
import {useEffect, useState} from "react";
import { fetchContributionStatus, hasCommitToday } from "../services/fetchContributionStatus";
import HeatMapGrid from "react-heatmap-grid";

const DashBoard = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [contributionData, setContributionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchContributionStatus();
                setContributionData(data);
            } catch (e) {
                setError("잔디 로딩 실패");
                console.error("[ERROR]", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        alert("이펙트 실행");
        const checkCommitStatus = async () => {
            try{
                const committedToday = await hasCommitToday();
                // TODO : 테스트용
                if(!committedToday){
                    alert("오늘의 커밋 없음");
                }else{
                    alert("오늘 커밋 있음");
                }
            }catch (e){
                console.error("[ERROR]", e);
            }
        };
        checkCommitStatus();
    },[]);

    const prepareHeatmapData = () => {
        if (!contributionData) return { xLabels: [], yLabels: [], heatmapData: [] };

        const daysInWeek = ["일", "월", "화", "수", "목", "금", "토"];
        const weeksCount = 4;

        const weeklyData = Array.from({ length: 7 }, () => Array(weeksCount).fill(null));

        const today = new Date();
        today.setHours(0,0,0,0);

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() - (weeksCount - 1) * 7);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);

        const filteredData = contributionData.days.filter(day => {
            const date = new Date(day.date);
            return date >= startDate && date <= endDate;
        });

        const contributionMap = {};
        filteredData.forEach(day => {
            const d = new Date(day.date);
            d.setHours(0,0,0,0);
            const key = d.toISOString().split('T')[0];
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

        const xLabels = ["3주 전", "2주 전", "1주 전", "이번 주"];
        const yLabels = daysInWeek;

        return { xLabels, yLabels, heatmapData: weeklyData };
    };

    const {xLabels, yLabels, heatmapData} = prepareHeatmapData();

    return (
        <StyledWrapper>
            <Form>
                <Title>
                    Git Gardner<span>알림을 받을 이메일을 입력하세요</span>
                </Title>
                <Input type="email" placeholder="Email 주소 입력" value={email} onChange={handleEmailChange}/>
                <Button type="button" onClick={handleEmailSubmit}>
                    Email 등록하기
                    <svg
                        className="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 17 5-5-5-5"/>
                        <path d="m13 17 5-5-5-5"/>
                    </svg>
                </Button>
                {loading && <p>잔디 데이터를 불러오는 중입니다...</p>}
                {error && <p>{error}</p>}
                {contributionData && (
                    <div>
                        <h2>최근 4주간 커밋 이력</h2>
                        <div
                            style={{
                                width: "90%",
                                maxWidth: "800px",
                                overflowX: "auto",
                                padding: "1rem",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                            }}
                        >
                            <HeatMapGrid
                                xLabels={xLabels}
                                yLabels={yLabels}
                                data={heatmapData}
                                cellHeight={30}
                                cellWidth="auto"
                                xLabelsStyle={() => ({
                                    fontSize: "0.9rem",
                                    color: "#555",
                                    fontWeight: "bold",
                                    padding: "4px 0"
                                })}
                                yLabelsStyle={() => ({
                                    fontSize: "0.9rem",
                                    color: "#555",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    paddingRight: "4px"
                                })}
                                cellStyle={(_, cell) => {
                                    if (!cell) {
                                        return {
                                            background: "#eee",
                                            border: "1px solid #fff"
                                        };
                                    }

                                    const {count, isToday} = cell;
                                    return {
                                        background: isToday
                                            ? "rgba(255, 0, 0, 0.6)"
                                            : (count ? `rgba(0, 128, 0, ${count / 10})` : "#eee"),
                                        border: isToday ? "2px solid red" : "1px solid #fff",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontSize: "0.9rem",
                                        color: count > 5 ? "#fff" : "#000",
                                        transition: "background 0.3s ease"
                                    };
                                }}
                                cellRender={(cell) => cell && cell.count}
                            />
                            <br/>
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: "10px",
                                fontSize: "0.9rem"
                            }}>
                                <div style={{
                                    width: "20px",
                                    height: "20px",
                                    background: "rgba(255, 0, 0, 0.6)",
                                    border: "2px solid red"
                                }}></div>
                                <span>오늘</span>
                            </div>
                        </div>
                    </div>
                )}
                <LogoutButton/>
            </Form>
        </StyledWrapper>
    );
};

export default DashBoard;