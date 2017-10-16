import React, { Component } from 'react';
import './App.css';
import { FeilLayout } from './layout/layout';
import Event  from './components/eventAnalysis';
import dataV  from './components/dataV';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

class App extends Component {
  updateHandle = () => {
    console.log('route changed!')
  };

  render() {
    return (
      <Router history={hashHistory} onUpdate={this.updateHandle}>
        <Route path="/" component={FeilLayout}>
          <IndexRoute component={Event}/>
          <Route path="event" component={Event}/>
          <Route path="dataV" component={dataV}/>
        </Route>
      </Router>
    )
  }
}

export default App;
