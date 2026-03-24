// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { useAccount, useAccountTransactions } from 'hiero-sdk-utils-react';
import TransactionList from './TransactionList.js';

const s: Record<string, React.CSSProperties> = {
  card: { background: 'white', border: '1px solid #ddd', padding: 20, marginBottom: 16 },
  row: { display: 'flex', gap: 8, marginBottom: 16 },
  input: { flex: 1, padding: '6px 10px', border: '1px solid #ccc', fontFamily: 'monospace', fontSize: 13 },
  btn: { padding: '6px 16px', background: '#111', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 },
  label: { color: '#666', marginRight: 8, display: 'inline-block', width: 100 },
  error: { color: '#c00', padding: '8px 0' },
};

export default function AccountCard(): JSX.Element {
  const [input, setInput] = useState('0.0.2');
  const [accountId, setAccountId] = useState<string | null>('0.0.2');

  const { data: account, loading, error } = useAccount(accountId);
  const { data: txs, loading: txLoading } = useAccountTransactions(accountId, { limit: 5 });

  return (
    <div>
      <div style={s['card']}>
        <h2 style={{ margin: '0 0 16px' }}>Account Lookup</h2>
        <div style={s['row']}>
          <input
            style={s['input']}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') setAccountId(input); }}
            placeholder="0.0.X"
          />
          <button style={s['btn']} onClick={() => setAccountId(input)}>Search</button>
        </div>

        {loading && <p>Loading account...</p>}
        {error && <p style={s['error']}>Error: {error.message}</p>}
        {account && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={s['label']}>Account</td><td>{account.account}</td></tr>
              <tr><td style={s['label']}>Balance</td><td>{account.balance.balance.toLocaleString()} tinybars</td></tr>
              <tr><td style={s['label']}>Key type</td><td>{account.key?._type ?? 'none'}</td></tr>
              <tr><td style={s['label']}>Created</td><td>{account.created_timestamp ?? 'unknown'}</td></tr>
              <tr><td style={s['label']}>EVM</td><td>{account.evm_address ?? 'none'}</td></tr>
            </tbody>
          </table>
        )}
      </div>

      {account && (
        <div style={s['card']}>
          <h3 style={{ margin: '0 0 12px' }}>Recent Transactions (click to expand)</h3>
          {txLoading && <p>Loading transactions...</p>}
          {txs && <TransactionList transactions={txs} />}
        </div>
      )}
    </div>
  );
}
