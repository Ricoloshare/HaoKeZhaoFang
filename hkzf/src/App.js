import React from 'react';
import Home from './pages/Home'
import CityList from './pages/CityLists'
import Map from './pages/Map'
import HouseDetail from './pages/HouseDetail'
import Login from './pages/Login'

import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate
} from 'react-router-dom'
function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route exact path='/' element={<Navigate to="/home" />}></Route>
          <Route path='/home/*' element={<Home />} />
          <Route path='/citylist' element={<CityList />} />
          <Route path='/map' element={<Map />} />
          <Route path='/detail/:id' element={<HouseDetail />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
