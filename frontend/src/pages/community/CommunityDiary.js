import React, { useEffect, useState } from 'react';
import {redirect, useLocation} from 'react-router-dom';
import styled from 'styled-components';
import Nav from "../nav/Nav";
import backgroundImage from '../images/background.png';
import Cookies from "js-cookie";
import axios from "axios";
import happyImage from '../diary/images/happy.png';
import neutralImage from '../diary/images/neutral.png';
import sadImage from '../diary/images/sad.png';
import YouTube from 'react-youtube';
import likeImage from '../images/likebutton.png';
import commentImage from '../images/commentbutton.png';
import refreshImage from '../images/refreshbutton.png';

const BackGround = styled.div`
  background-image: url(${backgroundImage});
  background-size: 60%;
  background-repeat: repeat;
  width: 100%;
  min-height: 100vh;
  position: relative;
  top: 0;
  left: 0;
`;

const Container = styled.div`
  margin: 0 auto;
  width: 90%;
  max-width: 900px;
  padding-top: 30px;
  position: relative;
  z-index: 1;
  padding: 20px;
  box-sizing: border-box;
  min-height: 100vh;
`;

const ElementDiv = styled.div`
  margin-right: 20px;
  display: inline-block;
  float: right;
`;

const SentimentImage = styled.img`
  width: 25px;
  margin-right: 80px;
`;

const SentimentBox = styled.div`
  padding-left: 17px;
  font-family: Content;
  label {
    font-family: Title;
    font-size: 20px;
    padding-right: 20px;
  }
`;

const NicknameBox = styled.div`
  height: 20px;
  width: 100%;
  margin-top: 10px;
  font-family: Content;
  font-size: 20px;
`;

const ContentContainer = styled.div`
  flex-direction: ${(props) => (props.hasImage ? 'row' : 'column')};
  gap: 20px;
  margin-top: 50px;
  min-height: 300px;
  max-height: 600px;
`;

const ImageWrapper = styled.div`
  display: inline-block;
  float: left;
  margin: 10px 30px 10px 10px;
  max-width: 500px;
  max-height: 300px;
`;

const TextWrapper = styled.div`
  font-family: Content;
  font-size: 20px;
`;

const VideoContainer = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const RefreshButton = styled.button`
  display: inline-block;
  width: 130px;
  height: 30px;
  margin-top: 20px;
  padding: 6px 0px 20px 30px;
  background-color: #566e56;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: Content;
  color: white;

`;

const StateBox = styled.div`
  width: 100%;
  margin-top: 20px;

  div {
    display: inline-block;
    font-family: Title;
    font-size: 25px;
  }
`;

const RecommendBox = styled.div`
  width: 100%;
  margin-top: 100px;
  
  label {
    font-family: Title;
    font-size: 25px;
    display: block;
  }

  p {
    font-family: Content;
    margin-left: 10px;
    width: 400px;
    display: inline-block;
  }
`;

const CommentContainer = styled.div`
  width: 90%;
  background-color: rgba(235, 243, 236, 1);
  border-radius: 15px;
  padding: 50px;
  margin-top: 50px;
  margin-bottom: 100px;

  p {
    display: inline-block;
    font-family: Content;
    margin-right: 40px;
  }
`;

const DiaryInfoBox = styled.div``;

const CommentInputBox = styled.textarea`
  background-color: rgba(255, 255, 255, 1);
  width: 95%;
  height: 80px;
  border: none;
  border-radius: 15px;
  text-align: left;
  vertical-align: top;
  padding: 20px;
  resize: none;
`;

const DiaryCommentBox = styled.div`
  margin-top: 40px;
`;

const CommentItem = styled.div`
  margin-bottom: 20px;
  font-family: Content;
`;

