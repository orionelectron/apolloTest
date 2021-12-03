import React from 'react';
import { render } from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';


import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

function getEdgesByCursor(edges, first, cursor, readField) {
  let pos = -1;

  for (let i = edges.length - 1; i >= 0; --i) {
    if (cursor === readField("cursor", edges[i])) {
      pos = i;
      break;

    }
    
  }
 let lastEdgePos = pos + first;
  if (lastEdgePos >= edges.length){
    lastEdgePos = edges.length -1 ;
  }
  const returnedEdges = edges.filter((edge, index) => {
    if (index > pos && index <= lastEdgePos) {
      return true;
    }
  });
  return returnedEdges;

}

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          books: {
            keyArgs: false,
            merge: (existing = [], incoming, { readField }) => {
              console.log(incoming);
              console.log(existing);
              if (existing.length === 0) {
                return incoming
              }
              const forkedExisting = Object.assign({}, existing);
              const afterIndex = forkedExisting.edges.length - 1;
              const uniqueEdges = [];
              forkedExisting.pageInfo = { startCursor: existing.pageInfo.startCursor, endCursor: incoming.pageInfo.endCursor };

              forkedExisting.edges = [...forkedExisting.edges, ...incoming.edges];
              console.log(forkedExisting);
              return forkedExisting;
            },
            read: (existing, { args: { first, after }, readField }) => {
              if (existing) {
                const edges = getEdgesByCursor(existing.edges, first, after, readField);
                const forkedExisting = Object.assign({}, existing);
                forkedExisting.edges = edges;
                console.log("After " + after);
                return forkedExisting;
              }

            }
          }
        }
      }
    }
  })
});

render(

  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>

  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
