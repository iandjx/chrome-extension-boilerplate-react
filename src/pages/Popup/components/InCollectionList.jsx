import React from 'react';
import icon from '../../../assets/img/insider_icon.svg';

const InCollectionList = () => {
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
          Visit a collection page to add them to your Insider watchlist
        </div>
      </div>
    </div>
  );
};

export default InCollectionList;
