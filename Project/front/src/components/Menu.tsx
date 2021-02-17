import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link, useHistory } from 'react-router-dom';
import { Icon, IconButton } from '@material-ui/core';

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const history = useHistory();
  const logout = ()=>{
    handleClose();
    localStorage.setItem('Token', '');
    history.push('/');
  }

  return (
    <div>
      <IconButton color="inherit" aria-controls="profile-menu" aria-haspopup="true" onClick={handleClick}>
        <Icon>account_circle</Icon>
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem className="text-link" component={Link} to="/dashboard/profile" onClick={handleClose}>
            Profile
        </MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}