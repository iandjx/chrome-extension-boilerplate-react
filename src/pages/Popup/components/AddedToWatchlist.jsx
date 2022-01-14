import React from 'react';
import icon from '../../../assets/img/insider_icon.svg';
import Button from 'react-bootstrap/button';
import { request } from 'graphql-request';

import { DELETE_FROM_WATCHLIST } from '../queries';
const removeFromWatchlist = async (accountId, ticker) => {
  await request('http://localhost:8000/graphql', DELETE_FROM_WATCHLIST, {
    accountId,
    ticker,
    variant: 'NFT',
  }).catch((err) => {
    throw err;
  });
  window.close();
};
const AddedToWatchlist = ({
  newlyAdded,
  collectionImage,
  collection,
  accountId,
}) => {
  return (
    <div className="p-3">
      <div
        className="p-3 d-flex align-items-center"
        style={{ borderRadius: '8px', background: '#EDF2F7' }}
      >
        <img
          src={icon}
          alt="insider icon"
          style={{ height: '14px', width: '22px' }}
        />
        <span
          className="fw-bold"
          style={{ marginLeft: '12px', fontSize: '16px', fontWeight: '700' }}
        >
          Added to watchlist
        </span>
        {/* {newlyAdded && ( */}
        <Button
          variant="link"
          style={{ fontWeight: 500, color: '#3C3C4399', marginLeft: 'auto' }}
          onClick={() => removeFromWatchlist(accountId, collection)}
        >
          Undo
        </Button>
        {/* )} */}
      </div>
      <div
        style={{
          marginTop: '12px',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '8px',
          paddingBottom: '8px',
          borderColor: '#EDF2F7',
          borderRadius: '8px',
        }}
        className="d-flex align-items-center border"
      >
        <img
          className="rounded-circle"
          src={collectionImage}
          alt={collection}
          style={{ height: '40px', width: '40px', marginRight: '8px' }}
        />
        <div
          style={{
            fontWeight: 'bold',
            color: '#3C3C43',
            fontSize: '16px',
            textTransform: 'capitalize',
          }}
        >
          {collection}
        </div>
      </div>
    </div>
  );
};

export default AddedToWatchlist;
