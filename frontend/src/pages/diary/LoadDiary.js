import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Nav from "../nav/Nav";
import backgroundImage from '../images/background.png';
import Cookies from "js-cookie";
import axios from "axios";
import happyImage from './images/happy.png';
import neutralImage from './images/neutral.png';
import sadImage from './images/sad.png';
import YouTube from 'react-youtube';

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
  z-index: 1;
  padding: 20px;
  box-sizing: border-box;
  min-height: 100vh;
`;

const ElementDiv = styled.div`
  margin-right: 20px;
  display: inline-block;
  float: right;
`;

const SentimentImage = styled.img`
  width: 25px;
  margin-right: 80px;
`;

const SentimentBox = styled.div`
  padding-left: 17px;
  font-family: Content;
  label {
    font-family: Title;
    font-size: 20px;
    padding-right: 20px;
  }
`;

const NicknameBox = styled.div`
  height: 20px;
  width: 100%;
  padding-left: 20px;
  margin-top: 10px;
  font-family: Content;
  font-size: 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.hasImage ? 'row' : 'column')};
  gap: 20px;
  margin-top: 30px;
`;

const ImageWrapper = styled.div`
  flex: ${(props) => (props.hasImage ? '1' : '0')};
  display: ${(props) => (props.hasImage ? 'block' : 'none')};
`;

const TextWrapper = styled.div`
  flex: 2;
  word-break: break-word;
`;

const VideoContainer = styled.div`
  margin-top: 20px;
`;

const RefreshButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #566e56;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const StateBox = styled.div`
  width: 100%;
  div{
    display: inline-block;
    font-family: Title;
    font-size: 25px;
  }
  
`

const DiaryPage = () => {
    const location = useLocation();
    const { date, title, content, weather, confidenceNegative, confidencePositive, confidenceNeutral, likeNum, sentiment, imageUrl, keyword1, keyword2, keyword3, keyword4 } = location.state.diary;
    const [nickname, setNickname] = useState('');
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const keywords = [keyword1, keyword2, keyword3, keyword4];

    let posit = Math.round(confidencePositive);
    let neut = Math.round(confidenceNeutral);
    let negat = 100 - posit - neut;

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
        console.log(location.state.diary);
    }, [location]);

    const handleRefresh = () => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % keywords.length);
    };

    return (
        <BackGround>
            <Nav />
            <Container>
                <div style={{ width: "100%", height: "40px" }}>
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
                <div style={{ width: "100%", height: "20px" }}>
                    <NicknameBox>{nickname}님의 일기</NicknameBox>
                </div>
                <div style={{ width: "100%", height: "30px", marginTop: "30px" }}>
                    <label style={{ fontFamily: "Title", fontSize: "40px" }}>{title}</label>
                </div>
                <StateBox>
                    <div>날씨</div>
                    <div style={{marginLeft:"30px", fontFamily:"Content", fontSize:"18px"}}>{weather}</div>
                    <div style={{ float:"right", marginRight:"150px"}}>
                        <div>날짜</div>
                        <div style={{marginLeft:"30px", fontFamily:"Content", fontSize:"18px"}}>{date}</div>
                    </div>
                </StateBox>

                <ContentContainer hasImage={Boolean(imageUrl)}>
                    <ImageWrapper hasImage={Boolean(imageUrl)}>
                        {imageUrl && <img src={imageUrl} alt="Diary attachment" style={{ maxWidth: '100%', borderRadius: '10px' }} />}
                    </ImageWrapper>
                    <TextWrapper>
                        {content.split('\n').map((line, index) => (
                            <span key={index}>
                {line}
                                <br />
              </span>
                        ))}
                    </TextWrapper>
                </ContentContainer>

                <VideoContainer>
                    <YouTube videoId={keywords[currentVideoIndex]} />
                </VideoContainer>
                <RefreshButton onClick={handleRefresh}>새로고침</RefreshButton>
            </Container>
        </BackGround>
    );
};

export default DiaryPage;