const CommentWriteButton = styled.button`
    background-color: rgba(94, 120, 100, 1);
  border: none;
  border-radius: 5px;
  width: 60px;
  height: 25px;
  font-family: Content;
  font-size: 14px;
  margin-left: 78%;
  margin-top: -30px;
  color: white;
  z-index: 2;
  position: absolute;
  cursor: pointer;
`;

const CommentNicknameBox = styled.label`
    background-color: white;
  border: 2px solid rgba(94, 120, 100, 1);
  border-radius: 15px;
  padding: 3px 15px;
  font-family: Title;
  
`;

const LikeButtonDiv = styled.div`
  cursor: pointer;
  width: 70px;
  height: 25px;
  display: inline-block;
  font-family: Title;
  padding-left: 35px;
  font-size: 20px;
  line-height: 1.4;
  margin-right: 10px;
`;

const CommentButtonDiv = styled.div`
  width: 70px;
  height: 25px;
  display: inline-block;
  font-family: Title;
  padding-left: 35px;
  font-size: 22px;
  line-height: 1.3;
  margin-right: 10px;
`;



const CommunityDiaryPage = () => {
    const location = useLocation();
    const { id } = location.state;
    const [diary, setDiary] = useState(null);
    const [nickname, setNickname] = useState('');
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLike, setIsLike] = useState(false);


    useEffect(() => {
        const token = Cookies.get('token');

        // Fetch diary by date
        axios.get(`/api/get-diary/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setDiary(response.data);
            })
            .catch((error) => {
                console.error('Failed to fetch diary:', error);
            });

        axios.get(`/api/get-like/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setIsLike(response.data);
            })
            .catch((error) => {
                console.error('Failed to fetch diary:', error);
            });

        // Fetch user info
        axios.get('/api/user-info', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setNickname(response.data.nickname);
            })
            .catch((error) => {
                console.error('Failed to fetch user info:', error);
            });


        // Fetch comments
        axios.get(`/api/get-comments/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setComments(response.data);
            })
            .catch((error) => {
                console.error('Failed to fetch comments:', error);
            });
    }, [id]);

    const handleRefresh = () => {
        if (diary) {
            if (currentVideoIndex < 3){
                setCurrentVideoIndex(currentVideoIndex+1);
            }
            else{
                setCurrentVideoIndex(0);
            }
        }
    };

    const handleCommentSubmit = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.post('/api/create-comment', {
                diaryId: diary.id,
                content: newComment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setComments([...comments, response.data]);
            setNewComment('');
            window.location.reload(); // 페이지 새로고침
        } catch (error) {
            console.error("Failed to post comment: ", error);
        }
    };

    if (!diary) return <div>Loading...</div>;

    const { title, content, weather, negative, positive, neutral, likeNum, sentiment, imageUrl, keyword1, keyword2, keyword3, keyword4 } = diary;

    const posit = Math.round(positive);
    const neut = Math.round(neutral);
    const negat = 100 - posit - neut;

    let todaySentiment = '';
    if (sentiment === 'neutral') {
        todaySentiment = '보통인';
    } else if (sentiment === 'positive') {
        todaySentiment = '좋은';
    } else {
        todaySentiment = '안 좋은';
    }

    const keywords = [keyword1, keyword2, keyword3, keyword4];
    const handleLikeSubmit = () => {
        try {
            const token = Cookies.get('token');
            const response = axios.post('/api/push-like', {
                diaryId: id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            window.location.reload(); // 페이지 새로고침
        } catch (error) {
            console.error("Failed to post comment: ", error);
        }
    };



    return (
        <BackGround>
            <Nav/>
            <Container>
                <div style={{width: '100%', height: '40px'}}>
                    <ElementDiv>
                        <SentimentImage src={sadImage}></SentimentImage>
                        <SentimentBox>
                            <label>부정</label> {negat}%
                        </SentimentBox>
                    </ElementDiv>
                    <ElementDiv>
                        <SentimentImage src={neutralImage}></SentimentImage>
                        <SentimentBox>
                            <label>중립</label> {neut}%
                        </SentimentBox>
                    </ElementDiv>
                    <ElementDiv>
                        <SentimentImage src={happyImage}></SentimentImage>
                        <SentimentBox>
                            <label>긍정</label> {posit}%
                        </SentimentBox>
                    </ElementDiv>
                </div>
                <div style={{width: '100%', height: '20px'}}>
                    <NicknameBox>{diary.nickname}님의 일기</NicknameBox>
                </div>
                <div style={{width: '100%', height: '30px', marginTop: '30px'}}>
                    <label style={{fontFamily: 'Title', fontSize: '40px'}}>{title}</label>
                </div>
                <StateBox>
                    <div>날씨</div>
                    <div style={{marginLeft: '30px', fontFamily: 'Content', fontSize: '18px'}}>{weather}</div>
                    <div style={{float: 'right', marginRight: '150px'}}>
                        <div>날짜</div>
                        <div style={{marginLeft: '30px', fontFamily: 'Content', fontSize: '18px'}}>{diary.date}</div>
                    </div>
                </StateBox>
                <ContentContainer hasImage={Boolean(imageUrl)}>
                    <ImageWrapper hasImage={Boolean(imageUrl)}>
                        {imageUrl && (
                            <img src={imageUrl} alt="Diary attachment" style={{maxWidth: '500px', maxHeight: '300px'}}/>
                        )}
                    </ImageWrapper>
                    <TextWrapper>
                        {content ? (
                            content.split('\n').map((line, index) => (
                                <span key={index}>
          {line}
                                    <br/>
        </span>
                            ))
                        ) : (
                            <span>No content available</span>
                        )}
                    </TextWrapper>
                </ContentContainer>
                <RecommendBox>
                    <label>오늘의 추천</label>
                    <p>기분이 {todaySentiment} 날 아래의 동영상을 시청해보는 것이 어떨까요?</p>
                    <div style={{float:"right", width:"200px", marginTop:"0px", marginBottom:"30px", display:"inline-block"}}>
                        <img src={refreshImage} style={{marginTop:"25px", marginLeft:"10px", position:"absolute", width:"18px"}}/>
                        <RefreshButton onClick={handleRefresh}>
                            새로운 동영상 추천
                        </RefreshButton>
                    </div>
                </RecommendBox>
                <VideoContainer>
                    <YouTube videoId={keywords[currentVideoIndex]}/>
                </VideoContainer>
                <CommentContainer>
                    <div style={{marginBottom:"20px"}}>
                        <div>
                            <img onClick={handleLikeSubmit} src={likeImage} style={{height:"22px",position:"absolute", marginTop:"4px", marginLeft:"8px", cursor:"pointer"}}/>
                        </div>
                        <LikeButtonDiv onClick={handleLikeSubmit}>
                            좋아요 &nbsp;{likeNum}
                        </LikeButtonDiv>
                        <img src={commentImage} style={{height:"22px",position:"absolute", marginTop:"4px", marginLeft:"8px"}}/>
                        <CommentButtonDiv>
                            댓글 &nbsp;{comments.length}
                        </CommentButtonDiv>
                    </div>
                    <CommentInputBox
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 남겨보세요"
                    />
                    <CommentWriteButton onClick={handleCommentSubmit}>등록</CommentWriteButton>
                    <DiaryCommentBox>
                        {comments.map((comment, index) => (
                            <CommentItem key={index}>
                                <CommentNicknameBox>{comment.nickname}</CommentNicknameBox>
                                <div style={{marginLeft:"30px", marginTop:"20px"}}>{comment.content}</div>
                                <hr style={{width:"650px", marginTop:"27px", backgroundColor:"rgba(94, 120, 100, 0.8)"}}/>
                            </CommentItem>
                        ))}
                    </DiaryCommentBox>
                </CommentContainer>
            </Container>
        </BackGround>
    );
}
export default CommunityDiaryPage;
