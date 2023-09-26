import React, { useState } from 'react'
import { useHistory } from 'react-router-use-history';

const Login = (props) => {
    const [credential, setCredential] = useState({ email: "", password: "" });
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credential.email, password: credential.password }),
        });
        const json = await response.json();

        if (json.success) {
            // save the  auth token and redirect
            localStorage.setItem('token', json.authToken);
            props.showAlert("Logged in successfully", "success");
            history.push('/');
        }
        else {
            props.showAlert("Invalid credential", "danger");
        }

    };
    const onChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value })
    }

    return (
        <div className='container m-10'>
            <h2>Login to use iNotebook</h2>
            <form onSubmit={handleSubmit} >
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' value={credential.email} onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' value={credential.password} onChange={onChange} />
                </div>

                <button type="submit" className="btn btn-primary  ">Submit</button>
            </form>
        </div>
    )
}

export default Login