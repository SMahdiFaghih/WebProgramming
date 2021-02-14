import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.scss';

function Signup() {
    const [state , setState] = useState({
        username:{ value:"", error:'' },
        email :{ value:"", error:'' },
        password : { value:"", error:'' },
        role:{ value:"student", error:'' }
    })

    function handleChange(e:any){
        const {id, value} = e.target 
        setState(prevState => ({
            ...prevState,
            [id] : {value, error: value ? '' : `${id} is required`}
        }))
    }

    function onSubmit(e: React.FormEvent){
        e.preventDefault();
        const error = Object.values(state).map(v => v.error).some(err=>!!err)
                        || Object.values(state).map(v =>v.value).some(v=>!v)
        if(error) return
        console.log(state);
    }

  return (
    <div className="Auth d-flex align-items-center justify-content-center">
        <div className="form-container">
            <h2 className="mb-5">Web Project</h2>
            <form className="mb-3 d-flex flex-column" onSubmit={onSubmit}>
                <TextField className="mb-3" id="username" error={!!state.username.error} helperText={state.username.error} label="Username" variant="outlined" onChange={handleChange} />
                <TextField className="mb-3" id="email" error={!!state.email.error} helperText={state.email.error} label="Email" variant="outlined" onChange={handleChange} />
                <TextField className="mb-3" id="password" error={!!state.password.error}  helperText={state.password.error} label="Password" type="password" variant="outlined" onChange={handleChange}/>
                <FormControl className="mb-3" onChange={handleChange}>
                    <FormLabel>Role</FormLabel>
                    <RadioGroup row aria-label="position" name="position" defaultValue="top" >
                        <FormControlLabel
                            value="student"
                            control={<Radio id="role" checked={state.role.value === 'student'} color="primary" size="small" />}
                            label="Student"
                        />
                        <FormControlLabel
                            value="lecturer"
                            control={<Radio id="role" checked={state.role.value === 'lecturer'} color="primary" size="small" />}
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
