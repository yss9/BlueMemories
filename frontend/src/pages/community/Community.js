import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Nav from "../nav/Nav";
import styled from "styled-components";

const Container = styled.div`
  margin: 0 auto;
  padding: 20px;
  width: 1100px;
`;

const IntroduceContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;

  p {
    font-family: Title;
    font-size: 40px;
    margin-bottom: 5px;
  }

  div {
    font-family: Content;
    font-size: 20px;
  }
`;

const MasonryContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Column = styled.div`
  flex: 1;
  margin: 0 10px;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const CardWrapper = styled.div`
  margin-top:50px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: auto;
    min-height: 200px;
    max-height: 450px;
    display: block;
    object-fit: cover;
  }
`;

const Title = styled.h2`
  margin-left: 20px;
  font-family: Title;
  font-size: 24px;
`;

const Author = styled.p`
  margin-top:-15px;
  margin-left: 20px;
  font-family: Content;
  font-size: 16px;
`;

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
                    console.error('Failed to fetch diaries:', error);
                    setError(error);
                    setLoading(false);
                });
        }
    }, []);

    const handleTitleClick = (diary) => {
        navigate(`/community-diary`, { state: { id: diary.id } });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading diaries.</div>;

    // 3개의 컬럼에 아이템을 분배하는 함수
    const columns = [[], [], []];
    diaries.forEach((diary, index) => {
        columns[index % 3].push(diary);
    });

    return (
        <div>
            <Nav />
            <Container>
                <IntroduceContainer>
                    <p>커뮤니티</p>
                    <div>다른 사람들은 어떤 일기를 쓸까요?</div>
                    <div>사람들의 일기를 구경하고 좋아요와 댓글을 남겨보세요!</div>
                </IntroduceContainer>
                <MasonryContainer>
                    {columns.map((column, columnIndex) => (
                        <Column key={columnIndex}>
                            {column.map((diary, index) => (
                                <div key={index}>
                                    <CardWrapper onClick={() => handleTitleClick(diary)}>
                                        {diary.imageUrl && <img src={diary.imageUrl} alt={diary.title} />}
                                        <Title>{diary.title}</Title>
                                        <Author>작성자: {diary.nickname}</Author>
                                    </CardWrapper>
                                </div>
                            ))}
                        </Column>
                    ))}
                </MasonryContainer>
            </Container>
        </div>
    );
};

export default CommunityForm;