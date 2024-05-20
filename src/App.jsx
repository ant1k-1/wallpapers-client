import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { HomePage } from './pages/HomePage'
import { SigninPage } from './pages/SigninPage'
import { PostPage } from './pages/PostPage'
import { TermsPage } from './pages/TermsPage'
import { SignupPage } from './pages/SignupPage';
import { UploadPage } from './pages/UploadPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import { ModerPage } from './pages/ModerationPage';
import { AdminPage } from './pages/AdminPage';

export const ScrollToTop = () => {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='/signin' element={<SigninPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/terms' element={<TermsPage />} />
          <Route path='/upload' element={<UploadPage />} />
          <Route path='/moder' element={<ModerPage />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/profile/:userId' element={<ProfilePage />} />
          <Route path='/post/:post_id' element={<PostPage />} />
          <Route path='error404' element={<NotFoundPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ScrollToTop />
    </>
  )
}

export default App;
