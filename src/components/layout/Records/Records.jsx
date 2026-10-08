import React from 'react';
import { getRecords } from '../GameUtils/gameUtils.jsx';
import '../Settings/Setting.css';

function Records() {
  const records = getRecords();

  if (records.length === 0) {
    return (
      <div className="records-screen">
        <h1>🏆 Рекорды</h1>
        <p className="empty">Пока нет результатов.<br />Сыграй первую игру!</p>
      </div>
    );
  }

  return (
    <div className="records-screen">
      <h1>🏆 Топ-5 результатов</h1>
      <ul className="records-list">
        {records.map((rec, i) => {
          const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
          const date = new Date(rec.date).toLocaleDateString('ru-RU');
          return (
            <li key={i} className={`record-item rank-${i + 1}`}>
              <span className="rank">{medals[i]}</span>
              <div className="record-info">
                <span className="record-percent">{rec.percent}%</span>
                <span className="record-details">
                  {rec.score}/{rec.total} · {rec.direction === 'ru-tj' ? '🇷🇺→🇹🇯' : '🇹🇯→🇷🇺'}
                </span>
              </div>
              <span className="record-date">{date}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Records;