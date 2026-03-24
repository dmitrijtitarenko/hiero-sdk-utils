// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { useTopicMessages } from 'hiero-sdk-utils-react';

const s: Record<string, React.CSSProperties> = {
  card: { background: 'white', border: '1px solid #ddd', padding: 20, marginBottom: 16 },
  row: { display: 'flex', gap: 8, marginBottom: 16 },
  input: { flex: 1, padding: '6px 10px', border: '1px solid #ccc', fontFamily: 'monospace', fontSize: 13 },
  btn: { padding: '6px 16px', background: '#111', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 },
  error: { color: '#c00', padding: '8px 0' },
  msgRow: { borderTop: '1px solid #eee', padding: '8px 0', fontSize: 12 },
  seq: { fontWeight: 'bold' as const, marginRight: 8 },
  ts: { color: '#666', fontSize: 11, marginRight: 8 },
};

function decodeBase64(encoded: string): string {
  try { return atob(encoded); } catch { return encoded; }
}

export default function TopicMessages(): JSX.Element {
  const [input, setInput] = useState('0.0.7399331');
  const [topicId, setTopicId] = useState<string | null>(null);

  const { data: messages, loading, error, refetch } = useTopicMessages(topicId, { limit: 10 });

  function handleLoad(): void {
    setTopicId(input);
    refetch();
  }

  return (
    <div style={s['card']}>
      <h2 style={{ margin: '0 0 16px' }}>HCS Topic Messages</h2>
      <div style={s['row']}>
        <input
          style={s['input']}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleLoad(); }}
          placeholder="0.0.X"
        />
        <button style={s['btn']} onClick={handleLoad}>Load</button>
      </div>

      {loading && <p>Loading messages...</p>}
      {error && <p style={s['error']}>Error: {error.message}</p>}
      {messages && messages.length === 0 && <p>No messages found for this topic.</p>}
      {messages && messages.map(msg => (
        <div key={msg.sequence_number} style={s['msgRow']}>
          <span style={s['seq']}>#{msg.sequence_number}</span>
          <span style={s['ts']}>{msg.consensus_timestamp}</span>
          <span style={{ wordBreak: 'break-all' }}>{decodeBase64(msg.message)}</span>
        </div>
      ))}
    </div>
  );
}
