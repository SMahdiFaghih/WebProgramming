import React from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signin from './views/Signin';
import Signup from './views/Signup';
import Dashboard from './views/Dashboard';
import PrivateRoute from './AuthGuard';


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <PrivateRoute path="/dashboard" component={Dashboard}></PrivateRoute>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
