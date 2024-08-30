import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from "../nav/Nav";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import styled from 'styled-components';
import InviteMemberModal from "./InviteMemberModal";
import addMemberImage from "./image/addMemberImage.png"
import happyImage from "./image/happy.png";
import neutralImage from "./image/neutral.png";
import sadImage from "./image/sad.png";
import memberImage from "./image/memberImage.png";
import searchImage from "../images/searchButton.png"

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
  margin-left: 200px;
  input {
    width: 450px;
    height: 20px;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid rgba(94, 120, 100, 1);
    box-shadow: 0px 0px 2px 0px rgba(172, 235, 193, 0.8);

  }

  select {
    
    border-radius: 10px;
    border: 2px solid #ddd;
  }

  button {
    position: relative;
    top:10px;
    right: 40px;
    background-image: url("${searchImage}");
    background-color: transparent;
    background-size: cover;
    width: 30px;
    height: 30px;
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
  cursor: pointer;
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
  width: 130px;
  padding: 10px 30px;
  margin-right: 150px;
  margin-top: 5px;
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
  margin-right: 50px;
`
const SentimentBox = styled.div`
  float: right;
  margin-top: -8px;
  background-color: ${(props) => {
    switch (props.sentiment) {
      case 'positive':
        return 'rgba(179, 246, 202, 1)'; // 예: 긍정적인 감정일 때
      case 'neutral':
        return 'rgba(184, 232, 234, 1)'; // 예: 중립적인 감정일 때
      case 'negative':
        return 'rgba(124, 157, 132, 1)'; // 예: 부정적인 감정일 때
    }
  }};
  padding:10px 0px 8px 20px;
  width: 130px;
  height: 20px;
  display: inline-block;
  font-family: Content;
  border-radius: 10px;
  img{
    padding-right: 20px;
    width: 30px;
    height: 15px;
  }
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

const MemberListBox = styled.div`
  font-family: Content;
  margin-top: 10px;
  margin-bottom: 20px;
  p{
    display: inline-block;
  }
`

const SearchSelect = styled.select`
  width: 100px;
  height: 40px;
  padding: 0 10px;
  font-size: 16px;
  font-family: Content;
  margin-right: 10px;
  position: relative;
  cursor: pointer;
`;

const SortSelectBox = styled.div`
  margin-bottom: 20px;
  width: 100%;
`

const SortSelect = styled.select`
  float: left;
    border: 2px solid rgba(232, 232, 232, 1);
  font-family: Title;
  padding: 5px 20px 5px 10px;
  font-size: 20px;
  border-radius: 10px;
  
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
    const [sortType, setSortType] = useState('desc'); // 기본값은 내림차순
    function resultSentiment(s, a, b, c) {
        const sentiments = {
            positive: "긍정 ",
            neutral: "중립 ",
            negative: "부정 "
        };

        const sent = sentiments[s] || "부정 ";
        const confSent = Math.round(Math.max(a, b, c));

        return sent + confSent + "%";
    }

    function getImageForSentiment(a, b, c) {
        const maxConfidence = Math.max(a, b, c);

        if (maxConfidence === a) {
            return `${happyImage}`;
        } else if (maxConfidence === b) {
            return `${neutralImage}`;
        } else {
            return `${sadImage}`;
        }
    }

    useEffect(() => {
        fetchDiaryContents();
        fetchDiaryMembers();
    }, [sortType]); // sortType이 변경될 때마다 fetchDiaryContents를 호출

    const fetchDiaryContents = async () => {
        const token = Cookies.get('token'); // 인증 토큰 가져오기
        try {
            const response = await axios.get(`/api/shared-diary-content/${id}/${sortType}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setContents(response.data); // 정렬된 데이터를 contents 상태에 저장
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
        // Invite member logic
    };

    const handleDiaryClick = (id) => {
        navigate('/load-shared-diary-content', { state: { id: id } });
    };


    return (
        <div>
            <Nav />
            <Container>
                <Header>
                    <TitleBox>{titles}</TitleBox>
                    <JoinMemberBox>
                        <img src={addMemberImage} style={{ width: "23px", position: "absolute", right: "80px", top: "5px" }} />
                        <JoinMemberButton onClick={openModal}>멤버 추가</JoinMemberButton>
                    </JoinMemberBox>

                    <MemberListBox>
                        <img src={memberImage} style={{ width: "22px", position: "absolute", left: "620px", top: "190px" }} />
                        {members.length > 0 && members.map((member, index) => (
                            <p key={index}>
                                {member}
                                {index < members.length - 1 && ', '}
                            </p>
                        ))}
                        <span>&nbsp; 참여 중</span>
                    </MemberListBox>
                    <div>
                        <SearchContainer>
                            <SearchSelect value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                                <option value="title">제목</option>
                                <option value="content">내용</option>
                                <option value="nickname">닉네임</option>
                            </SearchSelect>
                            <input style={{ fontFamily: "Content", height: "23px" }}
                                   type="text"
                                   value={searchQuery}
                                   onChange={(e) => setSearchQuery(e.target.value)}
                                   placeholder="검색어를 입력하세요"
                            />
                            <button onClick={handleSearch}></button>
                        </SearchContainer>
                        <CreateContentButton onClick={handleContentWrite}>일기 쓰기</CreateContentButton>
                    </div>
                    <SortSelectBox>
                        <SortSelect value={sortType} onChange={(e) => setSortType(e.target.value)}>
                            <option value="desc">최근 날짜순</option>
                            <option value="asc">오래된 날짜순</option>
                        </SortSelect>
                    </SortSelectBox>
                </Header>
                <div>
                    {loading ? (
                        <p>로딩 중...</p>
                    ) : contents.length > 0 ? (
                        <ContentList>
                            {contents.map(content => (
                                <ContentItem key={content.id} onClick={() => handleDiaryClick(content.id)}>
                                    <ContentBox>
                                        <Nickname>{content.nickname}</Nickname>
                                        <div style={{ marginTop: "20px" }}>
                                            <Title>{content.title}</Title>
                                            <SentimentBox sentiment={content.sentiment}>
                                                <img
                                                    src={getImageForSentiment(content.confidencePositive, content.confidenceNeutral, content.confidenceNegative)}
                                                    alt="sentiment image"
                                                />
                                                {resultSentiment(content.sentiment, content.confidencePositive, content.confidenceNeutral, content.confidenceNegative)}
                                            </SentimentBox>
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
                    member={members[0]}
                    onClose={closeModal}
                    onInvite={handleInvite}
                />
            )}
        </div>
    );
}

export default SharedDiaryContentPage;