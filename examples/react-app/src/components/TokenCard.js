import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { useToken, useNFTs } from 'hiero-sdk-utils-react';
const s = {
    card: { background: 'white', border: '1px solid #ddd', padding: 20, marginBottom: 16 },
    row: { display: 'flex', gap: 8, marginBottom: 16 },
    input: { flex: 1, padding: '6px 10px', border: '1px solid #ccc', fontFamily: 'monospace', fontSize: 13 },
    btn: { padding: '6px 16px', background: '#111', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 },
    label: { color: '#666', marginRight: 8, display: 'inline-block', width: 100 },
    error: { color: '#c00', padding: '8px 0' },
    nftRow: { borderTop: '1px solid #eee', padding: '6px 0', fontSize: 12 },
};
export default function TokenCard() {
    const [input, setInput] = useState('');
    const [tokenId, setTokenId] = useState(null);
    const { data: token, loading, error } = useToken(tokenId);
    const isNFT = token?.type === 'NON_FUNGIBLE_UNIQUE';
    const { data: nfts, loading: nftLoading } = useNFTs(isNFT ? tokenId : null, { limit: 5 });
    return (_jsxs("div", { children: [_jsxs("div", { style: s['card'], children: [_jsx("h2", { style: { margin: '0 0 16px' }, children: "Token Lookup" }), _jsxs("div", { style: s['row'], children: [_jsx("input", { style: s['input'], value: input, onChange: e => setInput(e.target.value), onKeyDown: e => { if (e.key === 'Enter')
                                    setTokenId(input); }, placeholder: "0.0.X" }), _jsx("button", { style: s['btn'], onClick: () => setTokenId(input), children: "Search" })] }), loading && _jsx("p", { children: "Loading token..." }), error && _jsxs("p", { style: s['error'], children: ["Error: ", error.message] }), token && (_jsx("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", { style: s['label'], children: "Name" }), _jsx("td", { children: token.name })] }), _jsxs("tr", { children: [_jsx("td", { style: s['label'], children: "Symbol" }), _jsx("td", { children: token.symbol })] }), _jsxs("tr", { children: [_jsx("td", { style: s['label'], children: "Type" }), _jsx("td", { children: token.type })] }), _jsxs("tr", { children: [_jsx("td", { style: s['label'], children: "Total supply" }), _jsx("td", { children: token.total_supply })] }), _jsxs("tr", { children: [_jsx("td", { style: s['label'], children: "Decimals" }), _jsx("td", { children: token.decimals })] }), _jsxs("tr", { children: [_jsx("td", { style: s['label'], children: "Treasury" }), _jsx("td", { children: token.treasury_account_id })] })] }) }))] }), isNFT && (_jsxs("div", { style: s['card'], children: [_jsx("h3", { style: { margin: '0 0 12px' }, children: "NFTs (first 5)" }), nftLoading && _jsx("p", { children: "Loading NFTs..." }), nfts && nfts.map(nft => (_jsxs("div", { style: s['nftRow'], children: ["Serial #", nft.serial_number, " \u2014 Owner: ", nft.account_id] }, nft.serial_number))), nfts && nfts.length === 0 && _jsx("p", { children: "No NFTs found." })] }))] }));
}
