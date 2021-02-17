import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import UserApi from '../api/userApis';
import '../styles/Auth.scss';

const userApiService = new UserApi();

function Signin() {
    const [state , setState] = useState({
        email :'',
        password : ''
    })

    const [error , setError] = useState({
        email :'',
        password : ''
    })

    function handleChange(e:any){
        const {id, value} = e.target 
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
        setError(prevState => ({
            ...prevState,
            [id] : value ? '' : `${id} is required`
        }))
    }

    const history = useHistory();
    function onSubmit(e: React.FormEvent){
        e.preventDefault();
        const hasError = Object.values(error).some(err=>!!err)
                        || Object.values(state).some(v=>!v)
        if(hasError) return
        userApiService.signin(state)
        .then(data=>{
            console.log(data);
            localStorage.setItem('Token', data.token);
            history.push('/dashboard');
        }).catch(e=>{
            // console.error(e);
        })
    }

  return (
    <div className="Auth d-flex align-items-center justify-content-center">
        <div className="form-container">
            <h2 className="mb-4">TForm</h2>
            <form className="mb-3 d-flex flex-column" onSubmit={onSubmit}>
                <TextField className="mb-3" id="email" error={!!error.email} helperText={error.email} label="Email"  type="email" variant="outlined" onChange={handleChange} />
                <TextField className="mb-3" id="password" error={!!error.password}  helperText={error.password} label="Password" type="password" variant="outlined" onChange={handleChange}/>
                <Button variant="contained" type="submit" color="primary">Signin</Button>
            </form> 
            <div className="relocate">if you haven't signed up click <Link to="/signup">here</Link></div>
        </div>
    </div>
  );
}

export default Signin;
