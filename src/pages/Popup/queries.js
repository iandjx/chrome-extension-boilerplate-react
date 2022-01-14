import { gql } from 'graphql-request';
export const GET_ACCOUNT_ID = gql`
  query ACCOUNT($email: String!) {
    account(input: { email: $email }) {
      id
    }
  }
`;

export const ADD_TO_WATCHLIST = gql`
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

export const GET_WATCHLIST_BY_ACCOUNT_ID = gql`
  query GET_WATCHLIST_BY_ACCOUNT($accountId: Int!) {
    getWatchlistByAccount(accountId: $accountId, variant: "NFT") {
      id
      ticker
    }
  }
`;

export const DELETE_FROM_WATCHLIST = gql`
  mutation DELETE_FROM_WATCHLIST($accountId: ID!, $ticker: String!) {
    deleteWatchlist(accountId: $accountId, ticker: $ticker) {
      ok
    }
  }
`;
