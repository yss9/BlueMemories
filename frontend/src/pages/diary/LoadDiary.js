import React, { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components';
import Nav from "../nav/Nav";
import backgroundImage from '../images/background.png';
import Cookies from "js-cookie";
import axios from "axios";
import happyImage from '../diary/images/happy.png';
import neutralImage from '../diary/images/neutral.png';
import sadImage from '../diary/images/sad.png';
import YouTube from 'react-youtube';
import notPushLikeImage from '../images/likeFalseButton.png';
import PushLikeImage from '../images/likeTrueButton.png';
import commentImage from '../images/commentbutton.png';
import refreshImage from '../images/refreshbutton.png';
import { getDiaryImageSrc } from '../../imageAssets';
import PageContainer from '../../components/layout/PageContainer';

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

const Container = styled(PageContainer).attrs({
  $maxWidth: '1000px',
  $padding: '20px',
  $minHeight: '100vh',
  $position: 'relative',
  $zIndex: 1,
})``;

const HeaderSpacer = styled.div`
  width: 100%;
  min-height: 20px;
`;

const TitleMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  margin-top: 30px;
`;

const TitleBox = styled.div`
  flex: 1 1 320px;
  min-height: 30px;
`;

const DiaryTitle = styled.label`
  font-family: Title;
  font-size: 40px;
`;

const SentimentRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  min-height: 40px;
`;

const ElementDiv = styled.div`
  width: 100px;
  display: inline-block;
  padding: 3px 20px;
  background-color: ${(props) => props.$backgroundColor};
`;

const SentimentImage = styled.img`
  width: 25px;
  margin-right: 10px;
`;

const SentimentBox = styled.div`
  display: inline-block;
  font-family: Content;

  label {
    font-family: Title;
    font-size: 20px;
  }
`;

const NicknameBox = styled.div`
  height: 20px;
  width: 100%;
  margin-top: 10px;
  font-family: Content;
  color: rgba(94, 120, 100, 1);
  font-size: 20px;
`;


const StateBox = styled.div`
  flex: 1 1 320px;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  color : rgba(94, 120, 100, 1);
  p {
    margin-left:18px;
    font-family: Title;
    font-size: 25px;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const StateValue = styled.p`
  font-family: Content !important;
  font-size: 18px !important;
  margin-right: ${(props) => props.$withGap ? '20px' : '0'};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.$hasImage ? 'row' : 'column')};
  gap: 20px;
  margin-top: 50px;
  min-height: 300px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageWrapper = styled.div`
  flex: 0 1 500px;
  margin: 10px 30px 10px 10px;
  max-width: 100%;

  img {
    display: block;
    width: 100%;
    max-width: 500px;
    height: auto;
    max-height: 300px;
    object-fit: contain;
  }
`;

const TextWrapper = styled.div`
  flex: 1;
  min-width: 0;
  font-family: Content;
  font-size: 20px;
  overflow-wrap: anywhere;
`;

const VideoContainer = styled.div`
  margin-top: 30px;
  text-align: center;

  iframe {
    width: 100%;
    max-width: 640px;
    height: 360px;
  }

  @media (max-width: 768px) {
    iframe {
      height: min(56.25vw, 360px);
    }
  }
`;

const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 130px;
  height: 30px;
  padding: 6px 10px;
  background-color: #566e56;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: Content;
  color: white;

`;

const RefreshIcon = styled.img`
  width: 18px;
  height: 18px;
`;


const RecommendBox = styled.div`
  width: 100%;
  margin-top: 60px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;

  label {
    font-family: Title;
    font-size: 25px;
    display: block;
    width: 100%;
  }

  p {
    font-family: Content;
    margin: 0 0 0 10px;
    max-width: 400px;
    flex: 1 1 280px;
  }

`;

const RecommendAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0 0 30px auto;
`;

const CommentContainer = styled.div`
  width: 100%;
  background-color: rgba(235, 243, 236, 1);
  border-radius: 15px;
  padding: clamp(24px, 5vw, 50px);
  margin-top: 50px;
  margin-bottom: 100px;
  box-sizing: border-box;

  p {
    display: inline-block;
    font-family: Content;
    margin-right: 40px;
  }
`;

const CommentInputBox = styled.textarea`
  background-color: rgba(255, 255, 255, 1);
  width: 100%;
  height: 80px;
  border: none;
  border-radius: 15px;
  text-align: left;
  vertical-align: top;
  padding: 20px;
  resize: none;
  box-sizing: border-box;
`;

const DiaryCommentBox = styled.div`
  margin-top: 40px;
`;

const CommentItem = styled.div`
  margin-bottom: 20px;
  font-family: Content;

  hr {
    width: 100% !important;
    max-width: 650px;
  }
`;

const CommentContent = styled.div`
  margin-left: 30px;
  margin-top: 20px;
`;

