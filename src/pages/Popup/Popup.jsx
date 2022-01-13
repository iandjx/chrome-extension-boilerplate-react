import React, { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import {
  ADD_TO_WATCHLIST,
  GET_ACCOUNT_ID,
  GET_WATCHLIST_BY_ACCOUNT_ID,
} from './queries';
const siteRegex = /opensea\.io/;
const collectionRegex = /opensea\.io\/collection\/(.*)/;

const Popup = () => {
  const [URL, setURL] = useState();
  const [collection, setCollection] = useState();
  const [ID, setID] = useState();
  const [inOpenSea, setInOpenSea] = useState(false);
  const [collectionImage, setCollectionImage] = useState();
  const [tempEmail, setTempEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const handleAddToWatchlist = async (accountId, ticker) => {
    setLoading(true);
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
    setLoading(false);
    setSuccessMessage(`Collection ${collection} added to watchlist.`);
  };

  const handleEmailSet = async (emailAddress) => {
    setLoading(true);
    setErrorMessage();
    const res = await request('http://localhost:8000/graphql', GET_ACCOUNT_ID, {
      email: emailAddress,
    }).catch((err) => {
      const error = err.response;
      setLoading(false);
      setErrorMessage(error.errors[0].message);
      return;
    });

    const {
      getAccountByEmail: { id },
    } = res;

    await chrome.storage.sync.set({ ID: id });
    setID(id);
    setLoading(false);
  };

  const handleButtonClick = () => {
    chrome.tabs.create({ url: 'https://opensea.io/' });
  };

  // useEffect(() => {
  //   const font = new FontFace('inter', 'url(./fonts/Inter-Bold.tff)');
  //   document.fonts.add(font);
  // }, []);

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
      if (match && match[0]) {
        setInOpenSea(true);
        const collectionMatch = URL.match(collectionRegex);

        if (collectionMatch && collectionMatch[1]) {
          setCollection(collectionMatch[1]);
        }
      }
    }
  }, [URL]);

  useEffect(() => {
    if (ID && collection) {
      setLoading(true);

      request('http;//localhost:8000/graphql', GET_WATCHLIST_BY_ACCOUNT_ID, {
        accountId: ID,
      }).then((res) => {
        const { getWatchlistByAccount } = res;
        const collectionExist = getWatchlistByAccount.find(
          (col) => col.ticker === collection
        );
        if (collectionExist) {
          setErrorMessage(`${collection} already in users watchlist`);
          return;
        }
      });

      request('http://localhost:8000/graphql', ADD_TO_WATCHLIST, {
        accountId: ID,
        ticker: collection,
        variant: 'NFT',
      })
        .then((res) => {
          const {
            createWatchlist: { ok },
          } = res;
          if (ok) {
            setLoading(false);
            setSuccessMessage(`Collection ${collection} added to watchlist.`);
          }
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage('Collection already in watchlist');
          setLoading(false);
        });
    }
  }, [ID, collection]);

  if (!inOpenSea) {
    return (
      <div style={{ width: '380px' }}>
        <div className="d-flex flex-column" style={{ padding: '1em' }}>
          <h4 className="bg-secondary text-white p-2">Insider Mobile</h4>
          <p className=" ">
            This extension only works in Open Sea NFT Marketplace
          </p>
          <button
            className="btn btn-primary mx-auto"
            onClick={handleButtonClick}
          >
            Head to OpenSea.io
          </button>
        </div>
      </div>
    );
  }

  if (!ID) {
    return (
      <div style={{ width: '380px' }}>
        {console.log('id chck', ID)}
        <div className="d-flex flex-column" style={{ padding: '1em' }}>
          <h4 className="bg-secondary text-white p-2">Insider Mobile</h4>
          <p className=" ">
            To get started enter your Insider Mobile email address
          </p>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <div class="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Email address"
              aria-label="Email address"
              aria-describedby="button-addon2"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.code === 'Enter') {
                  handleEmailSet(tempEmail);
                }
              }}
            />
            <button
              className="btn btn-outline-secondary"
              style={{ width: '60px' }}
              onClick={() => handleEmailSet(tempEmail)}
            >
              {loading ? (
                <div class="spinner-border spinner-border-sm" role="status" />
              ) : (
                'Next'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div style={{ width: '380px' }}>
        <div className="d-flex flex-column" style={{ padding: '1em' }}>
          <h4 className="bg-secondary text-white p-2">Insider Mobile</h4>
          <p>
            Visit a collection here in open sea to start adding collections to
            your watch list
          </p>
        </div>
      </div>
    );
  }
  if (successMessage) {
    <div style={{ width: '380px' }}>
      <div className="d-flex flex-column" style={{ padding: '1em' }}>
        <h4 className="bg-secondary text-white p-2">Insider Mobile</h4>
        <p>Collection Added to Watchlist</p>
      </div>
    </div>;
  }

  return (
    <div className="container-fluid p-2" style={{ width: '380px' }}>
      <h4 className="bg-secondary text-white p-2">Insider Mobile</h4>
      <div className="d-flex flex-column" style={{ padding: '1em' }}>
        <div className="d-flex align-items-center border w-100 p-2">
          <img
            className="rounded-circle"
            src={collectionImage}
            alt={collection}
            style={{ height: '50px', width: '50px' }}
          />

          <h4
            className="ml-2"
            style={{ textTransform: 'capitalize', fontFamily: 'inter' }}
          >
            {collection.replace('-', ' ')}
          </h4>
        </div>
        {successMessage && (
          <div className="alert alert-success mt-2" role="alert">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger text-truncate mt-2" role="alert">
            {errorMessage}
          </div>
        )}
        <div className="d-flex justify-content-between mt-2">
          <button
            className="btn btn-primary "
            onClick={() => handleAddToWatchlist(ID, collection)}
          >
            {loading ? (
              <div class="spinner-border spinner-border-sm" role="status" />
            ) : (
              'Add To Watch List'
            )}
          </button>
          <button className="btn btn-secondary " onClick={() => setID()}>
            Update Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
