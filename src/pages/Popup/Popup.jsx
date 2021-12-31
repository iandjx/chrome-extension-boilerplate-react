import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const regex = /collection\/(.*)/;

const Popup = () => {
  const [color, setColor] = useState();
  const [URL, setURL] = useState();
  const [collection, setCollection] = useState();
  useEffect(() => {
    chrome.storage.sync.get('color', ({ color }) => {
      setColor(color);
    });
  }, []);

  useEffect(() => {
    async function getCurrentTab() {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);

      chrome.storage.sync.set({ currentURL: tab.url });
      console.log('currentURL set to ', tab.url);
      setURL(tab.url);
    }
    getCurrentTab();
  }, []);

  useEffect(() => {
    if (URL) {
      const match = URL.match(regex);
      if (match[1]) {
        setCollection(match[1]);
      }
    }
  }, [URL]);

  return (
    <div className="App">
      <header className="App-header">
        <div>{URL}</div>
        <div>{collection}</div>
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
