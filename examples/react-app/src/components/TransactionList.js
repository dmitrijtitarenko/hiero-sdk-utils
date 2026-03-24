import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { useTransaction } from 'hiero-sdk-utils-react';
const s = {
    row: { borderTop: '1px solid #eee', padding: '8px 0', display: 'flex', gap: 12, flexWrap: 'wrap' },
    id: { fontFamily: 'monospace', fontSize: 11, color: '#007', cursor: 'pointer', textDecoration: 'underline', wordBreak: 'break-all' },
    name: { fontSize: 12, color: '#555' },
    success: { fontSize: 12, color: '#080' },
    fail: { fontSize: 12, color: '#c00' },
    detail: { background: '#f9f9f9', border: '1px solid #eee', padding: '8px 12px', margin: '4px 0 8px', fontSize: 12 },
};
function TransactionDetail({ txId }) {
    const { data, loading } = useTransaction(txId);
    if (loading)
        return _jsx("div", { style: s['detail'], children: "Loading..." });
    if (!data)
        return _jsx(_Fragment, {});
    return (_jsxs("div", { style: s['detail'], children: [_jsxs("div", { children: [_jsx("span", { style: { color: '#666' }, children: "Charged fee: " }), data.charged_tx_fee.toLocaleString(), " tinybars"] }), _jsxs("div", { children: [_jsx("span", { style: { color: '#666' }, children: "Transfers: " }), data.transfers.length] }), _jsxs("div", { children: [_jsx("span", { style: { color: '#666' }, children: "Token transfers: " }), data.token_transfers.length] })] }));
}
export default function TransactionList({ transactions }) {
    const [expanded, setExpanded] = useState(null);
    if (transactions.length === 0)
        return _jsx("p", { children: "No transactions found." });
    return (_jsx("div", { children: transactions.map(tx => (_jsxs("div", { children: [_jsxs("div", { style: s['row'], children: [_jsx("span", { style: s['id'], onClick: () => setExpanded(expanded === tx.transaction_id ? null : tx.transaction_id), title: "Click to expand", children: tx.transaction_id }), _jsx("span", { style: s['name'], children: tx.name }), _jsx("span", { style: tx.result === 'SUCCESS' ? s['success'] : s['fail'], children: tx.result })] }), expanded === tx.transaction_id && _jsx(TransactionDetail, { txId: tx.transaction_id })] }, tx.transaction_id))) }));
}
