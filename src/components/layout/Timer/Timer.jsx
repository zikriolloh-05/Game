import React, { useEffect, useState } from 'react';
import { playSound, stopSound } from '../Sound/Sound.jsx';
import './Timer.css';

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

    if (time > 5) {
      playSound('tick', { volume: 0.3 });
    } else {
      playSound('tickFast', { volume: 0.5 });
    }

    const id = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [time]);

  useEffect(() => {
    return () => {
      stopSound('tick');
      stopSound('tickFast');
    };
  }, []);

  // 🆕 Параметры круга
  const radius = 36;
  const stroke = 5;
  const size = (radius + stroke) * 2;         // = 82
  const circumference = 2 * Math.PI * radius;
  const progress = time / duration;
  const offset = circumference * (1 - progress);

  // 🆕 Цвет меняется: зелёный → жёлтый → красный
  const color =
    progress > 0.5 ? '#4caf50' :
    progress > 0.2 ? '#ff9800' :
                     '#f44336';

  return (
    <div className="circular-timer">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Фон круга */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        {/* Прогресс */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease',
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <div className="circular-timer-text" style={{ color }}>
        {time}
      </div>
    </div>
  );
}

export default Timer;