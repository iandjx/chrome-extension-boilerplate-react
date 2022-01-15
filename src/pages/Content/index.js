import { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { request, gql } from 'graphql-request';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const siteRegex = /opensea\.io/;
const collectionRegex = /opensea\.io\/collection\/(.*)/;

const GET_ACCOUNT_ID = gql`
  query GetAccountByEmail($email: String!) {
    getAccountByEmail(email: $email) {
      id
    }
  }
`;

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

function SetEmailModal({ setID, ...props }) {
  const [email, setEmail] = React.useState();
  const [loading, setLoading] = React.useState();
  const [errorMessage, setErrorMessage] = React.useState();

  const handleEmailSet = async (emailAddress, closeModal) => {
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
    closeModal();
  };
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Insider Mobile Login
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Enter your email address</p>
        {errorMessage && (
          <div className="alert alert-danger text-truncate mt-2" role="alert">
            {errorMessage}
          </div>
        )}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Email address"
            aria-label="Email address"
            aria-describedby="button-addon2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === 'Enter') {
                handleEmailSet(email);
              }
            }}
          />
          <button
            className="btn btn-outline-secondary"
            style={{ width: '60px' }}
            onClick={() => handleEmailSet(email, props.onHide)}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm" role="status" />
            ) : (
              'Next'
            )}
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function App() {
  const [modalShow, setModalShow] = React.useState(false);
  const [ID, setID] = React.useState();
  const [loading, setLoading] = React.useState();
  const [errorMessage, setErrorMessage] = React.useState();
  const [successMessage, setSuccessMessage] = React.useState();
  const [collection, setCollection] = useState();

  useEffect(() => {
    chrome.storage.sync.get('ID', ({ ID }) => {
      if (ID) {
        setID(ID);
      }
    });
  }, []);

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
    if (!ID) {
      setModalShow(true);
    } else {
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
    }
  };
  return (
    <>
      <div className="mt-auto">
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
        <Button
          variant="primary"
          onClick={() => handleAddToWatchlist(ID, collection)}
          disabled={loading}
        >
          {loading ? (
            <div className="spinner-border spinner-border-sm" role="status" />
          ) : (
            'Add To Watchlist'
          )}
        </Button>
      </div>

      <SetEmailModal
        setID={setID}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}
setInterval(() => {
  if (
    !document.getElementById('insider') &&
    document.querySelector(
      '#main > div > div > div > div:nth-child(2) > div:nth-child(3)'
    )
  ) {
    var temp = document.createElement('div');
    temp.setAttribute('style', 'height: 48px; display:flex;');
    temp.setAttribute('id', 'insider');

    render(<App />, temp);
    var container = document.querySelector(
      '#main > div > div > div > div:nth-child(2) > div:nth-child(3)'
    );
    container.appendChild(temp);
  }
}, 2500);
