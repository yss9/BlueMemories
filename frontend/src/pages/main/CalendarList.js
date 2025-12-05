import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getMonth, getYear, format, addMonths, subMonths } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Nav from "../nav/Nav";
import axios from "axios";
import Cookies from "js-cookie";
import happyImage from '../sharedDiary/image/happy.png';
import sadImage from '../sharedDiary/image/sad.png';
import neutralImage from '../sharedDiary/image/neutral.png';
import calendarImage from '../images/calendar.png';

const Container = styled.div`
  padding-top: 40px;
  margin: 0 auto;
  width: 1050px;
  font-family: Content;
`;

const HeaderContainer = styled.div`
  text-align: center;
  padding: 10px 20px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #5e7864;
  font-size: 15px;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-family: Content;
`;

const Select = styled.select`
  margin-left: 5px;
  margin-right: 5px;
  font-size: 20px;
  border: none;
  background: transparent;
  font-family: Content;
  cursor: pointer;
`;

const ListContainer = styled.div`
  margin-top: 20px;
`;

const ListItem = styled.div`
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  display: flex;
  padding: 20px 20px;
  &:hover {
    background-color: #f9f9f9;
  }
`;

const ListItemText = styled.div`
  width: 70%;
  margin-right: 10%;
  height: 100%;
`;

const ListItemTitle = styled.div`
  font-size: 25px;
  font-family: Title;
  margin-top: -20px;
  margin-bottom: 20px;
`;

const ListItemDate = styled.div`
  font-size: 15px;
  display: inline-block;
`;

const ListItemSummary = styled.div`
  font-size: 18px;
  margin-top: 20px;
  font-family: Content;
`;

const SentimentBox = styled.div`
  position: relative;
  background-color: rgba(179, 246, 202, 1);
  padding: 10px 5px 8px 15px;
  width: 110px;
  height: 15px;
  display: inline-block;
  font-family: Content;
  border-radius: 10px;
  left: 300px;
  top: 50px;
  img {
    padding-right: 20px;
    width: 25px;
    height: 12px;
  }
`;

const CalendarButton = styled.button`
  background-image: url("${calendarImage}");
  background-size: cover;
  width: 25px;
  height: 25px;
  border: none;
  background-color: transparent;
  position: relative;
  left: 198px;
  top:18px;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 300px;
  height: 30px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
  font-family: Content;
`;

const SearchButton = styled.button`
  background-color: #5e7864;
    font-family: Content;
  color: white;
  font-size: 20px;
  border: none;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
`;

const SearchSelect = styled.select`
  font-size: 15px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-left: 10px;
  cursor: pointer;
  font-family: Content;
`;

const CalendarListPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('title'); // 기본값: 제목으로 검색
    const navigate = useNavigate();

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
        fetchDiaryEntriesForMonth(currentDate);
    }, [currentDate]);

    const fetchDiaryEntriesForMonth = async (date) => {
        try {
            const token = Cookies.get('token');
            const year = getYear(date);
            const month = getMonth(date) + 1; // getMonth is zero-indexed

            const response = await axios.get(`/api/diaries/${year}/${month}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setDiaryEntries(response.data);

        } catch (error) {
            console.error("Failed to fetch diary entries:", error);
        }
    };

    const handlePrevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const handleYearChange = (event) => {
        const newYear = parseInt(event.target.value, 10);
        setCurrentDate(new Date(newYear, currentDate.getMonth()));
    };

    const handleMonthChange = (event) => {
        const newMonth = parseInt(event.target.value, 10);
        setCurrentDate(new Date(currentDate.getFullYear(), newMonth));
    };

    const handleListItemClick = (id, date) => {
        navigate(`/view-diary`, {state: {id, date}});
    };

    const handleCalendar = () => {
        navigate('/calendar');
    };

    const handleSearch = async () => {
        const token = Cookies.get('token');
        try {
            let response;
            if (searchType === 'title') {
                response = await axios.get(`/api/search/title`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        keyword: searchQuery
                    }
                });
            } else if (searchType === 'content') {
                response = await axios.get(`/api/search/content`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        keyword: searchQuery
                    }
                });
            }
            setDiaryEntries(response.data);
        } catch (error) {
            console.error("Failed to search diary entries:", error);
        }
    };

    return (
        <div>
            <Nav/>
            <Container>
                <HeaderContainer>
                    <Button style={{color: "black", backgroundColor: "white"}} onClick={handlePrevMonth}>&lt;</Button>
                    <Select value={getYear(currentDate)} onChange={handleYearChange}>
                        {Array.from({length: 100}, (_, i) => getYear(new Date()) - 40 + i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </Select>
                    <Select value={getMonth(currentDate)} onChange={handleMonthChange}>
                        {Array.from({length: 12}, (_, i) => i).map(month => (
                            <option key={month} value={month}>{month + 1}</option>
                        ))}
                    </Select>
                    <Button style={{color: "black", backgroundColor: "white"}} onClick={handleNextMonth}>&gt;</Button>
                    <CalendarButton onClick={handleCalendar}></CalendarButton>
                </HeaderContainer>

                <SearchContainer>
                    <SearchSelect value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                        <option value="title">제목으로 검색</option>
                        <option value="content">내용으로 검색</option>
                    </SearchSelect>
                    <SearchInput
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <SearchButton onClick={handleSearch}>검색</SearchButton>
                </SearchContainer>

                <ListContainer>
                    {diaryEntries.length > 0 ? (
                        diaryEntries.map(entry => (
                            <ListItem key={entry.id} onClick={() => handleListItemClick(entry.id, entry.date)}>
                                <ListItemText>
                                    <SentimentBox>
                                        <img
                                            src={getImageForSentiment(entry.confidencePositive, entry.confidenceNeutral, entry.confidenceNegative)}
                                            alt="sentiment image"/>
                                        {resultSentiment(entry.sentiment, entry.confidencePositive, entry.confidenceNeutral, entry.confidenceNegative)}
                                    </SentimentBox>
                                    <ListItemTitle>{entry.title}</ListItemTitle>
                                    <ListItemDate>{format(new Date(entry.date), 'yyyy-MM-dd')}</ListItemDate>
                                    <ListItemSummary>{entry.content.substring(0, 150)}...</ListItemSummary>
                                </ListItemText>
                                <div style={{width: "200px", height: "200px"}}>
                                    <img src={entry.imageUrl} style={{maxWidth: "200px", maxHeight: "200px"}}
                                         alt="diary"/>
                                </div>
                            </ListItem>
                        ))
                    ) : (
                        <p>이 달에는 작성된 일기가 없습니다.</p>
                    )}
                </ListContainer>
            </Container>
        </div>
    );
}
export default CalendarListPage;