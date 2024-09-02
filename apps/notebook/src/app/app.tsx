import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotebookList from './notebooks.list';
import NotebookDetail from './single.note';
import NoteName from './name';

const App = () => {
  return (
    <Router>
      <NoteName/>
      <Routes>
        <Route path="/" element={<NotebookList />} />
        <Route path="/notebook/:id" element={<NotebookDetail />} />
      </Routes>
    </Router>
  );
};

export default App;