import { ListItemButton } from '@mui/material';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function ButtonItem({ showNav, children, to, title }) {
  const location = useLocation();
  return (
    <Link to={to}>
      <ListItemButton
        className={`button ${location.pathname == to ? 'active' : ''}`}
        onClick={() => {
          showNav(false);
        }}
      >
        {children}
        <span>{title}</span>
      </ListItemButton>
    </Link>
  );
}

export default ButtonItem;
