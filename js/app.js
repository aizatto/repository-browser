"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, browserHistory} from 'react-router';
import Homepage from './components/Homepage';

ReactDOM.render(
  <Router
    history={browserHistory}>
    <Route path="/"
      component={Homepage}>
    </Route>
  </Router>,
  document.getElementById('root')
);
