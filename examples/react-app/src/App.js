import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import AccountCard from './components/AccountCard.js';
import TokenCard from './components/TokenCard.js';
import TopicMessages from './components/TopicMessages.js';
const s = {
    container: { maxWidth: 860, margin: '0 auto', padding: '24px 16px' },
    header: { borderBottom: '2px solid #111', paddingBottom: 12, marginBottom: 20 },
    title: { margin: 0, fontSize: 22 },
    subtitle: { margin: '4px 0 0', color: '#555', fontSize: 12 },
    nav: { display: 'flex', gap: 8, marginBottom: 24 },
    tab: { padding: '6px 16px', border: '1px solid #111', background: 'white', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 },
    activeTab: { padding: '6px 16px', border: '1px solid #111', background: '#111', color: 'white', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 },
};
export default function App() {
    const [tab, setTab] = useState('account');
    return (_jsxs("div", { style: s['container'], children: [_jsxs("div", { style: s['header'], children: [_jsx("h1", { style: s['title'], children: "Hiero Explorer" }), _jsx("p", { style: s['subtitle'], children: "Live data from Hedera testnet via hiero-sdk-utils" })] }), _jsxs("nav", { style: s['nav'], children: [_jsx("button", { style: tab === 'account' ? s['activeTab'] : s['tab'], onClick: () => setTab('account'), children: "Account" }), _jsx("button", { style: tab === 'token' ? s['activeTab'] : s['tab'], onClick: () => setTab('token'), children: "Token" }), _jsx("button", { style: tab === 'topic' ? s['activeTab'] : s['tab'], onClick: () => setTab('topic'), children: "Topic Messages" })] }), tab === 'account' && _jsx(AccountCard, {}), tab === 'token' && _jsx(TokenCard, {}), tab === 'topic' && _jsx(TopicMessages, {})] }));
}
