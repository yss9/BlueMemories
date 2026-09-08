import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearToken, getToken } from '../../authToken';

const NavContainer = styled.div`
    background: transparent;
    font-family: Title;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    padding: clamp(10px, 2.2vw, 16px) clamp(16px, 6vw, 100px);
    font-size: clamp(18px, 2vw, 25px);
    min-height: 52px;
    box-sizing: border-box;
    flex-wrap: wrap;
`;

const Logo = styled.div`
    cursor: pointer;
    color: rgba(94, 120, 100, 1);
    white-space: nowrap;
`;

const LeftLinks = styled.div`
    display: flex;
    align-items: center;
    gap: clamp(16px, 4vw, 50px);
    flex-wrap: wrap;
`;

const RightLinks = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: flex-end;
`;

const NavLink = styled(Link)`
  color: ${(props) => (props.$disabled ? 'gray' : 'black')};
  text-decoration: none;
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'auto')};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  white-space: nowrap;

  &:hover {
    text-decoration: none;
  }
`;

const Button = styled.button`
    color: black;
    background: none;
    border: none;
    cursor: pointer;
    font-family: Title;
    font-size: inherit;
    white-space: nowrap;

    &:hover {
        text-decoration: underline;
    }
`;

const Greeting = styled.div`
    font-size: 30px;
    white-space: nowrap;
`;

const GreetingSuffix = styled.label`
    font-size: 20px;
`;

const Nav = () => {
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if (token) {
            axios
                .get('/api/user-info', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setNickname(response.data.nickname);
                })
                .catch((error) => {
                    console.error('Failed to fetch user info:', error);
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        clearToken();
                        setNickname('');
                    }
                });
        }
    }, []);

    const handleLogout = () => {
        clearToken();
        setNickname('');
        navigate('/');
    };

    const handleMain = () => {
        navigate('/');
    };

    const isDisabled = !nickname; // 로그인 여부에 따라 링크 활성화 상태 결정

    return (
        <NavContainer>
            <LeftLinks>
                <Logo onClick={handleMain}>BLUEMEMORIES</Logo>
                <NavLink to="/calendar" $disabled={isDisabled}>
                    일기장
                </NavLink>
                <NavLink to="/shared-diary" $disabled={isDisabled}>
                    교환일기
                </NavLink>
                <NavLink to="/community" $disabled={isDisabled}>
                    커뮤니티
                </NavLink>
                <NavLink to="/profile" $disabled={isDisabled}>
                    내정보
                </NavLink>
            </LeftLinks>
            <RightLinks>
                {nickname ? (
                    <>
                        <Greeting>
                            {nickname} <GreetingSuffix> 님 안녕하세요!</GreetingSuffix>
                        </Greeting>
                        <Button onClick={handleLogout}>로그아웃</Button>
                    </>
                ) : (
                    <>
                        <NavLink to="/signin">로그인</NavLink>
                        <NavLink to="/signup">회원가입</NavLink>
                    </>
                )}
            </RightLinks>
        </NavContainer>
    );
};

export default Nav;
