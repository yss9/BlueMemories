import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import axios from 'axios';
import Nav from "../nav/Nav";
import Modal from "./Modal";


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
  
`

const SearchContainer = styled.div`
  text-align: center;
    width: 100%;
  height: 55px;
  margin-top: -20px;
  
`

const ApplicationContainer = styled.div`
  width: 100%;
  height: 60px;
  margin-top: 45px;
  
`

const SharedDiaryListContainer = styled.div`
  width: 100%;
  height: 470px;
  padding-left: 15px;
  
`

const SearchInput = styled.input`
  border: 1px solid rgba(94, 120, 100, 1);
  border-radius: 10px;
  width: 450px;
  height: 45px;
`
const ApplicationListButton = styled.button`
    background-color: rgba(232, 232, 232, 1);
  margin-left: 30px;
  width: 120px;
  height: 45px;
  border: none;
  border-radius: 10px;
  font-size: 25px;
  font-family: Title;
`

const LabelBox = styled.label`
  font-family: Title;
  font-size: 25px;
`

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
`

const SharedDiaryList = styled.div`
  display: inline-block;
  margin-right: 30px;
  width: 370px;
  height: 370px;
    background-color: #61dafb;
  border-radius: 10px;
  
`

const SharedDiaryPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return(
      <div>
          <Nav/>
          <Container>
            <LabelContainer>
                친구를 찾아서 교환일기 신청을 해 보세요.
            </LabelContainer>
              <SearchContainer>
                <SearchInput></SearchInput>
                  <ApplicationListButton>신청 목록</ApplicationListButton>
              </SearchContainer>
              <ApplicationContainer>
                    <LabelBox>진행 중인 공유일기 목록</LabelBox>
                      <WriteSharedDiaryButton onClick={openModal}>+ 일기장 생성하기</WriteSharedDiaryButton>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
              </ApplicationContainer>
              <SharedDiaryListContainer>
                  <SharedDiaryList></SharedDiaryList>
                  <SharedDiaryList></SharedDiaryList>
                  <SharedDiaryList></SharedDiaryList>
              </SharedDiaryListContainer>
          </Container>
      </div>
    );
};

export default SharedDiaryPage;