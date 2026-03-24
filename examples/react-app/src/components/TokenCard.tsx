// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { useToken, useNFTs } from 'hiero-sdk-utils-react';

const s: Record<string, React.CSSProperties> = {
  card: { background: 'white', border: '1px solid #ddd', padding: 20, marginBottom: 16 },
  row: { display: 'flex', gap: 8, marginBottom: 16 },
  input: { flex: 1, padding: '6px 10px', border: '1px solid #ccc', fontFamily: 'monospace', fontSize: 13 },
  btn: { padding: '6px 16px', background: '#111', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 },
  label: { color: '#666', marginRight: 8, display: 'inline-block', width: 100 },
  error: { color: '#c00', padding: '8px 0' },
  nftRow: { borderTop: '1px solid #eee', padding: '6px 0', fontSize: 12 },
};

export default function TokenCard(): JSX.Element {
  const [input, setInput] = useState('');
  const [tokenId, setTokenId] = useState<string | null>(null);

  const { data: token, loading, error } = useToken(tokenId);
  const isNFT = token?.type === 'NON_FUNGIBLE_UNIQUE';
  const { data: nfts, loading: nftLoading } = useNFTs(isNFT ? tokenId : null, { limit: 5 });

  return (
    <div>
      <div style={s['card']}>
        <h2 style={{ margin: '0 0 16px' }}>Token Lookup</h2>
        <div style={s['row']}>
          <input
            style={s['input']}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') setTokenId(input); }}
            placeholder="0.0.X"
          />
          <button style={s['btn']} onClick={() => setTokenId(input)}>Search</button>
        </div>

        {loading && <p>Loading token...</p>}
        {error && <p style={s['error']}>Error: {error.message}</p>}
        {token && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={s['label']}>Name</td><td>{token.name}</td></tr>
              <tr><td style={s['label']}>Symbol</td><td>{token.symbol}</td></tr>
              <tr><td style={s['label']}>Type</td><td>{token.type}</td></tr>
              <tr><td style={s['label']}>Total supply</td><td>{token.total_supply}</td></tr>
              <tr><td style={s['label']}>Decimals</td><td>{token.decimals}</td></tr>
              <tr><td style={s['label']}>Treasury</td><td>{token.treasury_account_id}</td></tr>
            </tbody>
          </table>
        )}
      </div>

      {isNFT && (
        <div style={s['card']}>
          <h3 style={{ margin: '0 0 12px' }}>NFTs (first 5)</h3>
          {nftLoading && <p>Loading NFTs...</p>}
          {nfts && nfts.map(nft => (
            <div key={nft.serial_number} style={s['nftRow']}>
              Serial #{nft.serial_number} — Owner: {nft.account_id}
            </div>
          ))}
          {nfts && nfts.length === 0 && <p>No NFTs found.</p>}
        </div>
      )}
    </div>
  );
}
