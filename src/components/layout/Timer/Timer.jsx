import React, { useEffect, useState } from 'react';
import { playSound, stopSound } from '../Sound/Sound.jsx';

function Timer({ duration = 12, onTimeUp, resetKey }) {
  const [time, setTime] = useState(duration);

  // Сброс при новом вопросе
  useEffect(() => {
    setTime(duration);
  }, [resetKey, duration]);

  // Основной отсчёт
  useEffect(() => {
    if (time <= 0) {
      onTimeUp();
      return;
    }

    playSound('tick', { volume: 0.3 });


    const id = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [time]);

  // Останавливаем звуки при размонтировании
  useEffect(() => {
    return () => {
      stopSound('tick');
      stopSound('tickFast');
    };
  }, []);

  return <div className="timer">⏱ {time} сек</div>;
}

export default Timer;