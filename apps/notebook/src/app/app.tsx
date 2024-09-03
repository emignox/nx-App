// import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './auth/register';
import Login from './auth/login';
import MyNotes from './myNotebook/create&getNote';

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path='my-notes' element={<MyNotes />} />
        <Route path='login' element={<Login />} />
      <Route path="/" element={<Register />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;