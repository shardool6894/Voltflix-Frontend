import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Auth from '../pages/Auth.jsx';
import ErrorPage from '../pages/Error.jsx';
export default function Router () { 
    return (
        <BrowserRouter>
            <Routes>
                <Route path = '/' element = {<Home/>}/>
                <Route path = '/auth' element = {<Auth/>}/>
                <Route path = '*' element = {<ErrorPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}