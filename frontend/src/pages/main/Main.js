import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getUserInfo } from '../join/api';
import Cookies from 'js-cookie';
import Nav from "../nav/Nav";

const Container = styled.div`
  text-align: center;
  margin: 0 auto;
  padding-top: 50px;
`;

const WelcomeMessage = styled.div`
  font-size: 24px;
  font-family: Content;
  margin-top: 20px;
`;

const MainPage = () => {
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            getUserInfo(token)
                .then(data => {
                    setNickname(data.nickname);
                    setLoading(false);
                })
                .catch(error => {
                    setError('사용자 정보를 가져오는 데 실패했습니다.');
                    setLoading(false);
                });
        } else {
            setError('로그인 토큰이 없습니다.');
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Nav/>
            <Container>
                <WelcomeMessage>안녕하세요, {nickname}님!</WelcomeMessage>
            </Container>
        </div>
    );
};

export default MainPage;