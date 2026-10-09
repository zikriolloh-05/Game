import React, { useState } from 'react';
import Home from '../layout/Glavni/Glavni.jsx';
import PlaySetup from '../layout/PlaySetup/PlaySetup.jsx';   // 🆕
import Game from '../layout/Game/Game.jsx';
import VoiceGame from '../layout/VoiceGame/VoiceGame.jsx';
import Records from '../layout/Records/Records.jsx';
import Settings from '../layout/Settings/Settings.jsx';
import BottomNav from '../layout/BottomNav/BottomNav.jsx';
import { getSettings } from '../layout/GameUtils/gameUtils.jsx';

function App() {
  const [tab, setTab] = useState('home');
  const [gameKey, setGameKey] = useState(0);

  const goToSetup = () => setTab('setup');
  console.log('🔵 goToSetup — переключение на setup');  // 🆕
  const startGame = () => {
    setGameKey((k) => k + 1);
    setTab('game');
  };

  const exitGame = () => setTab('home');

  const settings = getSettings();
  const isVoiceMode = settings.mode === 'voice';

  return (
    <div className="app">
      <main className="app-content">
        {tab === 'home' && <Home onStart={goToSetup} />}

        {/* 🆕 Экран подготовки */}
        {tab === 'setup' && (
          <PlaySetup onStart={startGame} onBack={() => setTab('home')} />
        )}

        {tab === 'game' && (
          isVoiceMode
            ? <VoiceGame key={gameKey} onExit={exitGame} />
            : <Game key={gameKey} onExit={exitGame} />
        )}

        {tab === 'records' && <Records />}
        {tab === 'settings' && <Settings />}
      </main>

      <BottomNav
        active={tab}
        onChange={(newTab) => {
          // 🆕 Если нажали на "Игра" — идём на setup, а не сразу в игру
          if (newTab === 'game') {
            setTab('setup');
          } else {
            setTab(newTab);
          }
        }}
      />    </div>
  );
}

export default App;