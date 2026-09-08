import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import Nav from "../nav/Nav";
import styled from "styled-components";
import Cookies from 'js-cookie';
import PageContainer from '../../components/layout/PageContainer';

const Container = styled(PageContainer).attrs({
  $maxWidth: '950px',
  $margin: '60px auto',
  $padding: '0 24px 40px',
})``;

const ApplicationButtonBox = styled.div`
  display: flex;
  margin: 20px 0;

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 18px;
    margin: 0 10px;
    padding: 10px 20px;
    border-bottom: none;
    color: gray;
  }
`;

const PageTitle = styled.div`
  text-align: center;
  font-family: Title;
  font-size: 30px;
`;

const ApplicationTabButton = styled.button`
  font-family: ${(props) => props.$active ? 'Title' : 'Content'} !important;
  color: ${(props) => props.$active ? 'black' : 'gray'} !important;
  border-bottom: ${(props) => props.$active ? '2px solid black' : 'none'} !important;
  font-size: ${(props) => props.$active ? '25px' : '19px'} !important;
`;

const ApplicationListBox = styled.div`
  padding: 30px 0px 25px 30px;
  border-bottom: 1px solid rgba(94, 120, 100, 1);
`;

const ApplicationItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const ApplicationInfo = styled.div`
  display: inline-block;
`;

const ApplicationActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const NicknameBox = styled.label`
    border: 2px solid rgba(172, 235, 193, 1);
  border-radius: 10px;
  padding: 2px 13px;
  font-family: Title;
  font-size: 27px;
  
`

const TitleBox = styled.div`
  margin-left: 30px;
  font-family: Title;
  font-size: 27px;
  display: inline-block;
`

const MessageBox = styled.div`
    margin: 10px 0px 0px 100px;
  font-family: Title;
  font-size: 20px;
`

const AcceptButton = styled.button`
  border: none;
  border-radius: 10px;
  color: white;
  width: 70px;
  height: 40px;
  font-size: 24px;
  font-family: Title;
   background-color:  rgba(94, 120, 100, 1);
  margin-top: 15px;
  margin-right: 20px;
  cursor: pointer;
`

const RefuseButton = styled.button`
  border: none;
  border-radius: 10px;
  color: black;
  width: 70px;
  height: 40px;
  font-size: 24px;
  font-family: Title;
   background-color:  rgba(219, 243, 244, 0.5);
  margin-right: 60px;
  margin-top: 15px;
  cursor: pointer;
`

const CancelButton = styled.button`
  border: none;
  border-radius: 10px;
  color: black;
  width: 70px;
  height: 40px;
  font-size: 24px;
  font-family: Title;
  background-color:  rgba(219, 243, 244, 0.5);
  margin-right: 60px;
  margin-top: 15px;
  text-align: center;
 cursor: pointer;
`

const ApplicationList = () => {
    const [activeButton, setActiveButton] = useState("received");
    const [applications, setApplications] = useState([]);

    const fetchApplications = useCallback(async () => {
        const token = Cookies.get('token');
        try {
            const response = await axios.get(`/api/shared-diary-applications/${activeButton}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications', error);
        }
    }, [activeButton]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleAccept = async (id) => {
        const token = Cookies.get('token');
        try {
            await axios.post(`/api/shared-diary-applications/accept/${id}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchApplications(); // 수락 후 목록 갱신
        } catch (error) {
            console.error('Error accepting application', error);
        }
    };

    const handleRefuse = async (id) => {
        const token = Cookies.get('token');
        try {
            await axios.delete(`/api/shared-diary-applications/refuse/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchApplications(); // 거절 후 목록 갱신
        } catch (error) {
            console.error('Error refusing application', error);
        }
    };

    const handleCancel = async (id) => {
        const token = Cookies.get('token');
        try {
            await axios.delete(`/api/shared-diary-applications/cancel/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchApplications(); // 거절 후 목록 갱신
        } catch (error) {
            console.error('Error refusing application', error);
        }
    };

    return (
        <div>
            <Nav />
            <Container>
                <PageTitle>
                    <label>신청 목록</label>
                </PageTitle>
                <ApplicationButtonBox>
                    <ApplicationTabButton
                        $active={activeButton === "received"}
                        onClick={() => setActiveButton("received")}
                    >
                        받은 신청
                    </ApplicationTabButton>
                    <ApplicationTabButton
                        $active={activeButton === "sent"}
                        onClick={() => setActiveButton("sent")}
                    >
                        보낸 신청
                    </ApplicationTabButton>
                </ApplicationButtonBox>
                <ApplicationListBox>
                    {applications.map(app => (
                        <ApplicationItem key={app.id}>
                            <ApplicationInfo>
                                <NicknameBox>
                                    {activeButton === "received" ? app.senderName : app.receiverName}
                                </NicknameBox>
                                <TitleBox>
                                    {app.sharedDiaryTitle}
                                </TitleBox>
                                <MessageBox>
                                    {app.message}
                                </MessageBox>
                            </ApplicationInfo>
                            <ApplicationActions>
                                {activeButton === "received" && (
                                    <>
                                        <RefuseButton onClick={() => handleRefuse(app.id)}>거절</RefuseButton>
                                        <AcceptButton onClick={() => handleAccept(app.id)}>수락</AcceptButton>
                                    </>
                                )}
                                {activeButton !== "received" && (
                                    <>
                                        <CancelButton onClick={() => handleCancel(app.id)}>취소</CancelButton>
                                    </>
                                )}
                            </ApplicationActions>
                        </ApplicationItem>
                    ))}
                </ApplicationListBox>
            </Container>
        </div>
    );
};

export default ApplicationList;
