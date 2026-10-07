// ResultScreen.jsx
// import React from 'react';
import React, { useEffect, useState } from 'react';
import { playSound, stopAllSounds } from '../Sound/Sound.jsx';
import confetti from 'canvas-confetti';
import '../Glavni/style.css';
import './ResultScreen.css';

const MOTIVATION_PHRASES = [
  { emoji: '💪', text: 'Ты можешь больше!' },
  { emoji: '🔥', text: 'Ты сильнее, чем думаешь' },
  { emoji: '⭐', text: 'Старайся — и получится!' },
  { emoji: '🚀', text: 'Не сдавайся, играй ещё раз' },
  { emoji: '🌟', text: 'Каждый шаг — это прогресс' },
  { emoji: '🎯', text: 'Попробуй ещё, у тебя получится!' },
  { emoji: '🧠', text: 'Ошибки — часть обучения' },
  { emoji: '💫', text: 'Следующая попытка будет лучше' },
];


function ResultScreen({ score, total,isNewRecord, onRestart, onExit }) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const wrong = total - score;
  const isWin = percent >= 80;
  const [phrase] = useState(
    () => MOTIVATION_PHRASES[Math.floor(Math.random() * MOTIVATION_PHRASES.length)]
  );

  useEffect(() => {
    if (isWin) {
      playSound('win', { volume: 0.6 });
      fireConfetti();
    } else {
      playSound('lose', { volume: 0.5 });
    }

    return () => stopAllSounds();
  }, [isWin]);

  const fireConfetti = () => {
    // Залп 1 — центр
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#ff4d4d', '#4caf50', '#2196f3', '#ff9800'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: ['#ff4d4d', '#ffd700', '#4caf50'],
      });
    }, 250);

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: ['#2196f3', '#ff9800', '#e91e63'],
      });
    }, 500);

    setTimeout(() => {
      confetti({
        particleCount: 100,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { y: 0.3 },
      });
    }, 1000);
  };

  const handleCelebrate = () => fireConfetti();


  // Сообщение в зависимости от результата
  let message = '';
  if (percent === 100) message = '🏆 Идеально! Ты мастер!';
  else if (percent >= 80) message = '🌟 Отличный результат!';
  else if (percent >= 60) message = '👍 Хорошо, продолжай!';
  else if (percent >= 40) message = '📖 Неплохо, но нужно повторить';
  else message = '💪 Попробуй ещё раз!';

  return (
     <div className={`result-screen ${isWin ? 'win' : 'lose'}`}>
      {isWin ? (
        <>
          <div className="result-emoji">🎉</div>
          <h1>Поздравляем!</h1>
          <p className="result-subtitle">Отличный результат — ты молодец!</p>
        </>
      ) : (
        <>
          <div className="result-emoji">{phrase.emoji}</div>
          <h1>{phrase.text}</h1>
          <p className="result-subtitle">Попробуй ещё раз — ты справишься!</p>
        </>
      )}

      <div className="result-score">
        <div className="result-percent">{percent}%</div>
        {isNewRecord && <div className="new-record-badge">🏆 Новый рекорд!</div>}
      </div>

      <div className="result-stats">
        <div className="stat">
          <span className="stat-value correct-color">{score}</span>
          <span className="stat-label">Правильно</span>
        </div>
        <div className="stat">
          <span className="stat-value wrong-color">{wrong}</span>
          <span className="stat-label">Ошибок</span>
        </div>
        <div className="stat">
          <span className="stat-value">{total}</span>
          <span className="stat-label">Всего</span>
        </div>
      </div>

      {isWin && (
        <button className="btn-celebrate" onClick={handleCelebrate}>
          🎊 Ещё конфетти!
        </button>
      )}

      <div className="result-buttons">
        <button className="btn-primary" onClick={onRestart}>
          🔄 Играть снова
        </button>
        <button className="btn-secondary" onClick={onExit}>
          🏠 На главную
        </button>
      </div>
    </div>
  );
}

export default ResultScreen;