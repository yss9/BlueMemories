import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getMonth, getYear, startOfMonth, endOfMonth, startOfWeek, addDays, addMonths, subMonths, setMonth, setYear, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Nav from "../nav/Nav";
import axios from "axios";
import Cookies from "js-cookie";
import happyImage from '../images/happy.png';
import sadImage from '../images/sad.png';
import neutralImage from '../images/neutral.png';
import normalImage from '../images/default.png';

const moodImages = {
    positive: happyImage,
    negative: sadImage,
    neutral: neutralImage,
    normal: normalImage
};

const Container = styled.div`
  padding-top: 40px;
  text-align: center;
  margin: 20px auto;
  width: 650px;
  font-family: Content;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
`;

const Button = styled.button`
  background-color: #5e7864;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-family: Content;
`;

const YearMonthDisplay = styled.div`
  display: flex;
  align-items: center;
  font-family: 'Title';
  font-size: 24px;
  cursor: pointer;
  margin-left: -50px;
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

const DaysContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px;
  padding: 10px;
`;

const DayTile = styled.div`
  width: 100%;
  padding-top: 100%; /* Aspect ratio 1:1 */
  position: relative;
  background-image: ${props => `url(${props.moodImage || moodImages.normal})`};
  background-size: cover;
  background-position: center;
  border-radius: 25px;
  color: ${props => (props.isWeekend ? (props.isSunday ? 'rgba(159, 0, 0, 1)' : 'rgba(4, 0, 179, 1)') : 'rgba(0, 0, 0, 1)')};
  font-size: 25px;
  text-align: center;
  cursor: pointer;
`;

const DayContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WeekdaysContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px;
  padding: 10px;
  font-weight: bold;
`;

const WeekdayTile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  color: ${props => (props.isWeekend ? (props.isSunday ? 'rgba(159, 0, 0, 1)' : 'rgba(4, 0, 179, 1)') : 'rgba(0, 0, 0, 1)')};
`;

const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [diaryEntries, setDiaryEntries] = useState({});
    const navigate = useNavigate();

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

            const entries = response.data.reduce((acc, { id, date, sentiment }) => {
                acc[date] = { id, sentiment };  // id와 sentiment 모두 저장
                return acc;
            }, {});
            setDiaryEntries(entries);
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
        setCurrentDate(setYear(currentDate, newYear));
    };

    const handleMonthChange = (event) => {
        const newMonth = parseInt(event.target.value, 10);
        setCurrentDate(setMonth(currentDate, newMonth));
    };

    const handleDayClick = (day) => {
        const formattedDate = format(day, 'yyyy-MM-dd');
        const entry = diaryEntries[formattedDate];
        if (entry) {
            navigate(`/view-diary`, { state: { id: entry.id, date: formattedDate } });
        } else {
            navigate(`/write-diary`, { state: { date: formattedDate } });
        }
    };

    const renderWeekdays = () => {
        return weekdays.map((day, index) => (
            <WeekdayTile key={index} isWeekend={index === 0 || index === 6} isSunday={index === 0}>
                {day}
            </WeekdayTile>
        ));
    };

    const renderDays = () => {
        const startMonth = startOfMonth(currentDate);
        const endMonth = endOfMonth(currentDate);
        const startDate = startOfWeek(startMonth);
        const endDate = addDays(startOfWeek(endMonth), 42); // 6 weeks to cover all possible days

        const days = [];
        let day = startDate;

        while (day <= endDate) {
            const isCurrentMonth = getMonth(day) === getMonth(currentDate);
            const formattedDay = format(day, 'yyyy-MM-dd');
            const isSunday = day.getDay() === 0;
            const isSaturday = day.getDay() === 6;
            const moodImage = diaryEntries[formattedDay] ? moodImages[diaryEntries[formattedDay].sentiment] : moodImages['normal'];

            if (isCurrentMonth) {
                days.push(
                    <DayTile
                        key={formattedDay}
                        isWeekend={isSunday || isSaturday}
                        isSunday={isSunday}
                        moodImage={moodImage}
                        onClick={() => handleDayClick(new Date(formattedDay))}
                    >
                        <DayContent>{day.getDate()}</DayContent>
                    </DayTile>
                );
            } else {
                days.push(<div key={formattedDay}></div>);
            }
            day = addDays(day, 1);
        }

        return days;
    };

    return (
        <div>
            <Nav />
            <Container>
                <HeaderContainer>
                    <Button style={{ padding: "5px 30px", fontSize: "18px" }}>일기 쓰기</Button>
                    <YearMonthDisplay>
                        <Button style={{ color: "black", backgroundColor: "white" }} onClick={handlePrevMonth}>&lt;</Button>
                        <Select value={getYear(currentDate)} onChange={handleYearChange}>
                            {Array.from({ length: 100 }, (_, i) => getYear(new Date()) - 40 + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </Select>
                        <Select value={getMonth(currentDate)} onChange={handleMonthChange}>
                            {Array.from({ length: 12 }, (_, i) => i).map(month => (
                                <option key={month} value={month}>{month + 1}</option>
                            ))}
                        </Select>
                        <Button style={{ color: "black", backgroundColor: "white" }} onClick={handleNextMonth}>&gt;</Button>
                    </YearMonthDisplay>
                    <button style={{ backgroundColor: "transparent", border: "0", cursor: "pointer" }}>
                        <img src={`${process.env.PUBLIC_URL}/image/posting_list.png`} alt="icon" width="25" height="25" />
                    </button>
                </HeaderContainer>
                <WeekdaysContainer>{renderWeekdays()}</WeekdaysContainer>
                <DaysContainer>{renderDays()}</DaysContainer>
            </Container>
        </div>
    );
};

export default Calendar;