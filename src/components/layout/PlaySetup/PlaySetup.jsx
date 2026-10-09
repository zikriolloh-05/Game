import React, { useState } from 'react';
import { getSettings, saveSettings } from '../GameUtils/gameUtils.jsx';
import { words } from '../Words/words.jsx';
import { wordsEn } from '../Words/words-en.jsx';
import './PlaySetup.css';

function PlaySetup({ onStart, onBack }) {
  const [settings, setSettings] = useState(getSettings());

  // Максимум вопросов зависит от языка
  const activeWords = settings.lang === 'en' ? wordsEn : words;
  const maxQuestions = activeWords.length;

  const update = (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
  };

  // При смене языка — направление сбрасываем в правильное
  const changeLang = (lang) => {
    update({
      lang,
      direction: lang === 'en' ? 'en-tj' : 'ru-tj',
    });
  };

  return (
    <div className="play-setup">
      {/* Кнопка назад */}
      <button className="back-btn" onClick={onBack}>
        ← Назад
      </button>

      {/* Заголовок */}
      <h1>Готов к игре?</h1>
      <p className="subtitle">Проверь настройки перед стартом</p>

      {/* Язык */}
      <div className="setup-group">
        <label>🌍 Язык</label>
        <div className="button-row">
          <button
            className={settings.lang === 'ru' ? 'active' : ''}
            onClick={() => changeLang('ru')}
          >
            🇷🇺 Русский
          </button>
          <button
            className={settings.lang === 'en' ? 'active' : ''}
            onClick={() => changeLang('en')}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {/* Направление */}
      <div className="setup-group">
        <label>🎯 Направление</label>
        <div className="button-row">
          {settings.lang === 'ru' ? (
            <>
              <button
                className={settings.direction === 'ru-tj' ? 'active' : ''}
                onClick={() => update({ direction: 'ru-tj' })}
              >
                🇷🇺 → 🇹🇯
              </button>
              <button
                className={settings.direction === 'tj-ru' ? 'active' : ''}
                onClick={() => update({ direction: 'tj-ru' })}
              >
                🇹🇯 → 🇷🇺
              </button>
            </>
          ) : (
            <>
              <button
                className={settings.direction === 'en-tj' ? 'active' : ''}
                onClick={() => update({ direction: 'en-tj' })}
              >
                🇬🇧 → 🇹🇯
              </button>
              <button
                className={settings.direction === 'tj-en' ? 'active' : ''}
                onClick={() => update({ direction: 'tj-en' })}
              >
                🇹🇯 → 🇬🇧
              </button>
            </>
          )}
        </div>
      </div>

      {/* Режим */}
      <div className="setup-group">
        <label>🎮 Режим</label>
        <div className="button-row">
          <button
            className={settings.mode === 'classic' ? 'active' : ''}
            onClick={() => update({ mode: 'classic' })}
          >
            🎮 Обычная
          </button>
          <button
            className={settings.mode === 'voice' ? 'active' : ''}
            onClick={() => update({ mode: 'voice' })}
          >
            🎤 Голосовая
          </button>
        </div>
      </div>

      {/* Количество вопросов */}
      <div className="setup-group">
        <label>📋 Сколько вопросов? ({maxQuestions} доступно)</label>
        <div className="button-row small">
          {[5, 10, 20, 50].map((n) => (
            <button
              key={n}
              className={settings.count === n ? 'active' : ''}
              onClick={() => update({ count: n })}
            >
              {n}
            </button>
          ))}
          <button
            className={settings.count === 'all' ? 'active' : ''}
            onClick={() => update({ count: 'all' })}
          >
            Все
          </button>
        </div>
      </div>

      {/* Кнопка старта */}
      <button className="start-game-btn" onClick={onStart}>
        ▶ Начать игру
      </button>
    </div>
  );
}

export default PlaySetup;