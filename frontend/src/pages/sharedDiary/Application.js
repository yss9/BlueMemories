import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from "../nav/Nav";
import styled from "styled-components";
import Cookies from 'js-cookie';

const Container = styled.div`
  margin: 60px auto;
  width: 950px;
`;

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

const ApplicationListBox = styled.div`
  padding: 30px 0px 25px 30px;
  border-bottom: 1px solid rgba(94, 120, 100, 1);
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
  float: right;
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
  float: right;
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
  float: right;
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

    useEffect(() => {
        fetchApplications();
    }, [activeButton]);

    const fetchApplications = async () => {
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
    };

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
                <div style={{ textAlign: "center", fontFamily: "Title", fontSize: "30px" }}>
                    <label>신청 목록</label>
                </div>
                <ApplicationButtonBox>
                    <button
                        style={{
                            fontFamily: activeButton === "received" ? "Title" : "Content",
                            color: activeButton === "received" ? "black" : "gray",
                            borderBottom: activeButton === "received" ? "2px solid black" : "none",
                            fontSize: activeButton === "received" ? "25px" : "19px"
                        }}
                        onClick={() => setActiveButton("received")}
                    >
                        받은 신청
                    </button>
                    <button
                        style={{
                            fontFamily: activeButton === "sent" ? "Title" : "Content",
                            color: activeButton === "sent" ? "black" : "gray",
                            borderBottom: activeButton === "sent" ? "2px solid black" : "none",
                            fontSize: activeButton === "sent" ? "25px" : "19px"
                        }}
                        onClick={() => setActiveButton("sent")}
                    >
                        보낸 신청
                    </button>
                </ApplicationButtonBox>
                <ApplicationListBox>
                    {applications.map(app => (
                        <div key={app.id} style={{ marginBottom: '10px'}}>
                            <div style={{display:"inline-block"}}>
                                <NicknameBox>
                                    {activeButton === "received" ? app.senderName : app.receiverName}
                                </NicknameBox>
                                <TitleBox>
                                    {app.sharedDiaryTitle}
                                </TitleBox>
                                <MessageBox>
                                    {app.message}
                                </MessageBox>
                            </div>
                            <div style={{display:"inline-block", float:"right"}}>
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
                            </div>
                        </div>
                    ))}
                </ApplicationListBox>
            </Container>
        </div>
    );
};

export default ApplicationList;