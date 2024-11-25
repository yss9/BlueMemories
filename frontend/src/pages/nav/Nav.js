import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const NavContainer = styled.div`
    background: transparent;
    font-family: Title;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 100px;
    font-size: 25px;
    height: 3vh;
`;

const Logo = styled.div`
    cursor: pointer;
    color: rgba(94, 120, 100, 1);
`;

const LeftLinks = styled.div`
    display: flex;
    align-items: center;
    gap: 50px;
`;

const RightLinks = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const NavLink = styled(Link)`
  color: ${(props) => (props.disabled ? 'gray' : 'black')};
  text-decoration: ${(props) => (props.disabled ? 'none' : 'none')};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    text-decoration: ${(props) => (props.disabled ? 'none' : 'none')};
  }
`;

const Button = styled.button`
    color: black;
    background: none;
    border: none;
    cursor: pointer;
    font-family: Title;
    font-size: 25px;

    &:hover {
        text-decoration: underline;
    }
`;

const Nav = () => {
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
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
                });
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
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
                <NavLink to="/calendar" disabled={isDisabled}>
                    일기장
                </NavLink>
                <NavLink to="/shared-diary" disabled={isDisabled}>
                    교환일기
                </NavLink>
                <NavLink to="/community" disabled={isDisabled}>
                    커뮤니티
                </NavLink>
                <NavLink to="/profile" disabled={isDisabled}>
                    내정보
                </NavLink>
            </LeftLinks>
            <RightLinks>
                {nickname ? (
                    <>
                        <div style={{ fontSize: '30px' }}>
                            {nickname} <label style={{ fontSize: '20px' }}> 님 안녕하세요!</label>
                        </div>
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
