import LogoutButton from "../components/LogoutButton";
import { getApiEndpoint } from '../utils/apiConfig';
import {
    Button, 
    Input, 
    StyledWrapper, 
    Title, 
    Card, 
    CardTitle, 
    HeatmapContainer, 
    LoadingSpinner,
    ErrorMessage,
    SuccessMessage
} from "../components/styles/CommonStyles";
import {useEffect, useState} from "react";
import {hasCommitToday, fetchContributionStatus} from "../services/fetchContributionStatus";
import styled from "styled-components";

const DashboardContainer = styled.div`
    max-width: 1400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 40px;
    
    @media (max-width: 1024px) {
        max-width: 1000px;
        gap: 36px;
    }
    
    @media (max-width: 768px) {
        max-width: 600px;
        gap: 32px;
    }
    
    @media (max-width: 480px) {
        max-width: 380px;
        gap: 24px;
    }
`;

const StatusIndicator = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'hasCommit'
})`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 20px 32px;
    border-radius: 16px;
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 32px;
    
    @media (max-width: 1024px) {
        gap: 14px;
        padding: 18px 28px;
        font-size: 17px;
        margin-bottom: 28px;
        border-radius: 14px;
    }
    
    @media (max-width: 768px) {
        gap: 12px;
        padding: 16px 24px;
        font-size: 16px;
        margin-bottom: 24px;
        border-radius: 12px;
    }
    
    @media (max-width: 480px) {
        gap: 10px;
        padding: 14px 20px;
        font-size: 15px;
        margin-bottom: 20px;
        border-radius: 10px;
    }
    
    ${props => props.hasCommit ? `
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
        border: 2px solid var(--success-color);
        color: var(--success-color);
    ` : `
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
        border: 2px solid var(--error-color);
        color: var(--error-color);
    `}
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 80px 32px;
    color: var(--text-secondary);
    font-size: 18px;
    
    @media (max-width: 1024px) {
        gap: 18px;
        padding: 70px 28px;
        font-size: 17px;
    }
    
    @media (max-width: 768px) {
        gap: 16px;
        padding: 60px 24px;
        font-size: 16px;
    }
    
    @media (max-width: 480px) {
        gap: 14px;
        padding: 50px 20px;
        font-size: 15px;
    }
`;

const EmailFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    
    @media (max-width: 1024px) {
        gap: 14px;
    }
    
    @media (max-width: 768px) {
        gap: 12px;
    }
    
    @media (max-width: 480px) {
        gap: 10px;
    }
`;

// 정원 테마 styled components
const GardenGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const WeekLabels = styled.div`
    display: flex;
    gap: 3px;
    margin-left: 48px;
    flex: 1;
    
    @media (max-width: 1024px) {
        margin-left: 42px;
        gap: 4px;
    }
    
    @media (max-width: 768px) {
        margin-left: 40px;
        gap: 5px;
    }
    
    @media (max-width: 480px) {
        margin-left: 32px;
        gap: 6px;
    }
`;

const WeekLabel = styled.div`
    flex: 1;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    padding: 4px;
`;

const GardenContent = styled.div`
    display: flex;
    gap: 8px;
`;

const DayLabels = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 40px;
    
    @media (max-width: 768px) {
        width: 32px;
    }
    
    @media (max-width: 480px) {
        width: 24px;
    }
`;

const DayLabel = styled.div`
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    
    @media (max-width: 1024px) {
        height: 42px;
        font-size: 11px;
    }
    
    @media (max-width: 768px) {
        height: 38px;
        font-size: 10px;
    }
    
    @media (max-width: 480px) {
        height: 32px;
        font-size: 9px;
    }
`;

const GardenCells = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
`;

const GardenRow = styled.div`
    display: flex;
    flex-direction: row;
    gap: 3px;
    height: 48px;
    
    @media (max-width: 1024px) {
        height: 42px;
        gap: 4px;
    }
    
    @media (max-width: 768px) {
        height: 38px;
        gap: 5px;
    }
    
    @media (max-width: 480px) {
        height: 32px;
        gap: 6px;
    }
`;

const GardenCell = styled.div`
    flex: 1;
    height: 48px;
    
    @media (max-width: 1024px) {
        height: 42px;
    }
    
    @media (max-width: 768px) {
        height: 38px;
    }
    
    @media (max-width: 480px) {
        height: 32px;
    }
`;

const GardenLegend = styled.div`
    margin-top: 20px;
    padding: 16px;
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    
    --surface: #f8fafc;
    --border-color: #e5e7eb;
    
    @media (prefers-color-scheme: dark) {
        --surface: #0f172a;
        --border-color: #334155;
    }
`;

const LegendTitle = styled.h4`
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    
    --text-primary: #111827;
    
    @media (prefers-color-scheme: dark) {
        --text-primary: #f1f5f9;
    }
`;

const LegendItems = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
    
    @media (max-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-secondary);
    
    --text-secondary: #6b7280;
    
    @media (prefers-color-scheme: dark) {
        --text-secondary: #cbd5e1;
    }
    
    span {
        font-size: 16px;
    }
`;

