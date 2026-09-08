import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Cookies from "js-cookie";
import {
    DEFAULT_SHARED_DIARY_COVER,
    getSharedDiaryCoverSrc,
    sharedDiaryCoverOptions
} from '../../imageAssets';

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
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: min(420px, calc(100vw - 32px));
  box-sizing: border-box;
  position: relative;
`;

const TitleContainer = styled.div`
  border-radius: 8px;
  height: 40px;
  background-color: rgba(184, 232, 234, 0.5);
  display: flex;
  align-items: center;
  padding: 0 14px;
  box-sizing: border-box;
`;

const TitleInputBox = styled.input`
  margin-left: 16px;
  background-color: transparent;
  border: none;
  width: 100%;
  font-size: 18px;
  font-family: Content;
  outline: none;
`;

const CreateDiaryButton = styled.div`
  background-color: rgba(94, 120, 100, 1);
  text-align: center;
  font-family: Content;
  border: none;
  border-radius: 8px;
  height: 50px;
  color: white;
  line-height: 50px;
  cursor: pointer;
  margin-top: 10px;
`;

const TitleImageBox = styled.div`
  display: block;
  border-radius: 5px;
  width: 50px;
  height: 50px;
  background-image: ${props => props.$backgroundImage ? `url(${props.$backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border: 3px solid ${props => props.$selected ? 'rgba(94, 120, 100, 1)' : 'transparent'};
  box-sizing: border-box;
`;

const TitleExampleBox = styled.div`
  margin: 20px auto;
  aspect-ratio: 1 / 1;
  width: min(300px, 100%);
  background-image: ${props => props.$backgroundImage ? `linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.18) 48%, rgba(0,0,0,0.28)), url(${props.$backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  padding: 18px;
  box-sizing: border-box;
  color: black;
  text-align: left;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  h1{
    font-size: 20px;
    margin: 0;
    word-break: keep-all;
  }
  h2{
    font-size: 15px;
    margin: 8px 0 0;
    font-weight: lighter;
  }
  h3{
    margin: 0;
    font-size: 13px;
    text-align: right;
  }
`;

const CoverOptionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 12px 0 18px;
`;

const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  background-color: transparent;
  border: 2px solid rgba(94, 120, 100, 1);
  border-radius: 50%;
  font-weight: bold;
  color: rgba(94, 120, 100, 1);
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
`;

const ModalTitle = styled.h2`
  text-align: center;
  margin: 0 0 22px;
`;

const CreateSharedDiaryModal = ({ isOpen, onClose, onCreated }) => {
    const [selectedCover, setSelectedCover] = useState(DEFAULT_SHARED_DIARY_COVER);
    const [title, setTitle] = useState('');
    const today = new Date().toLocaleDateString();

    if (!isOpen) return null;

    const handleCoverSelect = (coverKey) => {
        setSelectedCover(coverKey);
    };

    const handleSave = async () => {
        const diaryData = {
            title,
            coverImageUrl: selectedCover || DEFAULT_SHARED_DIARY_COVER,
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
            if (onCreated) {
                onCreated();
            }
            onClose();
        } catch (error) {
            console.error("Error creating diary", error);
            alert("Failed to create diary.");
        }
    };

    return (
        <ModalBackground onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>X</CloseButton>
                <ModalTitle>새로운 교환일기 만들기</ModalTitle>
                <TitleContainer>
                    <div>
                        <label>제목</label>
                    </div>
                    <TitleInputBox
                        placeholder="제목을 입력해 주세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </TitleContainer>
                <TitleExampleBox $backgroundImage={getSharedDiaryCoverSrc(selectedCover)}>
                    <h1>{title || "제목"}</h1>
                    <h2>{today}</h2>
                    <h3>참여자1, 참여자2, ...</h3>
                </TitleExampleBox>
                <div>
                    <div>
                        <label>표지 선택하기</label>
                    </div>
                    <CoverOptionList>
                    {sharedDiaryCoverOptions.map((cover) => (
                        <TitleImageBox
                            key={cover.key}
                            $backgroundImage={cover.image}
                            $selected={selectedCover === cover.key}
                            onClick={() => handleCoverSelect(cover.key)}
                        />
                    ))}
                    </CoverOptionList>
                </div>
                <CreateDiaryButton onClick={handleSave}>생성하기</CreateDiaryButton>
            </ModalContent>
        </ModalBackground>
    );
};

export default CreateSharedDiaryModal;
