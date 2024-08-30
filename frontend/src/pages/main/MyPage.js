import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getMonth, getYear, format, addMonths, subMonths } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Nav from "../nav/Nav";
import axios from "axios";
import Cookies from "js-cookie";
import * as PropTypes from "prop-types";

const Container = styled.div`
    margin: 0 auto;
  width: 1200px;
  text-align: center;
`


const InputContainer = styled.div`
    text-align: center;
    
`

const Input = styled.input`
  font-family: Content;
  width: 600px;
  height: 50px;
  border: none;
  background-color: rgba(184, 232, 234, 0.4);
  margin-top:30px;
  border-radius: 10px;
  color: black;
  padding-left: 20px;
  font-size: 18px;
`
const UpdateButton = styled.button`
  border: none;
  background-color: rgba(94, 120, 100, 1);
  width: 100px;
  height: 50px;
  border-radius: 10px;
  position: relative;
  right: 100px;
  top:2px;
  color: white;
  font-family: Title;
  font-size: 20px;
`

const MyPage = () => {

    return (
        <div>
            <Nav />
            <Container>
                <div style={{marginTop:"50px"}}>
                    <label style={{fontFamily:"title", fontSize:"40px"}}>내정보</label>
                </div>
                <InputContainer>
                    <Input placeholder={"비밀번호"} style={{marginLeft:"100px"}}/>
                    <UpdateButton>변경</UpdateButton>
                    <Input placeholder={"닉네임" } style={{marginLeft:"100px"}}/>
                    <UpdateButton>변경</UpdateButton>
                </InputContainer>
                <div style={{width:"100%", marginTop:"200px", textAlign:"center"}}>
                    <button
                        style={{width:"52%", height:"50px", backgroundColor:"rgba(94, 120, 100, 1)", border:"none",
                            color:"white", borderRadius:"10px", fontFamily:"Title", fontSize:"25px",cursor:"pointer"}}>저장하기</button>
                </div>
                <button style={{width:"52%", height:"50px", backgroundColor:"transparent", border:"none", marginTop:"20px",
                    color:"rgba(94, 120, 100, 1)", borderRadius:"10px", fontFamily:"Title", fontSize:"22px", cursor:"pointer"}}>회원 탈퇴</button>
            </Container>
        </div>
    );
};

export default MyPage;