import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Nav from "../nav/Nav";
import backgroundImage from '../images/background.png'; // 이미지 경로를 수정하고 import 합니다.

const BackGround = styled.div`
  background-image: url(${backgroundImage}); // import한 이미지를 사용합니다.
  background-size: 60%; // 배경 이미지의 크기를 줄입니다.
  background-repeat: repeat; // 배경 이미지가 반복되도록 설정합니다.
  width: 100%;
  min-height: 100vh;
  position: relative; /* 화면 전체를 덮도록 설정합니다. */
  top: 0;
  left: 0;
`;

const Container = styled.div`
  text-align: center;
  margin: 0 auto;
  width: 90%;
  max-width: 900px;
  padding-top: 30px;
  position: relative;
  z-index: 1; /* 배경 이미지 위에 위치하도록 설정합니다. */
  padding: 20px;
  box-sizing: border-box;
  min-height: 100vh;
`;

const DiaryPage = () => {
    const location = useLocation();
    const { date, title, content, weather,confidenceNegative, confidencePositive, confidenceNeutral,like_num, sentiment } = location.state.diary;
    return (
        <BackGround>
            <Nav />
            <Container>
                <p>posit - {confidencePositive}</p>
                <p>neu - {confidenceNeutral}</p>
                <p>negative - {confidenceNegative}</p>
                <p>{like_num}</p>
                <p>{sentiment}</p>
                <h1>{title}</h1>
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Weather:</strong> {weather}</p>
                <p>{content}</p>

            </Container>
        </BackGround>
    );
};

export default DiaryPage;