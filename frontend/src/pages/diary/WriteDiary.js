import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Nav from "../nav/Nav";
import Cookies from "js-cookie";
import axios from "axios";
import LoadingAnimation from './LoadingAnimation';  // 추가된 부분

const Container = styled.div`
  text-align: center;
  margin: 0 auto;
  width: 90%;
  max-width: 900px;
  padding-top: 30px;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const SwitchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ToggleSwitch = styled.div`
  display: flex;
  width: 120px;
  height: 30px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  font-family: title;
  font-size: 23px;
`;

const ToggleOption = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.active ? '#566e56' : '#f0f8f0')};
  color: ${(props) => (props.active ? '#ffffff' : '#999999')};
  transition: background-color 0.3s, color 0.3s;
`;

const InputField = styled.div`
  width: 97.5%;
  height: 40px;
  background-color: rgba(184, 232, 234, 0.5);
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 10px;
  margin-bottom: 10px;

  label {
    font-size: 23px;
    padding-left: 15px;
    flex: 0 0 50px;
    text-align: left;
    font-family: Title;
  }

  input {
    flex: 1;
    border: none;
    background-color: transparent;
    height: 100%;
    font-size: 16px;
    font-family: Content;
  }
`;

const TwoColumnContainer = styled.div`
  display: flex;
  height: 40px;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
`;

const ColumnBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background-color: rgba(184, 232, 234, 0.5);
  border-radius: 10px;
  padding: 0 10px;

  &:last-child {
    margin-left: 15px;
  }

  label {
    font-size: 23px;
    padding-left: 15px;
    flex: 0 0 50px;
    text-align: left;
    font-family: Title;
  }

  input {
    flex: 1;
    border: none;
    background-color: transparent;
    height: 100%;
    font-family: Content;
    font-size: 16px;
  }
`;

const LargeInput = styled.textarea`
  width: 97.5%;
  height: 450px;
  border: 0.5px solid rgba(94, 120, 100, 1);
  border-radius: 10px;
  font-size: 16px;
  resize: none;
  margin-bottom: 20px;
  padding: 10px;
  font-family: Content;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  width: 85px;
  height: 30px;
  font-size: 21px;
  background-color: #566e56;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: Title;
`;

const WriteDiaryForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [weather, setWeather] = useState('');
    const [date, setDate] = useState('');
    const [content, setContent] = useState('');
    const [isToggled, setIsToggled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (location.state && location.state.date) {
            setDate(location.state.date);
        }
    }, [location]);

    const handleToggle = () => {
        setIsToggled(!isToggled);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // 저장 시작 시 로딩 상태 true 설정
        const token = Cookies.get('token');

        const formData = new FormData();
        formData.append('diary', new Blob([JSON.stringify({
            title,
            weather,
            date,
            content,
            isPrivate: !isToggled
        })], {
            type: "application/json"
        }));
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post('/api/diaries', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            // 성공 시 캘린더 페이지로 리다이렉트
            navigate('/calendar');
        } catch (error) {
            console.error(error);
            // 에러 처리 로직
        } finally {
            setIsLoading(false); // 저장 완료 후 로딩 상태 false 설정
        }
    };

    return (
        <div>
            <Nav />
            {isLoading && <LoadingAnimation />}
            {!isLoading && (
                <Container>
                    <TopContainer>
                        <LeftContainer>
                            <SwitchContainer>
                                <ToggleSwitch onClick={handleToggle}>
                                    <ToggleOption active={isToggled}>공개</ToggleOption>
                                    <ToggleOption active={!isToggled}>비공개</ToggleOption>
                                </ToggleSwitch>
                            </SwitchContainer>
                        </LeftContainer>
                        <RightContainer>
                            <Button style={{ backgroundColor: "white", color: "black", border: "0.5px solid rgba(94, 120, 100, 1)" }}>저장</Button>
                            <Button onClick={handleSubmit} primary>발행</Button>
                        </RightContainer>
                    </TopContainer>
                    <InputField>
                        <label>제목</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
                    </InputField>
                    <TwoColumnContainer>
                        <ColumnBox>
                            <label>날씨</label>
                            <input type="text" value={weather} onChange={(e) => setWeather(e.target.value)} placeholder="날씨" />
                        </ColumnBox>
                        <ColumnBox>
                            <label>날짜</label>
                            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="2000-00-00" />
                        </ColumnBox>
                    </TwoColumnContainer>
                    <LargeInput value={content} onChange={(e) => setContent(e.target.value)} placeholder="본문" />
                    <ButtonContainer style={{ float: "left" }}>
                        <input type="file" onChange={handleImageChange} />
                        <Button style={{ width: "120px", height: "35px", fontSize: "18px" }}>사진 첨부하기</Button>
                    </ButtonContainer>
                </Container>
            )}
        </div>
    );
};

export default WriteDiaryForm;