import { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { request, gql } from 'graphql-request';
import React from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GET_WATCHLIST_BY_ACCOUNT_ID } from './../Popup/queries';

const siteRegex = /opensea\.io/;
const collectionRegex = /opensea\.io\/collection\/(.*)/;

const ADD_TO_WATCHLIST = gql`
  mutation CREATE_WATCHLIST(
    $accountId: ID!
    $ticker: String!
    $variant: String!
  ) {
    createWatchlist(accountId: $accountId, ticker: $ticker, variant: $variant) {
      ok
    }
  }
`;

function App() {
  const [ID, setID] = useState();
  const [loading, setLoading] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [collection, setCollection] = useState();
  const [isCollectionAdded, setIsCollectionAdded] = useState();

  useEffect(() => {
    chrome.storage.sync.get('ID', ({ ID }) => {
      console.log('reloaded');
      if (ID) {
        setID(ID);
      }
    });
  }, []);

  useEffect(() => {
    if (ID && collection) {
      setLoading(true);
      request('http://localhost:8000/graphql', GET_WATCHLIST_BY_ACCOUNT_ID, {
        accountId: ID,
      }).then((res) => {
        const { getWatchlistByAccount } = res;
        const collectionExist = getWatchlistByAccount.find(
          (col) => col.ticker === collection
        );

        if (collectionExist) {
          setIsCollectionAdded(true);
        }
        setLoading(false);
      });
    }
  }, [ID, collection]);

  useEffect(() => {
    const match = window.location.href.match(siteRegex);

    if (match && match[0]) {
      const collectionMatch = window.location.href.match(collectionRegex);

      if (collectionMatch && collectionMatch[1]) {
        setCollection(collectionMatch[1]);
      }
    }
  }, []);

  const handleAddToWatchlist = async (accountId, ticker) => {
    const res = await request(
      'http://localhost:8000/graphql',
      ADD_TO_WATCHLIST,
      { accountId, ticker, variant: 'NFT' }
    ).catch(() => {
      setErrorMessage('Collection already in watchlist');
      setLoading(false);
    });
    const {
      createWatchlist: { ok },
    } = res;
    if (ok) {
    }
    setIsCollectionAdded(true);
  };

  if (loading) {
    return <div />;
  }

  if (isCollectionAdded) {
    return (
      <Button
        className="mb-3 border-0"
        disabled
        style={{
          width: '212px',
          height: '44px',
          boxShadow: '0px, 2px, 8px, #117BEE',
          background: '#E5E5EA',
          color: '#5B5B67',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '16px',
        }}
      >
        Already in watchlist
      </Button>
    );
  }

  if (ID) {
    return (
      <Button
        className="mb-3 "
        style={{
          width: '212px',
          height: '44px',
          boxShadow: '0px, 2px, 8px, #117BEE',
          background: '#117BEE',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '16px',
        }}
        onClick={() => handleAddToWatchlist(ID, collection)}
      >
        Add to watchlist
      </Button>
    );
  }
  return <div />;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'reload') {
    start();
  }
});

function start() {
  const toDelete = document.getElementById('insider');
  toDelete.remove();
  var temp = document.createElement('div');
  temp.setAttribute('style', 'display:flex; justify-content:center; ');
  temp.setAttribute('id', 'insider');

  render(<App />, temp);

  var box = document.querySelector(
    '#main > div > div > div > div:nth-child(2) > div:nth-child(5) > div:nth-child(2)'
  );
  if (!box) {
    box = document.querySelector(
      '#main > div > div > div > div:nth-child(2) > div:nth-child(5) > div:nth-child(1)'
    );
  }
  box.parentNode.insertBefore(temp, box);
}

setInterval(() => {
  if (
    !document.getElementById('insider') &&
    document.querySelector(
      '#main > div > div > div > div:nth-child(2) > div:nth-child(5)'
    )
  ) {
    var temp = document.createElement('div');
    temp.setAttribute('style', 'display:flex; justify-content:center; ');
    temp.setAttribute('id', 'insider');

    render(<App />, temp);

    var box = document.querySelector(
      '#main > div > div > div > div:nth-child(2) > div:nth-child(5) > div:nth-child(2)'
    );
    if (!box) {
      box = document.querySelector(
        '#main > div > div > div > div:nth-child(2) > div:nth-child(5) > div:nth-child(1)'
      );
    }
    box.parentNode.insertBefore(temp, box);
  }
}, 2500);
