import React from 'react';
import { Redirect, Route } from 'react-router-dom';

function PrivateRoute({...rest }) {
  const isLoggedIn = true;
  return (
    <>
      {isLoggedIn ? (
        <Route {...rest} />
      ) : (
          <Route
            render={({ location }) => (
              <Redirect
                to={{
                  pathname: '/signup',
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