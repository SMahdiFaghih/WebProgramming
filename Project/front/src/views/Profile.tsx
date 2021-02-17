import { Button, Divider, Icon, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import UserApi from '../api/userApis';

const userApiService = new UserApi();

function Profile() {

    const[data, setData] = useState({
        username:'',
        email:'',
        role:'student'
    })

    const [state , setState] = useState({
        newUsername :'',
        newPassword : ''
    })

    const [error , setError] = useState({
        newUsername :'',
        newPassword : ''
    })

    useEffect(() => {
        getUserData();
      }, []);

    const getUserData = ()=> {
      userApiService.getUser()
      .then(data=>{
          const user = data[0];
          setState({
              newUsername: user.username,
              newPassword: ''
          })
          setData({
              username: user.username,
              email: user.email,
              role: user.role
          })
      }).catch(e=>{
          console.error(e);
      })
    }

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
    
    function onSubmit(e: React.FormEvent){
        e.preventDefault();
        const hasError = Object.values(error).some(err=>!!err)
                        || Object.values(state).some(v=>!v)
        if(hasError) return
        userApiService.editUser(state)
        .then(data=>{
            getUserData();
        }).catch(e=>{
            console.error(e);
        })
    }

  return (
    <div className="ProfileContainer">
        <div className="form-container">
            <h2 className="mb-4">Profile</h2>
            <div className="d-flex align-items-center mb-3">
                <span className="profile-icon mr-2">
                    <Icon >perm_identity</Icon>
                </span>
                <span className="font-weight-bold mr-3">username</span>
                <span>{data.username}</span> 
            </div>
            <div className="d-flex align-items-center mb-3">
                <span className="profile-icon mr-2">
                    <Icon>email</Icon>
                </span>
                <span className="d-flex align-items-center font-weight-bold mr-3">email</span>
                <span>{data.email}</span> 
            </div>
            <div className="d-flex align-items-center mb-3">
                <span className="profile-icon mr-2">
                    <Icon>assignment_ind</Icon>
                </span>
                <span className=" font-weight-bold mr-3">role</span>
                <span>{data.role}</span> 
            </div>

            <Divider className="my-5" />

            <h4 className="mb-4">Edit Profile</h4>
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
