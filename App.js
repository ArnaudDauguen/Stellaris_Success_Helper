import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Router, Scene, Stack, Actions} from 'react-native-router-flux';

import Login from './components/LoginScreen';
import Home from './components/Home';


const Example = () => (

  <Router>
    <Stack key="root">
      <Scene key="login" component={Login} title="Login"/>
      <Scene key="home" component={Home} title="Home"/>
     
    </Stack>
  </Router>
);

export default Example;