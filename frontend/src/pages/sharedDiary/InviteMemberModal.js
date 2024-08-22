import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Cookies from 'js-cookie';
import {useLocation} from "react-router-dom";

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SearchButton = styled.button`
  padding: 10px;
  background-color: #566e56;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Message = styled.p`
  color: ${props => (props.isError ? 'red' : 'green')};
  margin-top: 10px;
  font-size: 14px;
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
`;

const InviteMemberModal = ({ member,sharedDiaryId, onClose }) => {
    const [receiverId, setReceiverId] = useState('');
    const [message, setMessage] = useState('');
    const [inviteMessage, setInviteMessage] = useState('');
    const [isMemberFound, setIsMemberFound] = useState(false);
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
                setMessage('존재하는 아이디입니다.');
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
            <button style={{
                width: "20px",
                height: "20px",
                backgroundColor: "transparent",
                border: "2px solid rgba(94, 120, 100, 1)",
                float: "right",
                borderRadius: "50%",
                fontWeight: "bold",
                paddingLeft: "4px",
                color: "rgba(94, 120, 100, 1)",
                cursor: "pointer"
            }} onClick={onClose}>X</button>
            <InputContainer>
                <SearchInput
                    type="text"
                    placeholder="닉네임으로 검색"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                />
                <SearchButton onClick={handleSearch}>검색</SearchButton>
                {message && <Message isError={!isMemberFound}>{message}</Message>}
                <input
                    type="text"
                    placeholder="메시지를 입력하세요"
                    value={inviteMessage}
                    onChange={(e)=>setInviteMessage(e.target.value)}
                />
            </InputContainer>
            <InviteButton onClick={handleInvite} disabled={!isMemberFound}>
                초대하기
            </InviteButton>
        </ModalContainer>
    );
};

export default InviteMemberModal;