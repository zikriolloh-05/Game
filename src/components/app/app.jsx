import React, { useState } from 'react';
import Home from '../layout/home/home';
import Game from '../layout/Game/Game';


function App() {
  const [screen, setScreen] = useState('home');
  const [count, setCount] = useState(10);

  const startGame = (cnt) => {
    setCount(cnt);
    setScreen('game');
  };

  return screen === 'home'
    ? <Home onStart={startGame} />
    : (
      <Game
        count={count}
        onExit={() => setScreen('home')}
      />
    );
}

export default App;