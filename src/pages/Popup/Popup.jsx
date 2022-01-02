import React, { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request';

const siteRegex = /opensea\.io/;
const collectionRegex = /opensea\.io\/collection\/(.*)/;

// const GET_POKEMONS = gql`
//   query pokemons($limit: Int, $offset: Int) {
//     pokemons(limit: $limit, offset: $offset) {
//       count
//       next
//       previous
//       status
//       message
//       results {
//         url
//         name
//         image
//       }
//     }
//   }
// `;
const Popup = () => {
  const [URL, setURL] = useState();
  const [collection, setCollection] = useState();
  const [emailAddress, setEmailAddress] = useState();
  const [inOpenSea, setInOpenSea] = useState(false);
  const [collectionImage, setCollectionImage] = useState();
  const [tempEmail, setTempEmail] = useState();
  const [loading, setLoading] = useState(false);

  const handleEmailSet = (emailAddress) => {
    chrome.storage.sync.set({ emailAddress });
    setEmailAddress(emailAddress);
  };

  const handleButtonClick = () => {
    chrome.tabs.create({ url: 'https://opensea.io/' });
  };

  useEffect(() => {
    chrome.storage.sync.get('emailAddress', ({ emailAddress }) => {
      if (emailAddress) {
        setEmailAddress(emailAddress);
      }
    });

    // chrome.storage.sync.get('collectionImage', ({ collectionImage }) => {
    //   if (collectionImage) {
    //     setCollectionImage(collectionImage);
    //   }
    // });
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

  // useEffect(() => {
  //   request('https://graphql-pokeapi.graphcdn.app/', GET_POKEMONS).then(
  //     (data) => console.log(data)
  //   );
  // }, []);

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

  if (!emailAddress) {
    return (
      <div style={{ width: '380px' }}>
        <div className="d-flex flex-column" style={{ padding: '1em' }}>
          <h4 className="bg-secondary text-white p-2">Insider Mobile</h4>
          <p className=" ">
            To get started enter your Insider Mobile email address
          </p>
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

          <h4 className="ml-2" style={{ textTransform: 'capitalize' }}>
            {collection.replace('-', ' ')}
          </h4>
        </div>
        <div className="d-flex justify-content-around mt-3">
          <button className="btn btn-primary " onClick={handleButtonClick}>
            Add To Watchlist
          </button>
          <button className="btn btn-secondary " onClick={handleButtonClick}>
            Update Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
