import { AppBar, Button, Icon, IconButton, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import CreateForm from './CreateForm';
import FormsList from './FormsList';
import SubmitList from './SubmitList';

function Dashboard() {
  const sidebarItems = [
    {title:'My Forms', icon:'assignment', link:'/dashboard/forms-list'},
    {title:'Create Form', icon:'border_color', link:'/dashboard/create-form'},
  ]
  return (
    <div className="Dashboard">
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start"  color="inherit" aria-label="menu">
          <Icon> menu</Icon>
        </IconButton>
        <Typography variant="h6" >
          News
        </Typography>
        <Button color="inherit">Profile</Button>
      </Toolbar>
    </AppBar>
      <div className="sidebar">
        {
          sidebarItems.map(s=>(
            <Link key={s.title} to={s.link}>
              <div className="sidebar-item">
                <Icon> {s.icon}</Icon>
                <span className="title"> {s.title} </span>
              </div>
            </Link>
          ))
        }
      </div>
      <div className="dashboard-container">
        <Switch>
          <Route path="/dashboard/forms-list" component={FormsList} />
          <Route path="/dashboard/create-form" component={CreateForm} />
          <Route path="/dashboard/submit-list" component={SubmitList} />
        </Switch>
      </div>
    </div>
  );
}

export default Dashboard;
