import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Cookies from 'js-cookie';
import {useLocation} from "react-router-dom";
import closeImage from "../images/closebButton.png";
import searchImage from "../images/searchButton.png";

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  height: 400px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;

const CloseButton = styled.button`
  width: 25px;
  height: 25px;
  background-color: transparent;
  background-image: url("${closeImage}");
  background-size: cover;
  border: none;
  float: right;
  cursor: pointer;
`

const InputContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 15px;
  margin-bottom: 10px;
  color: black;
  font-family: Content;
  border: 1px solid rgba(94, 120, 100, 1);
  border-radius: 5px;
  height: 20px;
`;

const SearchButton = styled.button`
  width: 25px;
  height: 25px;
  background-color: transparent;
  background-image: url("${searchImage}");
  background-size: cover;
  border: none;
  cursor: pointer;
  position: absolute;
  margin-left: 365px;
  margin-top: 9px;
`;

const Message = styled.p`
  color: ${props => (props.isError ? 'red' : 'black')};
  font-family: Title;
  margin-top: 10px;
  font-size: 30px;
  padding-bottom: 20px;
  span{
    font-family: Content;
    font-size: 20px;
  }
  border-bottom: 1px solid rgba(94, 120, 100, 1);
`;

const InviteButton = styled.button`
  padding: 10px;
  background-color: ${props => (props.disabled ? '#ccc' : '#566e56')};
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-top: 20px;
  width: 100%;
`;

const InviteMemberModal = ({ member,sharedDiaryId, onClose }) => {
    const [receiverId, setReceiverId] = useState('');
    const [message, setMessage] = useState('');
    const [inviteMessage, setInviteMessage] = useState('');
    const [isMemberFound, setIsMemberFound] = useState(false);
    const [existMember, setExistMember] = useState('');
    const handleSearch = async () => {
        const token = Cookies.get('token');
        try {
            const response = await axios.get(`/api/search-member?receiverId=${receiverId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            let receiver = response.data;

            if (receiver === member) {
                setMessage('본인은 초대할 수 없습니다.');
                setIsMemberFound(false);
            }
            else if(response.data){
                setMessage(response.data);
                setExistMember('@'+receiverId);
                setIsMemberFound(true);
            }
            else {
                setMessage('존재하지 않는 아이디입니다.');
                setIsMemberFound(false);
            }
        } catch (error) {
            setMessage('검색 중 오류가 발생했습니다.');
            setIsMemberFound(false);
        }
    };

    const handleInvite = async () => {
        const token = Cookies.get('token');
        try {
            await axios.post(
                '/api/shared-diary-applications/invite',
                { receiverId, sharedDiaryId, inviteMessage },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('초대가 성공적으로 완료되었습니다.');
            onClose(); // 초대 후 모달을 닫음
        } catch (error) {
            alert('초대 중 오류가 발생했습니다.');
        }
    };

    return (
        <ModalContainer>
            <div style={{width:"100%", height:"50px", textAlign:"center", fontFamily:"Title", fontSize:"30px"}}>
                친구초대
                <CloseButton onClick={onClose}></CloseButton>
            </div>
            <InputContainer>
                <SearchInput
                    type="text"
                    placeholder="아이디로 검색"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                />
                <SearchButton onClick={handleSearch}></SearchButton>
                {message && <Message isError={!isMemberFound}>{message} <span>{existMember}</span></Message>}
                <textarea
                    placeholder="메시지를 작성해주세요"
                    value={inviteMessage}
                    onChange={(e)=>setInviteMessage(e.target.value)}
                    style={{
                        resize: "none",
                        border:"none",
                        backgroundColor:"rgba(184, 232, 234, 0.5)",
                        borderRadius:"10px",
                        height:"100px",
                        padding:"10px",
                        color:"black",

                    }}
                />
            </InputContainer>
            <InviteButton onClick={handleInvite} disabled={!isMemberFound}>
                전송하기
            </InviteButton>
        </ModalContainer>
    );
};

export default InviteMemberModal;