import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || '/api';

const api = axios.create({
    baseURL,
    withCredentials: true, // 쿠키를 포함하도록 설정
});

export default api;
