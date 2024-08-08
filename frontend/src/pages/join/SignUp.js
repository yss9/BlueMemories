import React, { useState } from 'react';
import styled from "styled-components";
import { checkUserId, checkNickname, registerUser } from './api';
import { useNavigate } from "react-router-dom"; // API 호출 함수 임포트

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
  padding-top: 100px;
  padding-bottom: 40px;
  font-size: 30px;
`;

const InputBox = styled.input`
  width: 500px;
  height: 47px;
  font-family: Content;
  border: 0.5px solid #5E7864;
  border-radius: 10px;
  padding-left: 15px;
`;

const SignUpButton = styled.button`
  width: 500px;
  height: 50px;
  font-family: Title;
  font-size: 25px;
  color: white;
  border: 0;
  border-radius: 15px;
  background-color: #5E7864;
  margin-top: 50px;
  cursor: pointer;
`;

const Message = styled.div`
  height: 40px;
  padding-top: 5px;
  margin-bottom: -30px;
  font-size: 13px;
  color: ${props => (props.isError ? 'red' : 'rgba(94, 120, 100, 1)')};
  font-family: Content;
  text-align: left;
  padding-left: 15px;
  margin-left:60px;
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
`;

const SignUpForm = () => {
    const [userId, setUserId] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUserIdAvailable, setIsUserIdAvailable] = useState(null);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
    const [isPasswordValid, setIsPasswordValid] = useState(null);
    const [isPasswordMatch, setIsPasswordMatch] = useState(null);
    const [userIdError, setUserIdError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const navigate = useNavigate();

    const validateUserId = (userId) => {
        // 아이디는 영어와 숫자만 가능하고 최소 3글자 이상
        const isValid = /^[a-zA-Z0-9]{3,}$/.test(userId);
        setUserIdError(isValid ? '' : '아이디는 영어와 숫자만 사용 가능하며, 최소 3글자 이상이어야 합니다.');
        return isValid;
    };

    const validateNickname = (nickname) => {
        // 닉네임은 1글자에서 10자 이내
        const isValid = /^.{1,10}$/.test(nickname);
        setNicknameError(isValid ? '' : '닉네임은 1글자에서 10자 이내여야 합니다.');
        return isValid;
    };

    const validatePassword = (password) => {
        // 비밀번호 유효성 체크 (예: 최소 8자, 대문자, 소문자, 숫자 포함)
        const isValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
        setIsPasswordValid(isValid);
        return isValid;
    };

    const handleUserIdChange = async (e) => {
        const newUserId = e.target.value;
        setUserId(newUserId);
        if (validateUserId(newUserId)) {
            const available = await checkUserId(newUserId);
            setIsUserIdAvailable(available);
        } else {
            setIsUserIdAvailable(null);
        }
    };

    const handleNicknameChange = async (e) => {
        const newNickname = e.target.value;
        setNickname(newNickname);
        if (validateNickname(newNickname)) {
            const available = await checkNickname(newNickname);
            setIsNicknameAvailable(available);
        } else {
            setIsNicknameAvailable(null);
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (newPassword) {
            validatePassword(newPassword);
        } else {
            setIsPasswordValid(null);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        if (newConfirmPassword) {
            setIsPasswordMatch(newConfirmPassword === password);
        } else {
            setIsPasswordMatch(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUserIdAvailable && isNicknameAvailable && isPasswordValid && isPasswordMatch) {
            try {
                await registerUser(userId, nickname, password);
                alert('회원가입 성공');
                navigate('/signin');
            } catch (error) {
                alert('회원가입 실패');
            }
        } else {
            alert('입력값을 확인해주세요.');
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
                        <Message isError={!!userIdError || isUserIdAvailable === false}>
                            {userIdError || (isUserIdAvailable === false && '이미 사용 중인 아이디입니다.') || (isUserIdAvailable === true && '사용 가능한 아이디입니다.')}
                        </Message>
                    </InputContainer>
                    <InputContainer>
                        <InputBox
                            type="password"
                            placeholder="비밀번호(최소 8자리 이상, 소문자, 대문자 포함 )"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <Message isError={isPasswordValid === false}>
                            {isPasswordValid === false ? '비밀번호는 최소 8자, 대문자, 소문자, 숫자를 포함해야 합니다.' : isPasswordValid === true ? '사용할 수 있는 비밀번호입니다.' : ''}
                        </Message>
                    </InputContainer>
                    <InputContainer>
                        <InputBox
                            type="password"
                            placeholder="비밀번호 확인"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        <Message isError={isPasswordMatch === false}>
                            {isPasswordMatch === false ? '비밀번호가 일치하지 않습니다.' : isPasswordMatch === true ? '비밀번호가 일치합니다.' : ''}
                        </Message>
                    </InputContainer>
                    <InputContainer style={{marginTop:"5px"}}>
                        <InputBox
                            type="text"
                            placeholder="닉네임"
                            value={nickname}
                            onChange={handleNicknameChange}
                        />
                        <Message isError={!!nicknameError || isNicknameAvailable === false}>
                            {nicknameError || (isNicknameAvailable === false && '이미 사용 중인 닉네임입니다.') || (isNicknameAvailable === true && '사용 가능한 닉네임입니다.')}
                        </Message>
                    </InputContainer>
                    <div style={{fontSize:"15px", fontFamily:"Content", marginTop:"50px", paddingRight:"395px", marginBottom:"-35px"}}>
                        <input type="checkbox" /> 인증 약관 전체동의
                    </div>
                    <SignUpButton type="submit">회원가입</SignUpButton>
                </form>
            </FormBox>
        </Container>
    );
};

export default SignUpForm;