const DashBoard = () => {
    const [userEmail, setUserEmail] = useState(null);
    const [contributionData, setContributionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commitStatus, setCommitStatus] = useState(null);
    
    // 반응형 cellSize를 안전하게 계산
    const getCellSize = () => {
        if (typeof window === 'undefined') return { size: 40, iconSize: 20, padding: 8 };
        
        if (window.innerWidth > 1024) {
            return { size: 48, iconSize: 24, padding: 10 };
        } else if (window.innerWidth > 768) {
            return { size: 42, iconSize: 22, padding: 9 };
        } else if (window.innerWidth > 480) {
            return { size: 38, iconSize: 20, padding: 8 };
        } else {
            return { size: 32, iconSize: 18, padding: 6 };
        }
    };

    const fetchUserEmail = async () => {
        try {
            const response = await fetch(getApiEndpoint('/graphql'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include', // 쿠키 포함하여 인증 정보 전송
                body: JSON.stringify({
                    query: `query {
                        user {
                            email
                        }
                    }`,
                }),
            });

            const data = await response.json();
            console.log("GraphQL response:", data); // 디버깅용 로그
            
            if (data.errors) {
                console.error("GraphQL errors:", data.errors);
            }
            
            if (data.data && data.data.user) {
                setUserEmail(data.data.user.email);
            } else {
                console.log("No user data received, user might not be authenticated");
                setUserEmail(null);
            }
        } catch (err) {
            console.error("[ERROR]", err);
            setUserEmail(null);
        }
    };


    useEffect(() => {
        let isMounted = true; // cleanup flag
        
        const initializeDashboard = async () => {
            try {
                const [committedToday, contributionData] = await Promise.all([
                    hasCommitToday(),
                    fetchContributionStatus(),
                    fetchUserEmail()
                ]);

                if (isMounted) {
                    setCommitStatus(committedToday || false);
                    setContributionData(contributionData || null);
                }
            } catch (e) {
                if (isMounted) {
                    console.error("[ERROR]", e);
                    setError("데이터 로딩 실패");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        initializeDashboard();
        
        return () => {
            isMounted = false; // cleanup
        };
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
    
    // 잔디와 꽃 아이콘을 렌더링하는 함수
    const renderGardenCell = (cell, dayIndex, weekIndex) => {
        const { iconSize, padding } = getCellSize();
        if (!cell) {
            return (
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: `${iconSize}px`,
                    color: '#9ca3af',
                    background: 'linear-gradient(145deg, #f9fafb, #f3f4f6)',
                    border: '1px solid #e5e7eb',
                    borderRadius: `${padding/2}px`,
                    padding: `${padding/2}px`
                }}>
                    🌰
                </div>
            );
        }

        const {count, isToday} = cell;
        
        // 해당 주(열)의 모든 날에 커밋이 있는지 확인
        const weekData = heatmapData.map(dayData => dayData[weekIndex]).filter(Boolean);
        const isWeekComplete = weekData.length === 7 && weekData.every(day => day && day.count > 0);
        const isLastDayOfWeek = dayIndex === 6; // 토요일이 마지막 날
        
        let icon = '🌰'; // 기본 씨앗
        let backgroundColor = '#f3f4f6';
        
        if (count === 0) {
            icon = '🌰'; // 0 커밋 = 씨앗
            backgroundColor = '#f9fafb';
        } else if (isWeekComplete && isLastDayOfWeek) {
            // 일주일 완성 + 토요일 = 꽃!
            const flowers = ['🌸', '🌺', '🌻', '🌷', '🌹'];
            icon = flowers[weekIndex % flowers.length];
            backgroundColor = 'linear-gradient(145deg, #fef3c7, #fcd34d)';
        } else if (count >= 5) {
            icon = '🌿'; // 많은 커밋 = 무성한 잎
            backgroundColor = 'linear-gradient(145deg, #dcfce7, #16a34a)';
        } else if (count >= 3) {
            icon = '🍀'; // 중간 커밋 = 클로버
            backgroundColor = 'linear-gradient(145deg, #d1fae5, #22c55e)';
        } else if (count >= 1) {
            icon = '🌱'; // 1커밋 이상 = 새싹
            backgroundColor = 'linear-gradient(145deg, #ecfdf5, #10b981)';
        }
        
        const isDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (isDarkMode && count > 0) {
            backgroundColor = count >= 5 ? 'linear-gradient(145deg, #166534, #22c55e)' :
                           count >= 3 ? 'linear-gradient(145deg, #14532d, #16a34a)' :
                           'linear-gradient(145deg, #0f4c26, #10b981)';
        }
        
        return (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${iconSize}px`,
                background: backgroundColor,
                border: isToday ? '2px solid #2563eb' : '1px solid #e5e7eb',
                borderRadius: `${padding}px`,
                boxShadow: count > 0 ? '0 2px 4px rgba(0,0,0,0.1)' : 'inset 0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                position: 'relative',
                padding: `${padding/2}px`
            }}
            onMouseEnter={(e) => {
                if (count > 0) {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.zIndex = '10';
                }
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.zIndex = '1';
            }}
            title={`${count}개 커밋${isToday ? ' (오늘)' : ''}${isWeekComplete && isLastDayOfWeek ? ' 🎉 주간 완성!' : ''}`}
            >
                {icon}
                {count > 0 && (
                    <span style={{
                        position: 'absolute',
                        bottom: '0px',
                        right: '0px',
                        fontSize: `${Math.max(8, iconSize * 0.4)}px`,
                        backgroundColor: '#1f2937',
                        color: 'white',
                        borderRadius: '50%',
                        width: `${Math.max(12, iconSize * 0.6)}px`,
                        height: `${Math.max(12, iconSize * 0.6)}px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}>
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <StyledWrapper>
                <LoadingContainer>
                    <LoadingSpinner />
                    <p>잔디 데이터를 불러오는 중입니다...</p>
                </LoadingContainer>
            </StyledWrapper>
        );
    }

    return (
        <StyledWrapper>
            <DashboardContainer>
                <Card>
                    <Title>
                        Git Gardner
                        <span>매일매일 잔디를 관리하세요 🌱</span>
                    </Title>
                    
                    {commitStatus !== null && (
                        <StatusIndicator hasCommit={commitStatus}>
                            <span>{commitStatus ? '🌱' : '💧'}</span>
                            {commitStatus ? '오늘 정원에 새싹이 자랐어요!' : '정원에 물을 주세요 (커밋이 필요해요)'}
                        </StatusIndicator>
                    )}

                    <EmailFormContainer>
                        <CardTitle>🔔 정원사 알림 설정</CardTitle>
                        
                        {userEmail ? (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '16px 24px',
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                                border: '2px solid var(--success-color)',
                                borderRadius: '12px',
                                color: 'var(--success-color)',
                                fontWeight: '600'
                            }}>
                                <span>📧</span>
                                <span>{userEmail}</span>
                                <span style={{fontSize: '14px', opacity: 0.8}}>(GitHub 계정 이메일)</span>
                            </div>
                        ) : (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                padding: '16px 24px',
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                                border: '2px solid var(--error-color)',
                                borderRadius: '12px',
                                color: 'var(--error-color)',
                                fontWeight: '600'
                            }}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                                    <span>⚠️</span>
                                    <span>이메일 알림을 받을 수 없습니다</span>
                                </div>
                                <div style={{
                                    fontSize: '14px', 
                                    opacity: 0.9, 
                                    fontWeight: '500',
                                    lineHeight: '1.5'
                                }}>
                                    GitHub 계정에서 이메일이 private으로 설정되어 있습니다.<br/>
                                    <strong>해결 방법:</strong><br/>
                                    1. GitHub → Settings → Emails → "Keep my email addresses private" 해제<br/>
                                    2. GitHub → Settings → Profile → "Public email"에서 이메일 선택
                                </div>
                            </div>
                        )}
                    </EmailFormContainer>
                </Card>

                {error && (
                    <Card>
                        <ErrorMessage>{error}</ErrorMessage>
                    </Card>
                )}

                {contributionData && (
                    <Card>
                        <CardTitle>🌱 나의 정원 (최근 4주간)</CardTitle>
                        <HeatmapContainer>
                            <GardenGrid>
                                <WeekLabels>
                                    {xLabels.map((label, index) => (
                                        <WeekLabel key={index}>{label}</WeekLabel>
                                    ))}
                                </WeekLabels>
                                <GardenContent>
                                    <DayLabels>
                                        {yLabels.map((label, index) => (
                                            <DayLabel key={index}>{label}</DayLabel>
                                        ))}
                                    </DayLabels>
                                    <GardenCells>
                                        {yLabels.map((_, dayIndex) => (
                                            <GardenRow key={dayIndex}>
                                                {xLabels.map((_, weekIndex) => {
                                                    const cell = heatmapData[dayIndex] && heatmapData[dayIndex][weekIndex];
                                                    return (
                                                        <GardenCell key={`${dayIndex}-${weekIndex}`}>
                                                            {renderGardenCell(cell, dayIndex, weekIndex)}
                                                        </GardenCell>
                                                    );
                                                })}
                                            </GardenRow>
                                        ))}
                                    </GardenCells>
                                </GardenContent>
                            </GardenGrid>
                            <GardenLegend>
                                <LegendTitle>🌿 정원 가이드</LegendTitle>
                                <LegendItems>
                                    <LegendItem><span>🌰</span> 씨앗 (0 커밋)</LegendItem>
                                    <LegendItem><span>🌱</span> 새싹 (1-2 커밋)</LegendItem>
                                    <LegendItem><span>🍀</span> 클로버 (3-4 커밋)</LegendItem>
                                    <LegendItem><span>🌿</span> 잎사귀 (5+ 커밋)</LegendItem>
                                    <LegendItem><span>🌸</span> 꽃 (주간 완성 보상!)</LegendItem>
                                </LegendItems>
                            </GardenLegend>
                        </HeatmapContainer>
                    </Card>
                )}

                <Card>
                    <LogoutButton/>
                </Card>
            </DashboardContainer>
        </StyledWrapper>
    );
};

export default DashBoard;