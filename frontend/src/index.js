import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router} from 'react-router-dom';
import { Provider } from 'react-redux';
import {persistor, store} from './store';
import { PersistGate } from 'redux-persist/es/integration/react'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Provider store = {store}>
        <PersistGate loading={null} persistor={persistor}> 
           <App />     {/*PersistGate는 스토리지에 있는 값을 가져오기 전까지 화면을 지연시키는 것 */}
        </PersistGate>
      </Provider>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
