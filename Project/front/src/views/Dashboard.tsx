import { AppBar, createStyles, Icon, IconButton, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import ProfileMenu from '../components/Menu';
import AllForms from './AllForms';
import CreateForm from './CreateForm';
import FormsList from './FormsList';
import Profile from './Profile';
import SubmitForm from './SubmitForm';
import SubmitList from './SubmitList';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    sideBar: {
    },
    title: {
      flexGrow: 1,
    },
  }),
);


function Dashboard() {
  const classes = useStyles();
  const lecturerSidebarItems = [
    {title:'My Forms', icon:'assignment', link:'/dashboard/forms-list'},
    {title:'Create Form', icon:'border_color', link:'/dashboard/create-form'},
  ]
  const studentSidebarItems = [
    {title:'All Forms', icon:'assignment', link:'/dashboard/forms-all'},
    {title:'My Forms', icon:'assignment', link:'/dashboard/forms-list'},
  ]

  const [isSidebarOpen, setIsSidebatOpen] = useState(true);
  const toggleSidebar = () => {
      setIsSidebatOpen(!isSidebarOpen);
  }

  const sidebar = () => {
    if(isSidebarOpen) return (
      <div  className={classes.sideBar + " sidebar"}>
      {
        studentSidebarItems.map(s=>(
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
      <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleSidebar}>
          <Icon> menu</Icon>
        </IconButton>
        <Typography className={classes.title} variant="h6" >
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
