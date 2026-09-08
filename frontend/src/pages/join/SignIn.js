import React, { useState } from 'react';
import styled from 'styled-components';
import { signInUser } from './api';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../authToken';
import PageContainer from '../../components/layout/PageContainer';

const Container = styled(PageContainer).attrs({
  $maxWidth: '660px',
  $padding: '0 24px 40px',
  $textAlign: 'center',
})`
  text-align: center;
`;

const FormBox = styled.div`
  font-size: 20px;
  border: 0;
  background-color: transparent;
  text-align: center;
`;

const LogoBox = styled.div`
  padding-top: 130px;
  padding-bottom: 40px;
  font-size: 30px;
`;

const InputBox = styled.input`
  width: 100%;
  max-width: 480px;
  height: 45px;
  font-family: Content;
  border: 0.5px solid #B8E8EA;
  background-color: rgba(184, 232, 234, 0.5);
  border-radius: 10px;
  padding-left: 15px;
  box-sizing: border-box;
`;

const SignInButton = styled.button`
  cursor:pointer;
  width: 100%;
  max-width: 500px;
  height: 45px;
  font-family: Title;
  font-size: 25px;
  color: white;
  border: 0;
  border-radius: 10px;
  background-color: #5E7864;
  margin-top: 40px;
  margin-bottom: 30px;
`;

const Message = styled.div`
  height: 30px;
  padding-top: 5px;
  font-size: 13px;
  color: ${props => (props.$isError ? 'red' : 'green')};
  font-family: Content;
`;

const FindBox = styled.div`
  display: inline-block;
  font-family: Content;
  font-size: 15px;
  margin-right: ${(props) => props.$spaced ? '300px' : '0'};
  cursor: ${(props) => props.$clickable ? 'pointer' : 'default'};
`;

const InputContainer = styled.div``;

const PasswordInputContainer = styled(InputContainer)`
  margin-top: 10px;
`;

const KeepLoginRow = styled.div`
  font-family: Content;
  font-size: 15px;
  max-width: 500px;
  margin: -20px auto 0;
  text-align: left;
`;

const LinkRow = styled.div`
  padding-left: 50px;
  padding-right: 50px;
`;

const SimpleLoginDivider = styled.div`
  width: 100%;
  max-width: 500px;
  text-align: center;
  border-bottom: 1px solid #aaa;
  line-height: 0.1em;
  margin: 50px auto 0;
`;

const SimpleLoginText = styled.span`
  font-size: 15px;
  background: #fff;
  padding: 0 10px;
  font-family: Content;
`;

const SignInForm = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleGoSignUp = () =>{
      navigate('/signup');
    };

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await signInUser(userId, password);
            setToken(token); // JWT 토큰을 쿠키에 저장
            alert('로그인 성공');
            navigate('/'); // 로그인 후 이동할 페이지
        } catch (error) {
            setErrorMessage('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
        }
    };

    return (
        <Container>
            <LogoBox>BlueMemories</LogoBox>
            <FormBox>
                <form onSubmit={handleSubmit}>
                    <InputContainer>
                        <InputBox
                            type="text"
                            placeholder="아이디"
                            value={userId}
                            onChange={handleUserIdChange}
                        />
                    </InputContainer>
                    <PasswordInputContainer>
                        <InputBox
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </PasswordInputContainer>
                    <Message $isError={!!errorMessage}>
                        {errorMessage}
                    </Message>
                    <KeepLoginRow>
                        <input type="checkbox" />로그인 유지
                    </KeepLoginRow>
                    <SignInButton type="submit" >로그인</SignInButton>
                </form>
                <LinkRow>
                    <FindBox $spaced $clickable onClick={handleGoSignUp}>회원가입</FindBox>
                    <FindBox>아이디 찾기 </FindBox>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <FindBox>비밀번호 찾기</FindBox>
                </LinkRow>
                <SimpleLoginDivider>
                    <SimpleLoginText>간편 로그인</SimpleLoginText>
                </SimpleLoginDivider>
            </FormBox>
        </Container>
    );
};

export default SignInForm;