const CommentDivider = styled.hr`
  width: 100%;
  max-width: 650px;
  margin-top: 27px;
  background-color: rgba(94, 120, 100, 0.8);
`;

const CommentWriteButton = styled.button`
  background-color: rgba(94, 120, 100, 1);
  border: none;
  border-radius: 5px;
  width: 60px;
  height: 25px;
  font-family: Content;
  font-size: 14px;
  display: block;
  margin: 10px 20px 0 auto;
  color: white;
  z-index: 2;
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
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: Title;
  font-size: 20px;
  line-height: 1.4;
  margin-right: 10px;
`;

const CommentButtonDiv = styled.div`
  width: 70px;
  height: 25px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: Title;
  font-size: 22px;
  line-height: 1.3;
  margin-right: 10px;
`;

const CommentSummaryBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const ActionIcon = styled.img`
  height: 22px;
  flex: 0 0 auto;
`;

const LikeIcon = styled(ActionIcon)`
  cursor: pointer;
`;

const AttachmentImage = styled.img`
  display: block;
  width: 100%;
  max-width: 500px;
  height: auto;
  max-height: 300px;
  object-fit: contain;
`;



const DiaryPage = () => {
    const location = useLocation();
    const { id } = location.state;
    const [diary, setDiary] = useState(null);
    const [, setNickname] = useState('');
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLike, setIsLike] = useState(false);
    const likeImage = isLike?`${PushLikeImage}`:`${notPushLikeImage}`;

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

    const { title, content, weather, positive, neutral, likeNum, confidence, imageUrl, keyword1, keyword2, keyword3, keyword4 } = diary;

    const posit = Math.round(positive);
    const neut = Math.round(neutral);
    const negat = 100 - posit - neut;
    let sentiment = confidence;
    let todaySentiment = '';
    console.log(diary);
    if (sentiment === 'neutral') {
        todaySentiment = '보통인';
    } else if (sentiment === 'positive') {
        todaySentiment = '좋은';
    } else {
        todaySentiment = '안 좋은';
    }

    const keywords = [keyword1, keyword2, keyword3, keyword4];
    const diaryImageSrc = getDiaryImageSrc(imageUrl);
    const handleLikeSubmit = async () => {
        try {
            const token = Cookies.get('token');
            await axios.post('/api/push-like', {
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
                <HeaderSpacer>
                    <NicknameBox>{diary.nickname}의 일기</NicknameBox>
                </HeaderSpacer>
                <TitleMetaRow>
                    <TitleBox>
                        <DiaryTitle>{title}</DiaryTitle>
                    </TitleBox>
                    <StateBox>
                        <p>날씨</p>
                        <StateValue $withGap>{weather}</StateValue>
                        <p>날짜</p>
                        <StateValue>{diary.date}</StateValue>
                    </StateBox>
                </TitleMetaRow>
                <SentimentRow>
                    <ElementDiv $backgroundColor="rgba(179, 246, 202, 1)">
                        <SentimentImage src={happyImage} alt="" />
                        <SentimentBox>
                            <label>긍정</label> {posit}%
                        </SentimentBox>
                    </ElementDiv>
                    <ElementDiv $backgroundColor="rgba(184, 232, 234, 1)">
                        <SentimentImage src={neutralImage} alt="" />
                        <SentimentBox>
                            <label>중립</label> {neut}%
                        </SentimentBox>
                    </ElementDiv>
                    <ElementDiv $backgroundColor="rgba(124, 157, 132, 1)">
                        <SentimentImage src={sadImage} alt="" />
                        <SentimentBox>
                            <label>부정</label> {negat}%
                        </SentimentBox>
                    </ElementDiv>
                </SentimentRow>
                <ContentContainer $hasImage>
                    <ImageWrapper>
                        <AttachmentImage src={diaryImageSrc} alt="일기 첨부 이미지" />
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
                    <RecommendAction>
                        <RefreshButton onClick={handleRefresh}>
                            <RefreshIcon src={refreshImage} alt="" />
                            새로운 동영상 추천
                        </RefreshButton>
                    </RecommendAction>
                </RecommendBox>
                <VideoContainer>
                    <YouTube videoId={keywords[currentVideoIndex]}/>
                </VideoContainer>
                <CommentContainer>
                    <CommentSummaryBar>
                        <LikeButtonDiv onClick={handleLikeSubmit}>
                            <LikeIcon src={likeImage} alt="like" />
                            좋아요 &nbsp;{likeNum}
                        </LikeButtonDiv>
                        <CommentButtonDiv>
                            <ActionIcon src={commentImage} alt="" />
                            댓글 &nbsp;{comments.length}
                        </CommentButtonDiv>
                    </CommentSummaryBar>
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
                                <CommentContent>{comment.content}</CommentContent>
                                <CommentDivider />
                            </CommentItem>
                        ))}
                    </DiaryCommentBox>
                </CommentContainer>
            </Container>
        </BackGround>
    );
}
export default DiaryPage;
