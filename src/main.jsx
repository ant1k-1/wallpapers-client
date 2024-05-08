import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import agreementReducer from './reducers/agreement.js';
import App from './App.jsx'
import './index.css'
import { createStore } from 'redux'; 

const store = createStore(agreementReducer);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
    
  </React.StrictMode>,
)
