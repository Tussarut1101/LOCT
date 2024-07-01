import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import './Login.css';
import Logo from '../Images/LOCTSystem.png';
import { TextField } from '@mui/material';
import styled from 'styled-components';
import { Login_Fn } from './Login_Fn';

function Login() {
    const location = useLocation();
    const { username, setusername, password, setpassword, LoginUser, load, setLoad } = Login_Fn();
    const refUser = useRef(null);
    const refPass = useRef(null)

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const USER_ID = params.get('USER_ID') || '';
        if (USER_ID !== '') {
            setusername(USER_ID)
            setpassword(USER_ID)
            setLoad(true)
        } else {
            setLoad(false)
        }
    }, [location]);

    useEffect(() => {
        if (load) {
            LoginUser()
        }
    }, [load]);



    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            LoginUser();
        }
    }

    return (
        <div className='divBackgroup'>
            <Card className='CardLogin'>
                <div className='divHeader'>
                    <img src={Logo} alt="Logo" className='logo' />
                </div>
                <div className='divContent'>
                    <div style={{ marginBottom: '7%' }}>
                        <label style={{ fontSize: '18px', fontWeight: 'bold' }}>LOGIN</label>
                    </div>
                    <div style={{ marginBottom: '7%' }}>
                        <TextField ref={refUser} className='cTextLogin' label="username" variant="filled" fullWidth onChange={(e) => setusername(e.target.value)} onKeyDown={handleKeyDown} />
                    </div>
                    <div style={{ marginBottom: '10%' }}>
                        <TextField ref={refPass} className='cTextLogin' label="password" variant="filled" fullWidth type='password' onChange={(e) => setpassword(e.target.value)} onKeyDown={handleKeyDown} />
                    </div>
                    <div>
                        <button className="btnLogin" onClick={LoginUser}>Login</button>
                    </div>
                </div>


            </Card>
        </div>
    )
}

export default Login