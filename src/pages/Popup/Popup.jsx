import React, { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { ADD_TO_WATCHLIST, GET_WATCHLIST_BY_ACCOUNT_ID } from './queries';
import AddedToWatchlist from './components/AddedToWatchlist';
import NotInOpenSea from './components/NotInOpenSea';
import InOpenSea from './components/InOpenSea';
import InCollectionList from './components/InCollectionList';
import Login from './components/Login';

import 'bootstrap/dist/css/bootstrap.min.css';

const siteRegex = /opensea\.io/;
const collectionRegex = /opensea\.io\/collection\/(.*)/;
const collectionsRegex = /explore-collections/;

const Popup = () => {
  const [URL, setURL] = useState();
  const [collection, setCollection] = useState();
  const [ID, setID] = useState();
  const [inOpenSea, setInOpenSea] = useState(false);
  const [collectionImage, setCollectionImage] = useState();
  const [isCollectionAdded, setIsCollectionAdded] = useState();
  const [isNewlyAdded, setIsNewlyAdded] = useState();
  const [inCollections, setInCollections] = useState();

  useEffect(() => {
    chrome.storage.sync.get('ID', ({ ID }) => {
      if (ID) {
        setID(ID);
      }
    });
  }, []);

  useEffect(() => {
    async function getCurrentTab() {
      let queryOptions = { active: true, currentWindow: true };

      let [tab] = await chrome.tabs.query(queryOptions);

      chrome.storage.sync.set({ currentURL: tab.url });
      setURL(tab.url);

      const imageRes = await chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
        },
        func: () => {
          const imageElement = document.getElementsByClassName(
            'CollectionHeader--collection-image'
          );
          return imageElement[0].children[0].currentSrc;
        },
      });
      setCollectionImage(imageRes[0].result);
    }
    getCurrentTab();
  }, []);

  useEffect(() => {
    if (URL) {
      const match = URL.match(siteRegex);
      const inCollectionsMatch = URL.match(collectionsRegex);
      if (match && match[0]) {
        setInOpenSea(true);
        const collectionMatch = URL.match(collectionRegex);

        if (inCollectionsMatch && inCollectionsMatch[0]) {
          setInCollections(true);
        }
        if (collectionMatch && collectionMatch[1]) {
          setCollection(collectionMatch[1]);
        }
      }
    }
  }, [URL]);

  useEffect(() => {
    if (ID && collection) {
      request('http://localhost:8000/graphql', GET_WATCHLIST_BY_ACCOUNT_ID, {
        accountId: ID,
      }).then((res) => {
        const { getWatchlistByAccount } = res;
        const collectionExist = getWatchlistByAccount.find(
          (col) => col.ticker === collection
        );

        if (collectionExist) {
          setIsCollectionAdded(true);
        } else {
          setIsCollectionAdded(false);
        }
      });
    }
  }, [ID, collection]);

  useEffect(() => {
    if (isCollectionAdded === false) {
      request('http://localhost:8000/graphql', ADD_TO_WATCHLIST, {
        accountId: ID,
        ticker: collection,
        variant: 'NFT',
      }).then((res) => {
        const {
          createWatchlist: { ok },
        } = res;
        if (ok) {
          setIsNewlyAdded(true);
          setIsCollectionAdded(true);

          let queryOptions = { active: true, currentWindow: true };
          chrome.tabs.query(queryOptions).then((res) => {
            const [tab] = res;
            chrome.tabs.sendMessage(tab.id, { message: 'reload' });
          });
        }
      });
    }
  }, [ID, collection, isCollectionAdded]);

  if (!inOpenSea) {
    return (
      <div style={{ width: '360px', height: '152px' }}>
        <NotInOpenSea />
      </div>
    );
  }

  if (inCollections) {
    return (
      <div style={{ width: '360px', height: '152px' }}>
        <InCollectionList />
      </div>
    );
  }

  if (!collection) {
    return (
      <div style={{ width: '380px' }}>
        <InOpenSea />
      </div>
    );
  }

  if (!ID) {
    return (
      <div style={{ width: '360px', height: '152px' }}>
        <Login setID={setID} />
      </div>
    );
  }

  if (isCollectionAdded) {
    return (
      <div style={{ width: '360px', height: '152px' }}>
        <AddedToWatchlist
          newlyAdded={isNewlyAdded}
          collectionImage={collectionImage}
          accountId={ID}
          collection={collection}
        />
      </div>
    );
  }
  return <div />;
};

export default Popup;
