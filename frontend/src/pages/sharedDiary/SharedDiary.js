import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Cookies from 'js-cookie';
import Nav from "../nav/Nav";
import CreateSharedDiaryModal from "./CreateSharedDiaryModal";
import {useNavigate} from "react-router-dom";

const Container = styled.div`
  padding-top: 40px;
  margin: 20px auto;
  width: 1200px;
  height: 650px;
  font-family: Content;
`;

const LabelContainer = styled.div`
  width: 100%;
  height: 70px;
  margin-top: -10px;
  margin-bottom: 10px;
  text-align: center;
  font-family: Title;
  font-size: 30px;
`;

const SearchContainer = styled.div`
  text-align: center;
  width: 100%;
  height: 55px;
  margin-top: -20px;
`;

const ApplicationContainer = styled.div`
  width: 100%;
  height: 60px;
  margin-top: 45px;
`;

const SharedDiaryListContainer = styled.div`
  width: 100%;
  height: 370px;
  padding-left: 15px;
  overflow-x: scroll;  /* 가로 스크롤 허용 */
  overflow-y: hidden;  /* 세로 스크롤 숨김 */
  white-space: nowrap; /* 리스트를 가로로 일렬로 배치 */

  &::-webkit-scrollbar {
    display: none;  /* 스크롤바 숨김 */
  }
`;

const SearchInput = styled.input`
  border: 1px solid rgba(94, 120, 100, 1);
  border-radius: 10px;
  width: 450px;
  height: 45px;
`;

const ApplicationListButton = styled.button`
  background-color: rgba(232, 232, 232, 1);
  margin-left: 30px;
  width: 120px;
  height: 45px;
  border: none;
  border-radius: 10px;
  font-size: 25px;
  font-family: Title;
  cursor: pointer;
`;

const LabelBox = styled.label`
  font-family: Title;
  font-size: 25px;
`;

const WriteSharedDiaryButton = styled.button`
  float: right;
  border: none;
  background-color: rgba(94, 120, 100, 1);
  height: 35px;
  width: 150px;
  border-radius: 10px;
  font-family: Title;
  font-size: 25px;
  color: white;
  cursor: pointer;
`;

const SharedDiaryList = styled.div`
  display: inline-block;
  margin-right: 20px;
  width: 350px;
  height: 350px;
  background-color: #61dafb;
  border-radius: 10px;
  position: relative;
  background-image: ${props => props.backgroundImage ? `url(${props.backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  padding: 10px;
  text-align: center;
  vertical-align: top; /* 리스트가 세로로 정렬되지 않게 조정 */
  p{
    margin-left: 220px;
  }
  cursor: pointer;
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
                    <SearchInput placeholder="친구를 검색하세요" />
                    <ApplicationListButton  onClick={handleApplicationList} >신청 목록</ApplicationListButton>
                </SearchContainer>
                <ApplicationContainer>
                    <LabelBox>진행 중인 공유일기 목록</LabelBox>
                    <WriteSharedDiaryButton onClick={openModal}>+ 일기장 생성하기</WriteSharedDiaryButton>
                    <CreateSharedDiaryModal isOpen={isModalOpen} onClose={closeModal} />
                </ApplicationContainer>
                <SharedDiaryListContainer>
                    {sharedDiaries.map(diary => (
                        <SharedDiaryList key={diary.id} backgroundImage={diary.coverImageUrl} onClick={() => handleSharedDiary(diary.id, diary.title)}>
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