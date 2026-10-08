import React from 'react';
import { getRecords, getSettings } from '../GameUtils/gameUtils.jsx';
import './style.css';
import './Glavni.css'

function Home({ onStart }) {
  const records = getRecords();
  const settings = getSettings();
  const best = records[0];

  return (
    <section className="hero">
      <h1>Перевод слов</h1>
      <p>Русский ↔ Таджикский</p>

      {best && (
        <div className="record-badge">
          🏆 Лучший результат: {best.percent}% ({best.score}/{best.total})
        </div>
      )}

      <div className="settings-preview">
        <span>📋 {settings.count === 'all' ? 'Все' : settings.count} вопросов</span>
        <span>🎯 {settings.direction === 'ru-tj' ? 'Рус → Тадж' : 'Тадж → Рус'}</span>
      </div>

      <button className="start-btn" onClick={onStart}>
        ▶ Играть
      </button>

      <p className="hero-hint">
        Изменить настройки можно во вкладке <b>⚙️ Настройки</b>
      </p>
    </section>
  );
}

export default Home;