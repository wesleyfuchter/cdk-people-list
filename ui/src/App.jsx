import React from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';

function App({ lang }) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit
          {' '}
          <code>src/App.js</code>
          {' '}
          and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          { lang === 'BR' ? 'Aprenda React' : 'Learn React' }
        </a>
      </header>
    </div>
  );
}

App.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default App;
