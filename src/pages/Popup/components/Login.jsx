import React, { useState } from 'react';

import icon from '../../../assets/img/insider_icon.svg';
import { request } from 'graphql-request';
import { GET_ACCOUNT_ID } from './../queries';

const Login = ({ setID }) => {
  const [tempEmail, setTempEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

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
    if (res.account === null) {
      setLoading(false);
      setErrorMessage('No account linked to that email');
    }

    const {
      account: { id },
    } = res;

    await chrome.storage.sync.set({ ID: id });

    setID(id);
    setLoading(false);

    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    chrome.tabs.sendMessage(tab.id, { message: 'reload' });
  };
  return (
    <div className="p-3 d-flex flex-column">
      <div
        className="px-3 pb-3 d-flex flex-column align-items-center "
        style={{
          paddingTop: '12px',
        }}
      >
        <div className="d-flex align-items-center">
          <img
            src={icon}
            alt="insider icon"
            style={{ height: '14px', width: '22px' }}
          />
          <div
            style={{
              marginLeft: '8px',
              color: '#1D1D1F',
              fontSize: '14px',
              fontWeight: '600',
              lineHeight: '20px',
            }}
          >
            Insider
          </div>
        </div>
        <div
          style={{
            fontWeight: '400',
            fontSize: '14px',
            letterSpacing: '-1%',
            color: '#3C3C43',
            textAlign: 'center',
            marginTop: '12px',
          }}
        >
          To get started enter your Insider Mobile email address
        </div>
      </div>
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
  );
};

export default Login;
