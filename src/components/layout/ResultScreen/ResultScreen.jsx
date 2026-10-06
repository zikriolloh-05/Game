// ResultScreen.jsx
import React from 'react';
import '../Glavni/style.css';

function ResultScreen({ score, total, onRestart, onExit }) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const wrong = total - score;

  // Сообщение в зависимости от результата
  let message = '';
  if (percent === 100) message = '🏆 Идеально! Ты мастер!';
  else if (percent >= 80) message = '🌟 Отличный результат!';
  else if (percent >= 60) message = '👍 Хорошо, продолжай!';
  else if (percent >= 40) message = '📖 Неплохо, но нужно повторить';
  else message = '💪 Попробуй ещё раз!';

  return (
    <div className="result-screen">
      <h1>Игра завершена!</h1>

      <div className="result-score">
        <div className="result-percent">{percent}%</div>
        <p>{message}</p>
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