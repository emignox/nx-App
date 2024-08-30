import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotebookList from './notebooks.list'; // Lista delle note
import NotebookDetail from './single.note'; // Dettaglio di una singola nota

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NotebookList />} />
        <Route path="/notebook/:id" element={<NotebookDetail  />} />
      </Routes>
    </Router>
  );
};

export default App;