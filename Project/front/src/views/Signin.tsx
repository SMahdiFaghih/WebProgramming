import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.scss';

function Signin() {
    const [state , setState] = useState({
        email :{ value:"", error:'' },
        password : { value:"", error:'' }
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
            <h2 className="mb-4">Web Project</h2>
            <form className="mb-3 d-flex flex-column" onSubmit={onSubmit}>
                <TextField className="mb-3" id="email" error={!!state.email.error} helperText={state.email.error} label="Email" variant="outlined" onChange={handleChange} />
                <TextField className="mb-3" id="password" error={!!state.password.error}  helperText={state.password.error} label="Password" type="password" variant="outlined" onChange={handleChange}/>
                <Button variant="contained" type="submit" color="primary">Signin</Button>
            </form> 
            <div className="relocate">if you haven't signed up click <Link to="/signup">here</Link></div>
        </div>
    </div>
  );
}

export default Signin;
