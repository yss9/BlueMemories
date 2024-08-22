import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from "../nav/Nav";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import styled from 'styled-components';
import InviteMemberModal from "./InviteMemberModal";
import addMemberImage from "./image/addMemberImage.png"

const Container = styled.div`
  margin: 0 auto;
  width: 1100px;
`;

const Header = styled.div`
    margin-top: 70px;
  text-align: center;
  
`;

const TitleBox = styled.div`
  font-family: Title;
  display: inline-block;
  font-size:40px;
`

const SearchContainer = styled.div`
  margin-bottom: 20px;
  display: inline-block;
  justify-content: center;
  gap: 10px;

  input {
    width: 350px;
    height: 20px;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid rgba(94, 120, 100, 1);
    box-shadow: 0px 0px 2px 0px rgba(172, 235, 193, 0.8);

  }

  select {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  button {
    padding: 8px 15px;
    border-radius: 5px;
    background-color: #566e56;
    color: white;
    border: none;
    cursor: pointer;
  }
`;

const ContentList = styled.div`
  width: 100%;
`;

const ContentItem = styled.div`
  width: 100%;
  height: 220px;
  margin-bottom: 15px;
  padding:30px 0;
  border-bottom: 1px solid black;
`;

const ImageBox = styled.div`
  display: inline-block;
  float:right;
  width: auto;
  height: 100%;
  max-width: 100%;
`

const ContentImage = styled.img`
  display: inline-block;
  max-height: 100%;
  max-width: 100%;
`;

const CreateContentButton = styled.button`
    border: none;
  background-color: rgba(94, 120, 100, 1);
  color: white;
  border-radius: 10px;
  padding: 10px 30px;
  font-family: Content;
  float: right;
  font-size: 15px;
  cursor: pointer;
`;

const ContentBox = styled.div`
  display: inline-block;
    width: 70%;
  height: 100%;
  
`

const Nickname = styled.label`
  font-family: Title;
  font-size: 27px;
  width: 100%;
  border: 3px solid rgba(172, 235, 193, 1);
  border-radius: 15px;
  padding: 0 15px;
    
`
const Title = styled.div`
  display: inline-block;
  font-family: Title;
  font-size: 30px;
  margin-left:15px;
`
const Date = styled.div`
  display: inline-block;
  font-family: Content;
  font-size: 15px;
  float: right;
  margin-right: 150px;
`
const SentimentBox = styled.div`
  display: inline-block;
  float: right;
  font-family: Content;
`

const Content = styled.div`
  font-family: Content;
  margin-top: 25px;
  line-height: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
`
const JoinMemberBox = styled.div`
    display: inline-block;
  margin-left: 200px;
  position: absolute;
  width: 120px;
  background-color: rgba(232, 232, 232, 1);
  border-radius: 10px;
`

const JoinMemberButton = styled.button`
    background-color: transparent;
  border: none;
  font-family: Title;
  font-size: 21px;
  line-height: 1.5;
  padding-left: 30px;
  cursor: pointer;
  
`

const SharedDiaryContentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id, titles } = location.state; // 교환일기장의 id를 가져옴

    const [contents, setContents] = useState([]); // 교환일기장 컨텐츠를 저장할 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [searchType, setSearchType] = useState('title'); // 검색 유형 (title, content, nickname)
    const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리
    const [members, setMembers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

    useEffect(() => {
        fetchDiaryContents();
        fetchDiaryMembers();
    }, []);

    const fetchDiaryContents = async () => {
        const token = Cookies.get('token'); // 인증 토큰 가져오기
        try {
            const response = await axios.get(`/api/shared-diary-content/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setContents(response.data); // 응답받은 데이터를 contents 상태에 저장
        } catch (error) {
            console.error('Error fetching diary contents', error);
        } finally {
            setLoading(false); // 로딩 완료
        }
    };

    const fetchDiaryMembers = async () => {
        const token = Cookies.get('token'); // 인증 토큰 가져오기
        try {
            const response = await axios.get(`/api/shared-diary-members/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching diary members', error);
        } finally {
            setLoading(false);
        }
    };

    const handleContentWrite = () => {
        navigate('/write-shared-diary', { state: { id: id } });
    };

    const handleSearch = async () => {
        const token = Cookies.get('token'); // 인증 토큰 가져오기
        try {
            let response;
            if (searchType === 'title') {
                response = await axios.get(`/api/shared-diary-content/search/title`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        title: searchQuery
                    }
                });
            } else if (searchType === 'content') {
                response = await axios.get(`/api/shared-diary-content/search/content`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        content: searchQuery
                    }
                });
            } else if (searchType === 'nickname') {
                response = await axios.get(`/api/shared-diary-content/search/nickname`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        nickname: searchQuery
                    }
                });
            }
            setContents(response.data); // 검색 결과를 contents 상태에 저장
        } catch (error) {
            console.error('Error searching diary contents', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInvite = (id, nickname) => {

    };

    return (
        <div>
            <Nav />
            <Container>
                <Header>
                    <TitleBox>{titles}</TitleBox>
                    <JoinMemberBox>
                        <img src={addMemberImage} style={{width:"23px", position:"absolute", right:"80px", top:"5px"}} />
                        <JoinMemberButton onClick={openModal}>멤버 추가</JoinMemberButton>
                    </JoinMemberBox>
                    <div style={{ fontFamily: "Content", marginTop: "10px", marginBottom: "20px" }}>
                        {members.map((member, index) => (
                            <span key={index}>
                                {member}
                                {index < members.length - 1 && ', '}
                            </span>
                        ))}
                        <span>&nbsp; 참여 중</span>
                    </div>
                    <div>
                        <SearchContainer>
                            <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                                <option value="title">제목</option>
                                <option value="content">내용</option>
                                <option value="nickname">닉네임</option>
                            </select>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="검색어를 입력하세요"
                            />
                            <button onClick={handleSearch}>검색</button>
                        </SearchContainer>
                        <CreateContentButton onClick={handleContentWrite}>일기 쓰기</CreateContentButton>
                    </div>
                </Header>
                <div>
                    {loading ? (
                        <p>로딩 중...</p>
                    ) : contents.length > 0 ? (
                        <ContentList>
                            {contents.map(content => (
                                <ContentItem key={content.id}>
                                    <ContentBox>
                                        <Nickname>{content.nickname}</Nickname>
                                        <div style={{ marginTop: "20px" }}>
                                            <Title>{content.title} 별 헤는 밤</Title>
                                            <SentimentBox>{content.sentiment}</SentimentBox>
                                            <Date>{content.date}</Date>
                                            <Content>{content.content}</Content>
                                        </div>
                                    </ContentBox>
                                    <ImageBox>
                                        {content.imageUrl && (
                                            <ContentImage src={content.imageUrl} alt="일기 이미지" />
                                        )}
                                    </ImageBox>
                                </ContentItem>
                            ))}
                        </ContentList>
                    ) : (
                        <p>작성된 일기가 없습니다.</p>
                    )}
                </div>
            </Container>
            {isModalOpen && (
                <InviteMemberModal
                    sharedDiaryId={id}
                    member = {members[0]}
                    onClose={closeModal}
                    onInvite={handleInvite}
                />
            )}
        </div>
    );
}

export default SharedDiaryContentPage;