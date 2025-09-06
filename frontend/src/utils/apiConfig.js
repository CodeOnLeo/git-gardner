// API URL 설정 및 HTTPS 강제 적용
export const getApiUrl = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'https://git-gardner-production.up.railway.app';
    // HTTPS 강제 적용
    return apiUrl.replace(/^http:/, 'https:');
};

export const getApiEndpoint = (path) => {
    return `${getApiUrl()}${path}`;
};