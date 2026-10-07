import React, { useState } from 'react';
import Home from '../layout/Glavni/Glavni';
import Game from '../layout/Game/Game';


function App() {
  const [screen, setScreen] = useState('home');
  const [count, setCount] = useState(10);
  const [direction, setDirection] = useState('ru-tj');   // 🆕


  const startGame = (cnt, dir) => {
    setCount(cnt);
    setDirection(dir);
    setScreen('game');
  };

  return screen === 'home'
    ? <Home onStart={startGame} />
    : (
      <Game
        count={count}
        direction={direction}
        onExit={() => setScreen('home')}
      />
    );
}

export default App;