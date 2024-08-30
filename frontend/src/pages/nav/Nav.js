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
`;

const Logo = styled.div`
  font-family: Title;
  font-size: 30px;
  cursor: pointer;
  
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
  color: black;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
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
            axios.get('/api/user-info', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setNickname(response.data.nickname);
                })
                .catch(error => {
                    console.error('Failed to fetch user info:', error);
                });
        }
    }, []);

    const handleLogout = async () => {
        const token = Cookies.get('token');
        if (token) {
            Cookies.remove('token');
            setNickname('');
            navigate('/signin');
        }
    };

    const handleMain = () => {
        navigate('/');
    }

    return (
        <NavContainer>
            <LeftLinks>
                <Logo onClick={handleMain}>Blue Memories</Logo>
                <NavLink style={{ marginLeft: "40px" }} to="/calendar">일기장</NavLink>
                <NavLink to="/shared-diary">교환일기</NavLink>
                <NavLink to="/community">커뮤니티</NavLink>
                <NavLink to="/profile">내정보</NavLink>
            </LeftLinks>
            <RightLinks>
                {nickname ? (
                    <>
                        <div style={{fontSize:"30px"}}>{nickname} <label style={{fontSize:"20px"}}> 님 안녕하세요!</label></div>
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