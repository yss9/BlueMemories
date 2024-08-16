import React, { useState } from 'react';
import Nav from "../nav/Nav";
import styled from "styled-components";

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
                    <label>닉네임</label>
                    <label>제목</label>
                    <label>설명</label>
                    <button>수락</button>
                    <button>거절</button>
                </ApplicationListBox>
            </Container>
        </div>
    );
};

export default ApplicationList;