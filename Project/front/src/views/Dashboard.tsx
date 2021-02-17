import { AppBar, Icon, IconButton, Toolbar, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import ProfileMenu from '../components/Menu';
import AllForms from './AllForms';
import CreateForm from './CreateForm';
import FormsList from './FormsList';
import Profile from './Profile';
import SubmitForm from './SubmitForm';
import SubmitList from './SubmitList';


function Dashboard() {
  const role = JSON.parse(localStorage.getItem('Role') as string)
  const lecturerSidebarItems = [
    {title:'My Forms', icon:'assignment', link:'/dashboard/forms-list'},
    {title:'Create Form', icon:'border_color', link:'/dashboard/create-form'},
  ]
  const studentSidebarItems = [
    {title:'All Forms', icon:'all_inbox', link:'/dashboard/forms-all'},
    {title:'My Forms', icon:'assignment', link:'/dashboard/forms-list'},
  ]
  const sidebarItems = role === 'lecturer' ? lecturerSidebarItems : studentSidebarItems;
  const [isSidebarOpen, setIsSidebatOpen] = useState(true);
  const toggleSidebar = () => {
      setIsSidebatOpen(!isSidebarOpen);
  }

  const sidebar = () => {
    if(isSidebarOpen) return (
      <div className="sidebar">
      {
        sidebarItems.map(s=>(
          <Link className="text-link" key={s.title} to={s.link}>
            <div className="sidebar-item">
              <Icon> {s.icon}</Icon>
              <span className="title"> {s.title} </span>
            </div>
          </Link>
        ))
      }
    </div>
    )
  }

  const header = () =>{
    return (
      <AppBar className="header" position="static">
      <Toolbar>
        <IconButton edge="start" className="menu-button" color="inherit" aria-label="menu" onClick={toggleSidebar}>
          <Icon> menu</Icon>
        </IconButton>
        <Typography className="title" variant="h6" >
          TForm
        </Typography>
        <ProfileMenu />
      </Toolbar>
    </AppBar>
    );
  }

  return (
    <div className="Dashboard">
    {header()}
    {sidebar()}
    <div className="dashboard-container">
        <Switch>
          <Route path="/dashboard/profile" component={Profile} />
          <Route path="/dashboard/forms-list" component={FormsList} />
          <Route path="/dashboard/forms-all" component={AllForms} />
          <Route path="/dashboard/create-form" component={CreateForm} />
          <Route path="/dashboard/submit-form" component={SubmitForm} />
          <Route path="/dashboard/submit-list" component={SubmitList} />
        </Switch>
    </div>
    </div>
  );
}

export default Dashboard;
