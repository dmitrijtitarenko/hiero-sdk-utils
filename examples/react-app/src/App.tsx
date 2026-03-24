// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import AccountCard from './components/AccountCard.js';
import TokenCard from './components/TokenCard.js';
import TopicMessages from './components/TopicMessages.js';

type Tab = 'account' | 'token' | 'topic';

const s: Record<string, React.CSSProperties> = {
  container: { maxWidth: 860, margin: '0 auto', padding: '24px 16px' },
  header: { borderBottom: '2px solid #111', paddingBottom: 12, marginBottom: 20 },
  title: { margin: 0, fontSize: 22 },
  subtitle: { margin: '4px 0 0', color: '#555', fontSize: 12 },
  nav: { display: 'flex', gap: 8, marginBottom: 24 },
  tab: { padding: '6px 16px', border: '1px solid #111', background: 'white', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 },
  activeTab: { padding: '6px 16px', border: '1px solid #111', background: '#111', color: 'white', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 },
};

export default function App(): JSX.Element {
  const [tab, setTab] = useState<Tab>('account');

  return (
    <div style={s['container']}>
      <div style={s['header']}>
        <h1 style={s['title']}>Hiero Explorer</h1>
        <p style={s['subtitle']}>Live data from Hedera testnet via hiero-sdk-utils</p>
      </div>
      <nav style={s['nav']}>
        <button style={tab === 'account' ? s['activeTab'] : s['tab']} onClick={() => setTab('account')}>Account</button>
        <button style={tab === 'token'   ? s['activeTab'] : s['tab']} onClick={() => setTab('token')}>Token</button>
        <button style={tab === 'topic'   ? s['activeTab'] : s['tab']} onClick={() => setTab('topic')}>Topic Messages</button>
      </nav>
      {tab === 'account' && <AccountCard />}
      {tab === 'token'   && <TokenCard />}
      {tab === 'topic'   && <TopicMessages />}
    </div>
  );
}
