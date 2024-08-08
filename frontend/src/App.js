import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignUp from "./pages/join/SignUp"
import SignIn from "./pages/join/SignIn";
import MainPage from "./pages/main/Main";
import Calendar from "./pages/main/Calendar";
import WriteDiaryForm from "./pages/diary/WriteDiary";
import DiaryPage from "./pages/diary/LoadDiary";

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/signin" element={<SignIn/>} />
            <Route path="/main" element={<MainPage/>}/>
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/write-diary" element={<WriteDiaryForm/>}/>
            <Route path="/view-diary" element={<DiaryPage/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
