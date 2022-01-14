import React from 'react';
import icon from '../../../assets/img/insider_icon.svg';
import Button from 'react-bootstrap/Button';

const openSeaRedirect = () => {
  chrome.tabs.create({ url: 'https://opensea.io/explore-collections' });
};

const InOpenSea = () => {
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
          Visit a collection in OpenSea to start adding them to your Insider
          watchlist
        </div>
      </div>

      <Button
        className="shadow"
        style={{
          width: '100%',
          height: '44px',
          boxShadow: '0px, 2px, 8px, #117BEE',
          background: '#117BEE',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '16px',
        }}
        onClick={openSeaRedirect}
      >
        Go to collections page
      </Button>
    </div>
  );
};

export default InOpenSea;
