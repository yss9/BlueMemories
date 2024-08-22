import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Cookies from "js-cookie";

const ModalBackground = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
`;

const ModalContent = styled.div`
  margin-top: 50px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  height: 620px;
`;

const TitleContainer = styled.div`
  border-radius: 10px;
  height: 40px;
  background-color: rgba(184, 232, 234, 0.5);
`;

const TitleInputBox = styled.input`
  margin-left: 20px;
  background-color: transparent;
  line-height: 36px;
  border: none;
  width: 70%;
  font-size: 18px;
  font-family: Content;
`;

const CreateDiaryButton = styled.div`
  background-color: rgba(94, 120, 100, 1);
  text-align: center;
  font-family: Content;
  border: none;
  border-radius: 10px;
  height: 50px;
  color: white;
  line-height: 50px;
  cursor: pointer;
  margin-top: 10px;
`;

const TitleImageBox = styled.div`
  margin-left: 15px;
  display: inline-block;
  border-radius: 5px;
  width: 50px;
  height: 50px;
  background-image: ${props => props.backgroundImage ? `url(${props.backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  margin-bottom: 10px;
  cursor: pointer;
`;

const TitleExampleBox = styled.div`
  margin: 20px 0px 20px 45px;
  height: 300px;
  width: 300px;
  background-image: ${props => props.backgroundImage ? `url(${props.backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  padding-top: 10px;
  color: black;
  text-align: center;
  border-radius: 10px;
  h1{
    font-size: 20px;
  }
  h2{
    font-size: 15px;
    margin-left: 180px;
    font-weight: lighter;
  }
  h3{
    margin-left: 170px;
    margin-top: 200px;
    font-size: 13px;
  }
`;

const CreateSharedDiaryModal = ({ isOpen, onClose }) => {
    const [selectedCover, setSelectedCover] = useState(null);
    const [title, setTitle] = useState('');
    const today = new Date().toLocaleDateString();

    if (!isOpen) return null;

    const handleCoverSelect = (coverKey) => {
        setSelectedCover(coverKey);
    };

    const handleSave = async () => {
        const diaryData = {
            title,
            coverImageUrl: selectedCover,
            date: today
        };
        const token = Cookies.get('token');
        try {
            await axios.post('/api/create-shared-diary', diaryData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Diary created successfully!");
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Error creating diary", error);
            alert("Failed to create diary.");
        }
    };

    return (
        <ModalBackground onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <button style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "transparent",
                    border: "2px solid rgba(94, 120, 100, 1)",
                    float: "right",
                    borderRadius: "50%",
                    fontWeight: "bold",
                    paddingLeft: "4px",
                    color: "rgba(94, 120, 100, 1)",
                    cursor: "pointer"
                }} onClick={onClose}>X</button>
                <h2 style={{ textAlign: "center" }}>새로운 교환일기 만들기</h2>
                <TitleContainer>
                    <div style={{ float: "left", lineHeight: "38px", marginLeft: "10px" }}>
                        <label>제목</label>
                    </div>
                    <TitleInputBox
                        placeholder="제목을 입력해 주세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </TitleContainer>
                <TitleExampleBox backgroundImage={selectedCover ? require(`./image/${selectedCover}.png`) : null}>
                    <h1>{title || "제목"}</h1>
                    <h2>{today}</h2>
                    <h3>참여자1, 참여자2, ...</h3>
                </TitleExampleBox>
                <div>
                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ marginLeft: "15px" }}>표지 선택하기</label>
                    </div>
                    <TitleImageBox
                        backgroundImage={require('./image/coverImage2.png')}
                        onClick={() => handleCoverSelect('coverImage2')}
                    />
                    <TitleImageBox
                        backgroundImage={require('./image/coverImage3.png')}
                        onClick={() => handleCoverSelect('coverImage3')}
                    />
                    <TitleImageBox
                        backgroundImage={require('./image/coverImage4.png')}
                        onClick={() => handleCoverSelect('coverImage4')}
                    />
                    <TitleImageBox
                        backgroundImage={require('./image/coverImage5.png')}
                        onClick={() => handleCoverSelect('coverImage5')}
                    />
                </div>
                <CreateDiaryButton onClick={handleSave}>생성하기</CreateDiaryButton>
            </ModalContent>
        </ModalBackground>
    );
};

export default CreateSharedDiaryModal;