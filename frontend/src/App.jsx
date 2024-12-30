import {Container} from "@chakra-ui/react";
import {Navigate, Route, Routes} from "react-router-dom";
import UserPage from "./pages/UserPage.jsx";
import PostPage from "./pages/PostPage.jsx";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "./atoms/userAtom.js";
import LogOutButton from "./components/LogOutButton.jsx";
import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";
import { useEffect } from "react";
import CreatePost from "./components/CreatePost.jsx";

function App() {

  const user = useRecoilValue(userAtom)

  
  return (
    <Container maxW="620px">
        <Header />
      <Routes>
        <Route path="/" element={user ? <HomePage/> : <Navigate to='/auth'/>} />
        <Route path="/auth" element={!user ? <AuthPage/> : <Navigate to='/'/>} />
        <Route path="/update" element={user ? <UpdateProfilePage/> : <Navigate to='/auth'/>} />

        <Route path="/:username" element={user ? (
          <>
            <UserPage/>
            <CreatePost/>
          </>
        ) : (
          <UserPage/>
        )} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
      </Routes>

      {user && <LogOutButton/>}

    </Container>
  )
}

export default App
