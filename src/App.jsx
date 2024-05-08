import { useState } from 'react'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { CatalogPage } from './pages/CatalogPage'
import { HomePage } from './pages/HomePage'
import { SigninPage } from './pages/SigninPage'
import { PostPage } from './pages/PostPage'
import { TermsPage } from './pages/TermsPage'
import { SignupPage } from './pages/SignupPage';
import { UploadPage } from './pages/UploadPage';

export const ScrollToTop = () => {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

function App() {
  const agreementAccepted = useSelector(state => state.agreementReducer?.agreementAccepted);

  if (agreementAccepted === undefined) {
    // Вернуть заглушку или что-то другое, пока состояние не будет инициализировано
    return <div>Loading...</div>;
  }
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='/signin' element={<SigninPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/catalog' element={<CatalogPage />} />
          <Route path='/terms' element={<TermsPage />} />
          <Route path='/upload' element={<UploadPage />} />
          <Route path='/post/:id' element={<PostPage />} />
        </Route>
      </Routes>
      <ScrollToTop />
    </>
  )
}

export default App;
