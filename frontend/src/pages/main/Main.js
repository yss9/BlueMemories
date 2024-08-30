import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { getUserInfo } from '../join/api';
import Cookies from 'js-cookie';
import Nav from "../nav/Nav";
import community from "./image/community.png";
import communityIcon from "./image/communityIcon.png";
import diary from "./image/diary.png";
import diaryBackground from "./image/diaryBackground.png";
import diaryIcon from "./image/diaryIcon.png";
import sharedDiary from "./image/sharedDiary.png"
import sharedDiaryIcon from "./image/sharedDiaryIcon.png";
import todayRecommend from "./image/todayRecommend.png";
import todayRecommendIcon from "./image/todayRecommendIcon.png";
import mainBackground from "./image/mainBackground.png";
import happy from "../images/happy.png";
import neutral from "../images/neutral.png";
import sad from "../images/sad.png";

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
`;

const WelcomeMessage = styled.div`
  font-size: 24px;
  font-family: Content;
  scroll-snap-align: center;
`;

const ContainerTop = styled.div`
  background-color: white;
  height: 93vh;
  scroll-snap-align: center;
`;

const ContainerMiddleTop = styled.div`
  background-repeat: repeat;
  background-image: url("${diaryBackground}");
  height: 100vh;
  width: 100%;
  display: flex;
  scroll-snap-align: center;
`;

const ContainerMiddleBottom = styled.div`
  vertical-align: center;
  background-color: rgba(242, 255, 249, 1);
  height: 100vh;
  scroll-snap-align: center;
  p{
    font-family: Title;
  }
`;

const ContainerBottomTop = styled.div`
  background: linear-gradient(180deg, #BAFFC9 0%, #B8EBFF 100%);
  height: 100vh;
  scroll-snap-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContainerBottomBottom = styled.div`
  height: 100vh;
  background-image: url("${mainBackground}");
  background-repeat: no-repeat;
  background-size: cover;
  scroll-snap-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top:10px;
  flex-direction: column;
  padding: 30px 0px 0px 60px;
  gap: 30px;
  width: 30%;
  height: 730px;
`;

const Button = styled.div`
  font-family: Title;
  width: 350px;
  height: 150px;
  font-size: 36px;
  background-color: transparent;
  color: black;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  &:hover {
    background-color: rgba(179, 246, 202, 0.5);
  }
  p{
    display: inline-block;
    margin-top: 55px;
    padding-left: 40px;
  }
  ${(props) =>
          props.active &&
          css`
            background-color: rgba(179, 246, 202, 0.5);
            transform: translateX(10px);
          `}
`;

const slideIn = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
`;

const ContentContainer = styled.div`
  width: 70%;
  margin-top: 30px;
  height: 700px;
  background-color: #f0f0f0;
  background-image: ${({ backgroundImage }) => `url(${backgroundImage})`};
  background-size: cover;
  position: relative;
  display: ${({ active }) => (active ? 'block' : 'none')};
  animation: ${slideIn} 0.5s ease forwards;
  border-radius: 35px;
`;

const Content = styled.div`
  font-family: Title;
  width: 95%;
  height: 95%;
  font-size: 36px;
  color: rgba(0, 0, 0, 1);
  display: flex;
  padding: 2.5%;
  align-items: flex-end;
  white-space: pre-line;
`;

const SentimentBox = styled.div`
  margin-top: 35vh;
  font-family: Title;
  display: inline-block;
  text-align: center;
  width: 100%;

  div{
    display: inline-block;
    margin-right: 20px;
    text-align: center;
    font-size: 30px;
  }
  p{
    margin-top: -5px;
  }
`;

const SentimentTextBox = styled.div`
  width: 100%;
  text-align: center;
  font-size: 35px;
  white-space: pre-line;
  font-family: Title;
`;

const BottomTopContent = styled.div`
  font-family: Content;
  font-size: 28px;
  color: #333;
  text-align: center;
`;

const MainPage = () => {
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeContent, setActiveContent] = useState(null);
    const diaryInfoText = "작성된 일기를 분석해서\n긍정, 중립, 부정 수치를 나타내줘요.";
    const sharedDiaryInfoText = " 지인들과 함께 기록하는\n공유일기를 작성할 수 있어요."
    const communityInfoText = "다른 사람들과 일기를 공유하고\n댓글 및 좋아요를 남길 수 있어요.";
    const todayRecommendInfoText = "작성한 일기의 내용과 어울리는\n노래를 추천 받을 수 있어요.";
    const SentimentInfoText = "BlueMemories 만의\n특별한 감정을 만나볼 수 있어요.";
    const handleButtonClick = (index) => {
        setActiveContent(index);
    };

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
            <Nav />
            <Container>
                <ContainerTop>
                    <WelcomeMessage>안녕하세요, {nickname}님! BlueMemories와 함께 다양한 일기를 작성해보세요!</WelcomeMessage>
                </ContainerTop>
                <ContainerMiddleTop>
                    <ButtonContainer>
                        <Button active={activeContent === 1} onClick={() => handleButtonClick(1)}>
                            <p>나만의 일기장</p>
                            <img style={{float:"right"}} src={diaryIcon} alt="나만의 일기장"/>
                        </Button>
                        <Button active={activeContent === 2} onClick={() => handleButtonClick(2)}>
                            <p>공유 일기장</p>
                            <img style={{float:"right"}} src={sharedDiaryIcon} alt="공유 일기장"/>
                        </Button>
                        <Button active={activeContent === 3} onClick={() => handleButtonClick(3)}>
                            <p>커뮤니티</p>
                            <img style={{float:"right"}} src={communityIcon} alt="커뮤니티"/>
                        </Button>
                        <Button active={activeContent === 4} onClick={() => handleButtonClick(4)}>
                            <p>오늘의 추천</p>
                            <img style={{float:"right"}} src={todayRecommendIcon} alt="오늘의 추천"/>
                        </Button>
                    </ButtonContainer>
                    <ContentContainer
                        active={activeContent === 1}
                        backgroundImage={diary}
                    >
                        <Content>
                            {diaryInfoText}
                        </Content>
                    </ContentContainer>
                    <ContentContainer
                        active={activeContent === 2}
                        backgroundImage={sharedDiary}
                    >
                        <Content>
                            {sharedDiaryInfoText}
                        </Content>
                    </ContentContainer>
                    <ContentContainer
                        active={activeContent === 3}
                        backgroundImage={community}
                    >
                        <Content>
                            {communityInfoText}
                        </Content>
                    </ContentContainer>
                    <ContentContainer
                        active={activeContent === 4}
                        backgroundImage={todayRecommend}
                    >
                        <Content>
                            {todayRecommendInfoText}
                        </Content>
                    </ContentContainer>
                </ContainerMiddleTop>
                <ContainerMiddleBottom>
                    <SentimentBox>
                        <div>
                            <img src={`${happy}`}/>
                            <p>긍정</p>
                        </div>
                        <div>
                            <img src={`${neutral}`}/>
                            <p>중립</p>
                        </div>
                        <div>
                            <img src={`${sad}`}/>
                            <p>부정</p>
                        </div>
                    </SentimentBox>
                    <SentimentTextBox>
                        {SentimentInfoText}
                    </SentimentTextBox>
                </ContainerMiddleBottom>
                <ContainerBottomTop>

                </ContainerBottomTop>
                <ContainerBottomBottom>

                </ContainerBottomBottom>
            </Container>
        </div>
    );
};

export default MainPage;