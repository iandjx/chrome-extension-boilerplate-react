import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
const Popup = () => {
  const [color, setColor] = useState();

  useEffect(() => {
    chrome.storage.sync.get('color', ({ color }) => {
      setColor(color);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{color}</p>
        <button onClick={changeColor}>Change Background Color</button>
      </header>
    </div>
  );
};

export default Popup;

// When the button is clicked, inject setPageBackgroundColor into current page
const changeColor = async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
};

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get('color', ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
