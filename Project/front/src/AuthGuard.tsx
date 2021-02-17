import React from 'react';
import { Redirect, Route } from 'react-router-dom';

function PrivateRoute({...rest }) {
  const isLoggedIn = !!localStorage.getItem('Token');
  return (
    <>
      {isLoggedIn ? (
        <Route {...rest} />
      ) : (
          <Route
            render={({ location }) => (
              <Redirect
                to={{
                  pathname: '/signin',
                  state: { from: location },
                }}
              />
            )}
          />
        )}
    </>
  );
}
export default PrivateRoute;