import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import { stat } from 'fs';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import UserApi from '../api/userApis';
import '../styles/Auth.scss';
import { SignupPayload } from '../types/user';


const userApiService = new UserApi();

function Signup() {
    const [state , setState] = useState<SignupPayload>({
        username:'',
        email :'',
        password :'',
        role:'student'
    })

    const [error , setError] = useState({
        username:'',
        email :'',
        password :'',
        role:''
    })

    function handleChange(e:any){
        const {id, value} = e.target 
        setState(prevState => ({
            ...prevState,
            [id] : value
        }));
        setError(prevState => ({
            ...prevState,
            [id] : value ? '' : `${id} is required`
        }));
    }

    const history = useHistory();
    function onSubmit(e: React.FormEvent){
        e.preventDefault();
        const hasError = Object.values(error).some(err=>!!err)
                        || Object.values(state).some(v=>!v)
        console.log(state)
        if(hasError) return
        userApiService.signup(state).then(data=>{
            localStorage.setItem('Token', data.token)
            history.push('/dashboard');
            userApiService.getUser()
            .then(data=>{
                localStorage.setItem('Role', JSON.stringify(data[0].role));
            }).catch(e=>{
                console.error(e);
            })
        }).catch(e=>{
            console.error(error)
        })
    }

  return (
    <div className="Auth d-flex align-items-center justify-content-center">
        <div className="form-container">
            <h2 className="mb-5">TForm</h2>
            <form className="mb-3 d-flex flex-column" onSubmit={onSubmit}>
                <TextField className="mb-3" id="username" error={!!error.username} helperText={error.username} label="Username" type='text' variant="outlined" onChange={handleChange} />
                <TextField className="mb-3" id="email" error={!!error.email} helperText={error.email} label="Email" type="email" variant="outlined" onChange={handleChange} />
                <TextField className="mb-3" id="password" error={!!error.password}  helperText={error.password} label="Password" type="password" variant="outlined" onChange={handleChange}/>
                <FormControl className="mb-3" onChange={handleChange}>
                    <FormLabel>Role</FormLabel>
                    <RadioGroup row aria-label="position" name="position" defaultValue="top" >
                        <FormControlLabel
                            value="student"
                            control={<Radio id="role" checked={state.role === 'student'} color="primary" size="small" />}
                            label="Student"
                        />
                        <FormControlLabel
                            value="lecturer"
                            control={<Radio id="role" checked={state.role === 'lecturer'} color="primary" size="small" />}
                            label="Lecturer"
                        />
                    </RadioGroup>
                </FormControl>
                <Button variant="contained" type="submit" color="primary">Signup</Button>
            </form> 
            <div className="relocate">if you have signed up before click <Link to="/signin">here</Link></div>
        </div>
    </div>
  );
}

export default Signup;
