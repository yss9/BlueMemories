import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Cookies from 'js-cookie';
import Nav from "../nav/Nav";
import CreateSharedDiaryModal from "./CreateSharedDiaryModal";
import {useNavigate} from "react-router-dom";
import { getSharedDiaryCoverSrc } from '../../imageAssets';
import PageContainer from '../../components/layout/PageContainer';

const Container = styled(PageContainer).attrs({
  $maxWidth: '1100px',
  $margin: '20px auto',
  $padding: '40px 24px 24px',
})`
  font-family: Content;
`;

const LabelContainer = styled.div`
  width: 100%;
  margin-bottom: 24px;
  text-align: center;
  font-family: Title;
  font-size: 30px;
`;

const SearchContainer = styled.div`
  width: 100%;
  min-height: 55px;
`;

const ApplicationContainer = styled.div`
  width: 100%;
  min-height: 60px;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SharedDiaryListContainer = styled.div`
  width: 100%;
  margin-top: 12px;
  padding: 8px 4px 20px;
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ApplicationListButton = styled.button`
  background-color: rgba(232, 232, 232, 1);
  width: 120px;
  height: 45px;
  border: none;
  border-radius: 8px;
  font-size: 25px;
  font-family: Title;
  cursor: pointer;
`;

const LabelBox = styled.label`
  font-family: Title;
  font-size: 25px;
`;

const WriteSharedDiaryButton = styled.button`
  border: none;
  background-color: rgba(94, 120, 100, 1);
  height: 35px;
  width: 150px;
  border-radius: 8px;
  font-family: Title;
  font-size: 25px;
  color: white;
  cursor: pointer;
`;

const SharedDiaryList = styled.div`
  flex: 0 0 clamp(260px, 80vw, 340px);
  height: 340px;
  background-color: #61dafb;
  border-radius: 8px;
  position: relative;
  background-image: ${props => props.$backgroundImage ? `linear-gradient(180deg, rgba(255,255,255,0.84), rgba(255,255,255,0.12) 48%, rgba(0,0,0,0.28)), url(${props.$backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  padding: 22px;
  box-sizing: border-box;
  vertical-align: top;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.16);
  }

  h2 {
    margin: 0;
    font-family: Title;
    font-size: 28px;
    line-height: 1.25;
    color: #243327;
    word-break: keep-all;
  }

  p {
    margin: 8px 0 0;
    font-family: Content;
    font-size: 15px;
    color: #4d5f52;
  }
`;

const SharedDiaryPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sharedDiaries, setSharedDiaries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSharedDiaries();
    }, []);

    const fetchSharedDiaries = async () => {
        const token = Cookies.get('token');  // 쿠키에서 토큰 가져오기
        try {
            const response = await axios.get('/api/list-shared-diary', {
                headers: {
                    Authorization: `Bearer ${token}`  // 헤더에 토큰 추가
                }
            });
            setSharedDiaries(response.data);
        } catch (error) {
            console.error('Error fetching shared diaries', error);
        }
    };


    const handleApplicationList = () =>{
        navigate('/applications')
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSharedDiary = (id, title) => {
        navigate(`/shared-diary-list`,{state:{ id: id , titles:title} }); // id를 경로에 포함하여 페이지 이동
    }

    return (
        <div>
            <Nav />
            <Container>
                <LabelContainer>
                    친구를 찾아서 교환일기 신청을 해 보세요.
                </LabelContainer>
                <SearchContainer>
                    <ApplicationListButton  onClick={handleApplicationList} >신청 목록</ApplicationListButton>
                </SearchContainer>
                <ApplicationContainer>
                    <LabelBox>진행 중인 교환일기 목록</LabelBox>
                    <WriteSharedDiaryButton onClick={openModal}>+ 교환일기 만들기</WriteSharedDiaryButton>
                    <CreateSharedDiaryModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        onCreated={fetchSharedDiaries}
                    />
                </ApplicationContainer>
                <SharedDiaryListContainer>
                    {sharedDiaries.map(diary => (
                        <SharedDiaryList
                            key={diary.id}
                            $backgroundImage={getSharedDiaryCoverSrc(diary.coverImageUrl)}
                            onClick={() => handleSharedDiary(diary.id, diary.title)}
                        >
                            <h2>{diary.title}</h2>
                            <p>{diary.createdAt}</p>
                        </SharedDiaryList>
                    ))}
                </SharedDiaryListContainer>
            </Container>
        </div>
    );
};

export default SharedDiaryPage;
