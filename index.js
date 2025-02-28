import { registerRootComponent } from 'expo';
import React from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import { store } from './src/redux/store';

function App() {
  return <Provider store={store}>
    <AppNavigator />
  </Provider>
}

registerRootComponent(App);