import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './auth/register';
import Login from './auth/login';
import MyNotes from './myNotebook/create&getNote'; 
import client from './apollo.client';
import NoteDetails from './components/noteById';
import Menu from './menu';
import Profile from './components/profile.user';
import HomePage from './components/info.page';

const App = () => {
  return (
    <>
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pro" element={<Profile userId="" />} />
          <Route path="note/:id" element={<NoteDetails />} />
          <Route path="my-notes" element={<MyNotes client={client} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
