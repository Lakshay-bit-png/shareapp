import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './Home';
import { Navigator } from './Navigation';
import { Main } from './Main';
import { WebSocketProvider } from './WebSocketContext';
import { Files } from './Presenter/Files';


// Import your components/pages



const AppRouter = () => {
    return (
       
        <Router>
            <Routes>
                {/* Define your routes */}
                <Route path="/" element={<Main />} />
                {/* <Route path="/ret" element={<Files />} />
                <Route path="/re" element={<HomePage />} /> */}
            </Routes>
        </Router>

    );
};

export default AppRouter;
