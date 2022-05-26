import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'

import { API_URL } from 'utils/utils';
import user from 'reducers/user';
import Header from './Header';
import Footer from './Footer';

import { SubmitButton, StyledForm, UsernameLabel, PasswordLabel, UsernameInput, PasswordInput, RegisterLabel, LoginLabel, Container, Radios } from './Style';

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [mode, setMode] = useState("register")

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const accessToken = useSelector((store) => store.user.accessToken)

    useEffect(()=> {
        if(accessToken) {
            navigate("/")
        }
    }, [accessToken])


    const onFormSubmit = (event) => {
        event.preventDefault()

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, password: password})
        }

        fetch(API_URL(mode), options)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.success) {
                batch(() => {
                    dispatch(user.actions.setUserId(data.userId));
                    dispatch(user.actions.setAccessToken(data.accessToken));
                    dispatch(user.actions.setUserName(data.username));
                    dispatch(user.actions.setError(null));
                    })

                } else {
                    batch(() => {
                    dispatch(user.actions.setError(data.response));
                    dispatch(user.actions.setUserId(null));
                    dispatch(user.actions.setAccessToken(null));
                    dispatch(user.actions.setUserName(null));
                    })
                }
            })
    }

    return (
        <>
        <Container>
            <Header />
                <Radios>
                    <RegisterLabel htmlFor="register">Register</RegisterLabel>
                    <input type="radio" id="register" checked={mode ==="register"} onChange={ () => setMode("register")}/>
                    
                    <LoginLabel htmlFor="login">Login</LoginLabel>
                    <input type="radio" id="login" checked={mode ==="login"} onChange={ () => setMode("login")}/>
                </Radios>

                <StyledForm onSubmit={onFormSubmit}>
                    <UsernameLabel htmlFor="username">Username</UsernameLabel>
                    <UsernameInput 
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}/>

                    <PasswordLabel htmlFor="password">Password</PasswordLabel>
                    <PasswordInput 
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}/>

                    <SubmitButton type="submit">Submit</SubmitButton>
                </StyledForm>
        </Container>
        <Footer />
        </>
    )
}

export default Login