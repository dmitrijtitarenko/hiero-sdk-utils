import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { useTopicMessages } from 'hiero-sdk-utils-react';
const s = {
    card: { background: 'white', border: '1px solid #ddd', padding: 20, marginBottom: 16 },
    row: { display: 'flex', gap: 8, marginBottom: 16 },
    input: { flex: 1, padding: '6px 10px', border: '1px solid #ccc', fontFamily: 'monospace', fontSize: 13 },
    btn: { padding: '6px 16px', background: '#111', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 },
    error: { color: '#c00', padding: '8px 0' },
    msgRow: { borderTop: '1px solid #eee', padding: '8px 0', fontSize: 12 },
    seq: { fontWeight: 'bold', marginRight: 8 },
    ts: { color: '#666', fontSize: 11, marginRight: 8 },
};
function decodeBase64(encoded) {
    try {
        return atob(encoded);
    }
    catch {
        return encoded;
    }
}
export default function TopicMessages() {
    const [input, setInput] = useState('0.0.7399331');
    const [topicId, setTopicId] = useState(null);
    const { data: messages, loading, error, refetch } = useTopicMessages(topicId, { limit: 10 });
    function handleLoad() {
        setTopicId(input);
        refetch();
    }
    return (_jsxs("div", { style: s['card'], children: [_jsx("h2", { style: { margin: '0 0 16px' }, children: "HCS Topic Messages" }), _jsxs("div", { style: s['row'], children: [_jsx("input", { style: s['input'], value: input, onChange: e => setInput(e.target.value), onKeyDown: e => { if (e.key === 'Enter')
                            handleLoad(); }, placeholder: "0.0.X" }), _jsx("button", { style: s['btn'], onClick: handleLoad, children: "Load" })] }), loading && _jsx("p", { children: "Loading messages..." }), error && _jsxs("p", { style: s['error'], children: ["Error: ", error.message] }), messages && messages.length === 0 && _jsx("p", { children: "No messages found for this topic." }), messages && messages.map(msg => (_jsxs("div", { style: s['msgRow'], children: [_jsxs("span", { style: s['seq'], children: ["#", msg.sequence_number] }), _jsx("span", { style: s['ts'], children: msg.consensus_timestamp }), _jsx("span", { style: { wordBreak: 'break-all' }, children: decodeBase64(msg.message) })] }, msg.sequence_number)))] }));
}
