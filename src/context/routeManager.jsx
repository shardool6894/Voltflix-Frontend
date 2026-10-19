import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Auth from '../pages/Auth.jsx';
import Stations from '../pages/Stations.jsx';
import Reports from '../pages/Reports.jsx';
import Stats from '../pages/Stats.jsx';
import Profile from '../pages/Profile.jsx';
import ErrorPage from '../pages/Error.jsx';
export default function Router () { 
    return (
        <BrowserRouter>
            <Routes>
                <Route path = '/' element = {<Home/>}/>
                <Route path = '/auth' element = {<Auth/>}/>
                <Route path = '/stations' element = {<Stations/>}/>
                <Route path = '/reports' element = {<Reports/>}/>
                <Route path = '/stats' element = {<Stats/>}/>
                <Route path = '/profile' element = {<Profile/>}/>
                <Route path = '*' element = {<ErrorPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}