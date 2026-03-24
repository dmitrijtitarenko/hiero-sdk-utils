// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HieroClient, Networks } from 'hiero-sdk-utils';
import { HieroProvider } from 'hiero-sdk-utils-react';
import App from './App.js';

const client = new HieroClient({
  baseUrl: Networks.testnet,
  maxRequestsPerSecond: 10,
});

const rootEl = document.getElementById('root');
if (rootEl === null) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <React.StrictMode>
    <HieroProvider client={client}>
      <App />
    </HieroProvider>
  </React.StrictMode>,
);
