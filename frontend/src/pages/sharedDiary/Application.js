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
  label {
    display: inline-block;
    width: 100px;
    font-family: Content;
  }

  button {
    margin-left: 10px;
    padding: 5px 10px;
    cursor: pointer;
  }
`;

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
                        <div key={app.id} style={{ marginBottom: '10px' }}>
                            <label>{activeButton === "received" ? app.senderName : app.receiverName}</label>
                            <label>{app.sharedDiaryTitle}</label>
                            <label>{app.message}</label>
                            {activeButton === "received" && (
                                <>
                                    <button onClick={() => handleAccept(app.id)}>수락</button>
                                    <button onClick={() => handleRefuse(app.id)}>거절</button>
                                </>
                            )}
                        </div>
                    ))}
                </ApplicationListBox>
            </Container>
        </div>
    );
};

export default ApplicationList;