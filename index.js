import { registerRootComponent } from 'expo';
import React from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import { store } from './src/redux/store';
import I18NextWrapper from './src/providers/i18next.provider';
import { SocketProvider } from './src/providers';
function App() {
  return <Provider store={store}>
    <I18NextWrapper>
      <SocketProvider>
        <AppNavigator />
      </SocketProvider>
    </I18NextWrapper>
  </Provider>
}

registerRootComponent(App);