import { Button, TextField } from '@material-ui/core';
import { setgid } from 'process';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserApi from '../api/userApis';

const userApiService = new UserApi();

function Profile() {
    const [state , setState] = useState({
        newUsername :'',
        newPassword : ''
    })

    const [error , setError] = useState({
        newUsername :'',
        newPassword : ''
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

    function getUserData(){
        // userApiService.getUserData()
        //     .then(data=>{
            // setState(data)
        // })
        //     .catch(e=>console.error(e))
    }

    const history = useHistory();
    function onSubmit(e: React.FormEvent){
        e.preventDefault();
        const hasError = Object.values(error).some(err=>!!err)
                        || Object.values(state).some(v=>!v)
        if(hasError) return
        userApiService.editUser(state)
        .then(data=>{
            console.log(data);
        }).catch(e=>{
            console.error(e);
        })
    }
  return (
    <div className="ProfileContainer">
        <div className="form-container">
            <h2 className="mb-4">Profile</h2>
            <form className="mb-3 d-flex flex-column w-50" onSubmit={onSubmit}>
                <TextField className="mb-3" id="newUsername" error={!!error.newUsername} helperText={error.newUsername} label="Username"  type="text" variant="outlined" onChange={handleChange} />
                <TextField className="mb-3" id="newPassword" error={!!error.newPassword}  helperText={error.newPassword} label="Password" type="password" variant="outlined" onChange={handleChange}/>
                <Button className="align-self-start" variant="contained" type="submit" color="primary">UPDATE</Button>
            </form> 
        </div>
    </div>
  );
}

export default Profile;
