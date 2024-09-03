// import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './auth/register';
import Login from './auth/login';
import MyNotes from './myNotebook/create&getNote'; 
import client from './apollo.client';
import NorteDetails from './components/noteById'

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path='note/:id' element={<NorteDetails />} />
        <Route path='my-notes' element={<MyNotes client={client}  />} />
        <Route path='login' element={<Login />} />
      <Route path="/" element={<Register />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;