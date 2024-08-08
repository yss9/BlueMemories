import axios from 'axios';

export const checkUserId = async (userId) => {
    const response = await axios.get(`/api/check-userId`, { params: { userId } });
    return response.data;
};

export const checkNickname = async (nickname) => {
    const response = await axios.get(`/api/check-nickname`, { params: { nickname } });
    return response.data;
};

export const registerUser = async (userId, nickname, password) => {
    const response = await axios.post('/api/register', { userId, nickname, password });
    return response.status;
};
export const signInUser = async (userId, password) => {
    const response = await axios.post('/api/login', { userId, password });
    return response.data; // JWT 토큰 반환
};

export const getUserInfo = async (token) => {
    const response = await axios.get('/api/user-info', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};