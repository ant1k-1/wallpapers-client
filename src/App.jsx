import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { CatalogPage } from './pages/CatalogPage'
import { HomePage } from './pages/HomePage'
import { SigninPage } from './pages/SigninPage'
import { PostPage } from './pages/PostPage'


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='/catalog' element={<CatalogPage />} />
          <Route path='/signin' element={<SigninPage />} />
          <Route path='/post/:id' element={<PostPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
