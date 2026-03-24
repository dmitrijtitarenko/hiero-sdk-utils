import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { useAccount, useAccountTransactions } from 'hiero-sdk-utils-react';
import TransactionList from './TransactionList.js';
const s = {
    card: { background: 'white', border: '1px solid #ddd', padding: 20, marginBottom: 16 },
    row: { display: 'flex', gap: 8, marginBottom: 16 },
    input: { flex: 1, padding: '6px 10px', border: '1px solid #ccc', fontFamily: 'monospace', fontSize: 13 },
    btn: { padding: '6px 16px', background: '#111', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 },
    label: { color: '#666', marginRight: 8, display: 'inline-block', width: 100 },
    error: { color: '#c00', padding: '8px 0' },
};
export default function AccountCard() {
    const [input, setInput] = useState('0.0.2');
    const [accountId, setAccountId] = useState('0.0.2');
    const { data: account, loading, error } = useAccount(accountId);
    const { data: txs, loading: txLoading } = useAccountTransactions(accountId, { limit: 5 });
    return (_jsxs("div", { children: [_jsxs("div", { style: s['card'], children: [_jsx("h2", { style: { margin: '0 0 16px' }, children: "Account Lookup" }), _jsxs("div", { style: s['row'], children: [_jsx("input", { style: s['input'], value: input, onChange: e => setInput(e.target.value), onKeyDown: e => { if (e.key === 'Enter')
                                    setAccountId(input); }, placeholder: "0.0.X" }), _jsx("button", { style: s['btn'], onClick: () => setAccountId(input), children: "Search" })] }), loading && _jsx("p", { children: "Loading account..." }), error && _jsxs("p", { style: s['error'], children: ["Error: ", error.message] }), account && (_jsx("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", { style: s['label'], children: "Account" }), _jsx("td", { children: account.account })] }), _jsxs("tr", { children: [_jsx("td", { style: s['label'], children: "Balance" }), _jsxs("td", { children: [account.balance.balance.toLocaleString(), " tinybars"] })] }), _jsxs("tr", { children: [_jsx("td", { style: s['label'], children: "Key type" }), _jsx("td", { children: account.key?._type ?? 'none' })] }), _jsxs("tr", { children: [_jsx("td", { style: s['label'], children: "Created" }), _jsx("td", { children: account.created_timestamp ?? 'unknown' })] }), _jsxs("tr", { children: [_jsx("td", { style: s['label'], children: "EVM" }), _jsx("td", { children: account.evm_address ?? 'none' })] })] }) }))] }), account && (_jsxs("div", { style: s['card'], children: [_jsx("h3", { style: { margin: '0 0 12px' }, children: "Recent Transactions (click to expand)" }), txLoading && _jsx("p", { children: "Loading transactions..." }), txs && _jsx(TransactionList, { transactions: txs })] }))] }));
}
