import React from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
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
    
`

const TitleInputBox = styled.input`
  margin-left: 20px;
    background-color: transparent;
  line-height: 36px;
  border: none;
  width: 70%;
  font-size: 18px;
  
  font-family: Content;
  
`

const CreateDiaryButton = styled.div`
  background-color: rgba(94, 120, 100, 1);
  text-align: center;
  font-family: Content;
  border: none;
  border-radius: 10px;
  height: 50px;
  color: white;
  line-height: 50px;
`

const TitleImageBox = styled.div`
  margin-left: 15px;
  display: inline-block;
  border-radius: 5px;
    width: 50px;
  height: 50px;
  background-color: red;
  margin-bottom: 10px;
`

const TitleExampleBox = styled.div`
  margin: 20px 0px 20px 45px;
  height: 300px;
  width: 300px;
    background-color: blue;
`

const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <ModalBackground onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <button style={{width:"20px",height:"20px", backgroundColor:"transparent", border:"2px solid rgba(94, 120, 100, 1)", float:"right",
                borderRadius:"50%", fontWeight:"bold",paddingLeft:"4px", color:"rgba(94, 120, 100, 1)", cursor:"pointer"}} onClick={onClose}>X</button>
                <h2 style={{textAlign:"center"}}>새로운 교환일기 만들기</h2>
                <TitleContainer>
                    <div style={{float:"left", lineHeight:"38px", marginLeft:"10px"}}>
                        <label>제목</label>
                    </div>
                    <TitleInputBox placeholder="제목을 입력해 주세요"/>
                </TitleContainer>
                <TitleExampleBox></TitleExampleBox>
                <div>
                    <div style={{marginBottom:"5px"}}>
                        <label style={{marginLeft:"-320px"}}>표지선택하기</label>
                    </div>
                    <TitleImageBox></TitleImageBox>
                    <TitleImageBox></TitleImageBox>
                    <TitleImageBox></TitleImageBox>
                    <TitleImageBox></TitleImageBox>
                </div>
                <CreateDiaryButton>생성하기</CreateDiaryButton>
            </ModalContent>
        </ModalBackground>
    );
};

export default Modal;