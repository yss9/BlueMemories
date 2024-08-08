import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Nav from "../nav/Nav";
import backgroundImage from '../images/background.png';
import Cookies from "js-cookie";
import axios from "axios";
import happyImage from './images/happy.png'
import neutralImage from './images/neutral.png'
import sadImage from './images/sad.png'

const BackGround = styled.div`
  background-image: url(${backgroundImage});
  background-size: 60%;
  background-repeat: repeat;
  width: 100%;
  min-height: 100vh;
  position: relative; 
  top: 0;
  left: 0;
`;

const Container = styled.div`
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
const ElementDiv = styled.div`
  margin-right: 20px;
    display: inline-block;
  float: right;
`

const SentimentImage = styled.img`
  width: 25px;
  margin-right: 80px;
    background-image: url(${(props) => props.path? props.path:"green"});
`

const SentimentBox = styled.div`
  padding-left: 17px;
  font-family: Content;
    label{
      font-family: Title;
      font-size: 20px;
      padding-right: 20px;
    }
`

const NicknameBox = styled.div`
  height: 20px;
  width: 100%;
  padding-left: 20px;
  margin-top: 10px;
  font-family: Content;
  font-size: 20px;
`


const DiaryPage = () => {
    const location = useLocation();
    const { date, title, content, weather,confidenceNegative, confidencePositive, confidenceNeutral,likeNum, sentiment } = location.state.diary;
    const [nickname, setNickname] = useState('');
    let posit = Math.round(confidencePositive);
    let neut = Math.round(confidenceNeutral);
    let negat = 100-posit-neut;
    
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


    return (
        <BackGround>
            <Nav />
            <Container>
                <div style={{width:"100%", height:"40px"}}>
                    <ElementDiv>
                        <SentimentImage src={sadImage}></SentimentImage>
                        <SentimentBox><label>부정</label> {negat}%</SentimentBox>
                    </ElementDiv>
                    <ElementDiv>
                        <SentimentImage src={neutralImage}></SentimentImage>
                        <SentimentBox><label>중립</label> {neut}%</SentimentBox>
                    </ElementDiv>
                    <ElementDiv>
                        <SentimentImage src={happyImage}></SentimentImage>
                        <SentimentBox><label>긍정</label> {posit}%</SentimentBox>
                    </ElementDiv>
                </div>
                <div style={{width:"100%", height:"20px"}}>
                    <NicknameBox>{nickname}님의 일기</NicknameBox>
                </div>
                <div style={{width:"100%", height:"30px", marginTop:"30px"}}>
                    <label style={{fontFamily:"Title", fontSize:"40px"}}>{title}</label>
                </div>
                <div>
                    <p><strong>Date:</strong> {date}</p>
                    <p><strong>Weather:</strong> {weather}</p>
                </div>
                <div>
                    {content.split('\n').map((line) => {
                        return (
                            <span>
                                {line}
                                <br />
                            </span>
                        );
                    })}
                </div>
                <div>recommend</div>
                <div>
                    <p>{likeNum}</p>
                </div>
            </Container>
        </BackGround>
    );
};

export default DiaryPage;