import './App.css'
import React, { useState, useEffect } from 'react'

function Login() {
    const server = import.meta.env.VITE_SERVER_URL

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [dob, setDob] = useState("")
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const [login, setLogin] = useState(false)

    useEffect(() => {
        if (window.localStorage.getItem('user')) {
            window.location.href = '/'
        }
    }, [])

    const handleSignup = () => {
        console.log(Date.parse(dob))
        if (Date.parse(dob) > (Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)) {
            setError("You must be 18 years old to register")
            setSuccess(false)
        } else if (Date.parse(dob) < (Date.now() - 65 * 365 * 24 * 60 * 60 * 1000)) {
            setError("You must be under 65 years old to register")
            setSuccess(false)
        } else {
            fetch(`${server}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    dob
                })
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.error) {
                        setError(data.error)
                        setSuccess(false)
                    } else {
                        setSuccess(data.message)
                        setError('')
                    }
                })
        }
    }

    const handleLogin = () => {
        fetch(`${server}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    setError(data.error)
                    setSuccess(false)
                } else {
                    window.localStorage.setItem('user', JSON.stringify(data.user))
                    window.location.href = '/'
                }
            })
    }

    return (
        <div className="App">
            <div hidden={login}>
                <input name="name" onChange={(e) => {
                    setName(e.target.value)
                }} placeholder="Name" style={{ width: "100%", margin: "30px", height: "50px" }} />
                <input name="email" onChange={(e) => {
                    setEmail(e.target.value)
                }} placeholder="Email" style={{ width: "100%", margin: "30px", height: "50px" }} />
                <input name="password" type="password" onChange={(e) => {
                    setPassword(e.target.value)
                }} placeholder="Password" style={{ width: "100%", margin: "30px", height: "50px" }} />
                <input type="date" onChange={(e) => {
                    setDob(e.target.value)
                    console.log(e.target.value)
                }} name="dob" style={{ width: "100%", margin: "30px", height: "50px" }} />
                <p style={{ color: "red", width: "100%", textAlign: "center", margin: "30px" }}>
                    {error}
                </p>
                <p style={{ color: "green", margin: "30px", width: "100%", textAlign: "center" }} hidden={!success}>
                    signup success please login to continue
                </p>
                <button type="submit" onClick={handleSignup} style={{ margin: "30px", height: "50px" }}>Submit</button>
            </div>
            <div hidden={!login}>
                <input name="email" onChange={(e) => {
                    setEmail(e.target.value)
                }} placeholder="Email" style={{ width: "100%", margin: "30px", height: "50px" }} />
                <input name="password" type="password" onChange={(e) => {
                    setPassword(e.target.value)
                }} placeholder="Password" style={{ width: "100%", margin: "30px", height: "50px" }} />
                <p style={{ color: "red", width: "100%", textAlign: "center", margin: "30px" }}>
                    {error}
                </p>
                <p style={{ color: "green", margin: "30px", width: "100%", textAlign: "center" }} hidden={!success}>
                    signup success please login to continue
                </p>
                <button type="submit" onClick={handleLogin} style={{ margin: "30px", height: "50px" }}>Submit</button>
            </div>
            <button hidden={login} onClick={() => {
                setLogin(true)
            }}>
                Login
            </button>
            <button hidden={!login} onClick={() => {
                setLogin(false)
            }}>
                Signup
            </button>
        </div>
    )
}

export default Login
