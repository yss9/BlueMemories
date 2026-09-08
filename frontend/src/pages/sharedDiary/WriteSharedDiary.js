import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Nav from "../nav/Nav";
import Cookies from "js-cookie";
import axios from "axios";
import LoadingAnimation from '../diary/LoadingAnimation';
import PageContainer from '../../components/layout/PageContainer';

const Container = styled(PageContainer).attrs({
  $maxWidth: '900px',
  $padding: '30px 24px 24px',
  $textAlign: 'center',
})`
  text-align: center;
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
  background-color: ${(props) => (props.$active ? '#566e56' : '#f0f8f0')};
  color: ${(props) => (props.$active ? '#ffffff' : '#999999')};
  transition: background-color 0.3s, color 0.3s;
`;

const InputField = styled.div`
  width: 100%;
  height: 40px;
  background-color: rgba(184, 232, 234, 0.5);
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;

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
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ColumnBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background-color: rgba(184, 232, 234, 0.5);
  border-radius: 10px;
  padding: 0 10px;
  min-height: 40px;
  min-width: 0;

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
  width: 100%;
  height: 450px;
  border: 0.5px solid rgba(94, 120, 100, 1);
  border-radius: 10px;
  font-size: 16px;
  resize: none;
  margin-bottom: 20px;
  padding: 10px;
  font-family: Content;
  box-sizing: border-box;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const AttachmentButtonContainer = styled(ButtonContainer)`
  justify-content: flex-start;
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

const SecondaryButton = styled(Button)`
  background-color: white;
  color: black;
  border: 0.5px solid rgba(94, 120, 100, 1);
`;

const AttachButton = styled(Button)`
  width: 120px;
  height: 35px;
  font-size: 18px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ContentCount = styled.div`
  font-family: Content;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WriteSharedDiaryForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [weather, setWeather] = useState('');
    const [content, setContent] = useState('');
    const [isToggled, setIsToggled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const today = new Date();

    // 연도, 월, 일을 가져와서 원하는 형식으로 포맷
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const [date, setDate] = useState(formattedDate);

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

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // 저장 시작 시 로딩 상태 true 설정
        const token = Cookies.get('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/signin');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify({
            title,
            weather,
            date,
            content,
            sharedDiaryId: location.state.id, // 공유일기장 ID를 추가
        })], {
            type: "application/json"
        }));
        if (image) {
            formData.append('imageFile', image);
        }

        try {
            await axios.post('/api/shared-diary-content/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            // 성공 시 이전 페이지로 리다이렉트 (또는 적절한 페이지로)
            navigate(-1);
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
            {isLoading && (
                <Overlay>
                    <LoadingAnimation />
                </Overlay>
            )}
            {!isLoading && (
                <Container>
                    <TopContainer>
                        <LeftContainer>
                            <SwitchContainer>
                                <ToggleSwitch onClick={handleToggle}>
                                    <ToggleOption $active={isToggled}>공개</ToggleOption>
                                    <ToggleOption $active={!isToggled}>비공개</ToggleOption>
                                </ToggleSwitch>
                            </SwitchContainer>
                        </LeftContainer>
                        <RightContainer>
                            <SecondaryButton>
                                저장
                            </SecondaryButton>
                            <Button onClick={handleSubmit}>발행</Button>
                        </RightContainer>
                    </TopContainer>
                    <InputField>
                        <label>제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목"
                        />
                    </InputField>
                    <TwoColumnContainer>
                        <ColumnBox>
                            <label>날씨</label>
                            <input
                                type="text"
                                value={weather}
                                onChange={(e) => setWeather(e.target.value)}
                                placeholder="날씨"
                            />
                        </ColumnBox>
                        <ColumnBox>
                            <label>날짜</label>
                            <input
                                type="text"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="2000-00-00"
                            />
                        </ColumnBox>
                    </TwoColumnContainer>
                    <LargeInput
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="본문"
                    />
                    <ContentCount>
                        글자 수는 1000자를 초과할 수 없습니다. 현재 글자 수 : {content.length}
                    </ContentCount>
                    <AttachmentButtonContainer>
                        <HiddenFileInput
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                        <AttachButton onClick={handleButtonClick}>
                            사진 첨부하기
                        </AttachButton>
                    </AttachmentButtonContainer>
                </Container>
            )}
        </div>
    );
};
export default WriteSharedDiaryForm;
