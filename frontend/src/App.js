import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignUp from "./pages/join/SignUp"
import SignIn from "./pages/join/SignIn";
import MainPage from "./pages/main/Main";
import Calendar from "./pages/main/Calendar";
import WriteDiaryForm from "./pages/diary/WriteDiary";
import DiaryPage from "./pages/diary/LoadDiary";
import CommunityForm from "./pages/community/Community";
import SharedDiaryPage from "./pages/sharedDiary/SharedDiary";
import CommunityDiaryPage from "./pages/community/CommunityDiary";
import ApplicationList from "./pages/sharedDiary/Application";
import LoadingAnimation from "./pages/diary/LoadingAnimation";
import SharedDiaryContent from "./pages/sharedDiary/LoadSharedDiaryContent";
import SharedDiaryContentPage from "./pages/sharedDiary/LoadSharedDiaryContent";
import WriteSharedDiaryForm from "./pages/sharedDiary/WriteSharedDiary";

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/signin" element={<SignIn/>} />
            <Route path="/" element={<MainPage/>}/>
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/write-diary" element={<WriteDiaryForm/>}/>
            <Route path="/view-diary" element={<DiaryPage/>}/>
            <Route path="/community" element={<CommunityForm/>}/>
            <Route path="/shared-diary" element={<SharedDiaryPage/>}/>
            <Route path="/community-diary" element={<CommunityDiaryPage/>}/>
            <Route path="/applications" element={<ApplicationList/>}/>
            <Route path="/loading" element={<LoadingAnimation/>}/>
            <Route path="/shared-diary-list" element={<SharedDiaryContentPage/>}/>
            <Route path="/write-shared-diary" element={<WriteSharedDiaryForm/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
