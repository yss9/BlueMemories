import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Nav from "../nav/Nav";

const CommunityForm = () => {
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            axios.get('/api/diaries/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setDiaries(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Failed to fetch user info:', error);
                    setError(error);
                    setLoading(false);
                });
        }
    }, []);

    const handleTitleClick = (diary) => {
        navigate(`/community-diary`, { state: { id: diary.id} });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading diaries.</div>;

    return (
        <div>
            <Nav/>
            <h1>커뮤니티</h1>
            <h2>다른 사람들은 어떤 일기를 쓸까요? 사람들의 일기를 구경하고 좋아요와 댓글을 남겨보세요!</h2>
            <ul>
                {diaries.map((diary, index) => (
                    <li key={index}>
                        <h2 onClick={() => handleTitleClick(diary)}>
                            {diary.title}
                        </h2>
                        <p>{diary.content}</p>
                        <p>userNickname : {diary.nickname}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommunityForm;