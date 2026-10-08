import React, { useState } from 'react';
import Home from '../layout/Glavni/Glavni.jsx';
import Game from '../layout/Game/Game.jsx';
import Records from '../layout/Records/Records.jsx';
import Settings from '../layout/Settings/Settings.jsx';
import BottomNav from '../layout/BottomNav/BottomNav.jsx';

function App() {
  const [tab, setTab] = useState('home');
  const [gameKey, setGameKey] = useState(0);   // для перезапуска игры

  const startGame = () => {
    setGameKey((k) => k + 1);
    setTab('game');
  };

  const exitGame = () => setTab('home');

  return (
    <div className="app">
      <main className="app-content">
        {tab === 'home' && <Home onStart={startGame} />}
        {tab === 'game' && <Game key={gameKey} onExit={exitGame} />}
        {tab === 'records' && <Records />}
        {tab === 'settings' && <Settings />}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default App;