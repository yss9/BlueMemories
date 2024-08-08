import React, { useState } from 'react';
import styled from 'styled-components';
import { signInUser } from './api';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Container = styled.div`
  text-align: center;
  margin: 0 auto;
  width: 660px;
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
  width: 480px;
  height: 45px;
  font-family: Content;
  border: 0.5px solid #B8E8EA;
  background-color: rgba(184, 232, 234, 0.5);
  border-radius: 10px;
  padding-left: 15px;
`;

const SignInButton = styled.button`
  cursor:pointer;
  width: 500px;
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
  color: ${props => (props.isError ? 'red' : 'green')};
  font-family: Content;
`;

const FindBox = styled.div`
  display: inline-block;
  font-family: Content;
  font-size: 15px;
`;

const InputContainer = styled.div``;

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
            Cookies.set('token', token); // JWT 토큰을 쿠키에 저장
            console.log(token)
            alert('로그인 성공');
            navigate('/main'); // 로그인 후 이동할 페이지
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
                    <InputContainer style={{ marginTop: "10px" }}>
                        <InputBox
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </InputContainer>
                    <Message isError={!!errorMessage}>
                        {errorMessage}
                    </Message>
                    <div style={{ fontFamily: "Content", fontSize: "15px", marginRight: "430px", marginTop: "-20px" }}>
                        <input type="checkbox" />로그인 유지
                    </div>
                    <SignInButton type="submit" >로그인</SignInButton>
                </form>
                <div style={{ paddingLeft: "50px", paddingRight: "50px" }}>
                    <FindBox style={{ marginRight: "300px" , cursor:"pointer"}}
                            onClick={handleGoSignUp}>회원가입</FindBox>
                    <FindBox>아이디 찾기 </FindBox>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <FindBox>비밀번호 찾기</FindBox>
                </div>
                <div
                    style={{
                        width: "500px",
                        textAlign: "center",
                        borderBottom: "1px solid #aaa",
                        lineHeight: "0.1em",
                        marginLeft: "80px",
                        marginTop: "50px"
                    }}
                >
                    <span style={{ fontSize: "15px", background: "#fff", padding: "0 10px", fontFamily: "Content" }}>간편 로그인</span>
                </div>
            </FormBox>
        </Container>
    );
};

export default SignInForm;