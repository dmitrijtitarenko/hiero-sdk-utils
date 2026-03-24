// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import type { TransactionInfo } from 'hiero-sdk-utils';
import { useTransaction } from 'hiero-sdk-utils-react';

const s: Record<string, React.CSSProperties> = {
  row: { borderTop: '1px solid #eee', padding: '8px 0', display: 'flex', gap: 12, flexWrap: 'wrap' },
  id: { fontFamily: 'monospace', fontSize: 11, color: '#007', cursor: 'pointer', textDecoration: 'underline', wordBreak: 'break-all' },
  name: { fontSize: 12, color: '#555' },
  success: { fontSize: 12, color: '#080' },
  fail: { fontSize: 12, color: '#c00' },
  detail: { background: '#f9f9f9', border: '1px solid #eee', padding: '8px 12px', margin: '4px 0 8px', fontSize: 12 },
};

function TransactionDetail({ txId }: { txId: string }): JSX.Element {
  const { data, loading } = useTransaction(txId);
  if (loading) return <div style={s['detail']}>Loading...</div>;
  if (!data) return <></>;
  return (
    <div style={s['detail']}>
      <div><span style={{ color: '#666' }}>Charged fee: </span>{data.charged_tx_fee.toLocaleString()} tinybars</div>
      <div><span style={{ color: '#666' }}>Transfers: </span>{data.transfers.length}</div>
      <div><span style={{ color: '#666' }}>Token transfers: </span>{data.token_transfers.length}</div>
    </div>
  );
}

export default function TransactionList({ transactions }: { transactions: TransactionInfo[] }): JSX.Element {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (transactions.length === 0) return <p>No transactions found.</p>;

  return (
    <div>
      {transactions.map(tx => (
        <div key={tx.transaction_id}>
          <div style={s['row']}>
            <span
              style={s['id']}
              onClick={() => setExpanded(expanded === tx.transaction_id ? null : tx.transaction_id)}
              title="Click to expand"
            >
              {tx.transaction_id}
            </span>
            <span style={s['name']}>{tx.name}</span>
            <span style={tx.result === 'SUCCESS' ? s['success'] : s['fail']}>{tx.result}</span>
          </div>
          {expanded === tx.transaction_id && <TransactionDetail txId={tx.transaction_id} />}
        </div>
      ))}
    </div>
  );
}
