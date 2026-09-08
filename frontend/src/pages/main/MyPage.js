import React from 'react';
import styled from 'styled-components';
import Nav from "../nav/Nav";
import PageContainer from '../../components/layout/PageContainer';

const Container = styled(PageContainer).attrs({
  $maxWidth: '1200px',
  $padding: '40px 24px',
  $textAlign: 'center',
})``;


const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 30px;
`

const PageTitleBlock = styled.div`
  margin-top: 50px;
`;

const PageTitle = styled.label`
  font-family: title;
  font-size: 40px;
`;

const FieldRow = styled.div`
  width: 100%;
  max-width: 720px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Input = styled.input`
  font-family: Content;
  width: 100%;
  max-width: 600px;
  height: 50px;
  border: none;
  background-color: rgba(184, 232, 234, 0.4);
  border-radius: 10px;
  color: black;
  padding-left: 20px;
  font-size: 18px;
  box-sizing: border-box;
`
const UpdateButton = styled.button`
  border: none;
  background-color: rgba(94, 120, 100, 1);
  width: 100px;
  height: 50px;
  border-radius: 10px;
  color: white;
  font-family: Title;
  font-size: 20px;
`

const ActionSection = styled.div`
  width: 100%;
  margin-top: 200px;
  text-align: center;
`;

const BaseActionButton = styled.button`
  width: 52%;
  height: 50px;
  border: none;
  border-radius: 10px;
  font-family: Title;
  cursor: pointer;
`;

const SaveButton = styled(BaseActionButton)`
  background-color: rgba(94, 120, 100, 1);
  color: white;
  font-size: 25px;
`;

const WithdrawButton = styled(BaseActionButton)`
  background-color: transparent;
  margin-top: 20px;
  color: rgba(94, 120, 100, 1);
  font-size: 22px;
`;

const MyPage = () => {

    return (
        <div>
            <Nav />
            <Container>
                <PageTitleBlock>
                    <PageTitle>내정보</PageTitle>
                </PageTitleBlock>
                <InputContainer>
                    <FieldRow>
                        <Input placeholder={"비밀번호"} />
                        <UpdateButton>변경</UpdateButton>
                    </FieldRow>
                    <FieldRow>
                        <Input placeholder={"닉네임" } />
                        <UpdateButton>변경</UpdateButton>
                    </FieldRow>
                </InputContainer>
                <ActionSection>
                    <SaveButton>저장하기</SaveButton>
                </ActionSection>
                <WithdrawButton>회원 탈퇴</WithdrawButton>
            </Container>
        </div>
    );
};

export default MyPage;
