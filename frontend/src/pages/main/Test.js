import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  padding-top: 100px;
  background: linear-gradient(to bottom, #a0f9c8, #d4f4fa);
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const TestPage = () => {
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

    useEffect(() => {
        const wrapper = cardWrapperRef.current;
        wrapper.addEventListener('scroll', handleScroll);

        return () => {
            wrapper.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Container>
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
        </Container>
    );
};

export default TestPage;