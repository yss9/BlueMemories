import React, { useEffect, useState, useRef } from 'react';
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
  text-align: center;
  padding-top: 100px;
  background: linear-gradient(to bottom, #a0f9c8, #d4f4fa);
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  scroll-snap-align: center;
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
  height: 700px;
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
const Title = styled.p`
  font-family: 'Title';
  font-size: 35px;
  margin-bottom: 50px;
`;

const CategoryContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  white-space: nowrap;
`;

const CategoryButton = styled.button`
  background-color: rgba(255, 255, 255, 0.5);
  font-family: Content;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d4f4fa;
  }

  ${(props) => props.active && `
    background-color: #b3f6ca;
    border-color: #8ce5a6;
  `}
`;

const CardWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  width: 80%;
  padding: 20px;
  gap: 20px;
  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar for better UX */
  }
`;

const CardContainer = styled.div`
  font-family: Content;
  display: flex;
  min-width: 100%;
  scroll-snap-align: start;
  transition: transform 0.3s ease-in-out;
`;

const Card = styled.div`
  background-color: #4c6b58;
  padding: 20px;
  border-radius: 10px;
  font-size: 23px;
  flex: 1;
  height: 200px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
`;

const categories = [
    { name: '감사', topics: ['오늘 가장 감사했던 일은 무엇인가요?', '지난주에 감사했던 순간은 언제였나요?', '감사한 사람 또는 상황에 대해 적어보세요.'] },
    { name: '감정', topics: ['오늘 느낀 주요 감정은 무엇이었나요? 왜 그런 감정을 느꼈나요?', '최근에 가장 기뻤던 순간은 언제였나요?', '슬픔이나 좌절감을 느꼈을 때 어떻게 대처했나요?'] },
    { name: '목표', topics: ['오늘 이루고 싶은 목표는 무엇이었나요?', '이번 달에 달성하고 싶은 목표를 적어보세요.', '장기적인 목표와 이를 위해 지금 할 수 있는 일은 무엇인가요?'] },
    { name: '자아 성찰', topics: ['나의 강점과 약점은 무엇인가요?', '최근에 자신에 대해 깨달은 점이 있나요?', '앞으로 더 나은 자신이 되기 위해 어떤 점을 개선하고 싶나요?'] },
    { name: '기억', topics: ['어린 시절 가장 행복했던 기억은 무엇인가요?', '최근에 기억에 남는 여행이나 경험을 적어보세요.', '가족이나 친구와의 소중한 추억을 기록해보세요.'] },
    { name: '관계', topics: ['오늘 만난 사람들과의 대화에서 인상 깊었던 점은 무엇이었나요?', '나의 중요한 사람들과의 관계에서 고마운 점은 무엇인가요?', '누군가와 갈등이 있었다면, 그 상황을 어떻게 해결하고 싶은가요?'] },
    { name: '창의적', topics: ['오늘 본 인상적인 장면이나 풍경을 묘사해보세요.', '마음속에 떠오른 이야기나 시를 적어보세요.', '미래의 나에게 보내는 편지를 써보세요.'] },
    { name: '건강', topics: ['오늘의 식단이나 운동에 대해 기록해보세요.', '몸과 마음의 상태를 기록하고, 어떻게 개선할 수 있을지 적어보세요.', '수면 패턴이나 스트레스 관리 방법에 대해 생각해보세요.'] },
    { name: '배움', topics: ['오늘 새롭게 배운 것이 있다면 적어보세요.', '최근에 읽은 책이나 본 영화에서 얻은 교훈은 무엇인가요?', '학습하고 싶은 주제나 스킬에 대해 계획을 세워보세요.'] },
    { name: '소망', topics: ['이루고 싶은 꿈이나 소망을 적어보세요.', '5년 후, 10년 후의 자신을 상상해보세요.', '현재의 나에게 필요한 변화는 무엇인가요?'] },
];

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


    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
    const cardWrapperRef = useRef(null);
    const handleCategoryClick = (index) => {
        setActiveCategoryIndex(index);
        const wrapper = cardWrapperRef.current;
        wrapper.scrollTo({
            left: wrapper.offsetWidth * index,
            behavior: 'smooth'
        });
    };

    const handleScroll = () => {
        const wrapper = cardWrapperRef.current;
        const scrollLeft = wrapper.scrollLeft;
        const cardWidth = wrapper.offsetWidth;
        const newIndex = Math.round(scrollLeft / cardWidth);
        setActiveCategoryIndex(newIndex);
    };
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

    useEffect(() => {
        const wrapper = cardWrapperRef.current;
        if (wrapper) {
            wrapper.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (wrapper) {
                wrapper.removeEventListener('scroll', handleScroll);
            }
        };
    }, [cardWrapperRef]);

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
                    <Title>이런 주제의 일기는 어떤가요?</Title>
                    <CategoryContainer>
                        {categories.map((category, index) => (
                            <CategoryButton
                                key={category.name}
                                active={activeCategoryIndex === index}
                                onClick={() => handleCategoryClick(index)}
                            >
                                {category.name}
                            </CategoryButton>
                        ))}
                    </CategoryContainer>
                    <CardWrapper ref={cardWrapperRef}>
                        {categories.map((category) => (
                            <CardContainer key={category.name}>
                                {category.topics.map((topic, idx) => (
                                    <Card key={idx}>
                                        <div style={{backgroundColor:"white", color:"black", padding:"5px 30px", borderRadius:"10px"}}>{topic}</div>
                                    </Card>
                                ))}
                            </CardContainer>
                        ))}
                    </CardWrapper>
                </ContainerBottomTop>
                <ContainerBottomBottom>

                </ContainerBottomBottom>
            </Container>
        </div>
    );
};

export default MainPage;