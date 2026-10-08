import React, { useState } from 'react';
import { getSettings, saveSettings, getRecords, clearRecords } from '../GameUtils/gameUtils.jsx';
import { words } from '../Words/words.jsx';
import './Setting.css';

const MAX = words.length;
const MIN = 5;

function Settings() {
    const [settings, setSettings] = useState(getSettings());
    const [saved, setSaved] = useState(false);

    const update = (patch) => {
        const next = { ...settings, ...patch };
        setSettings(next);
        saveSettings(next);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    };

    return (
        <div className="settings-screen">
            <h1>⚙️ Настройки</h1>

            {/* Кол-во вопросов */}
            <div className="setting-group">
                <label>Сколько вопросов?</label>
                <select
                    value={settings.count}
                    onChange={(e) => {
                        const v = e.target.value;
                        update({ count: v === 'all' ? 'all' : Number(v) });
                    }}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value="all">Все ({MAX})</option>
                </select>
            </div>

            {/* Направление */}

            {/* Язык */}
            <div className="setting-group">
                <label>Язык перевода</label>
                <div className="lang-switch">
                    <button
                        className={settings.lang === 'ru' ? 'active' : ''}
                        onClick={() => update({ lang: 'ru', direction: 'ru-tj' })}
                    >
                        🇷🇺 Русский
                    </button>
                    <button
                        className={settings.lang === 'en' ? 'active' : ''}
                        onClick={() => update({ lang: 'en', direction: 'en-tj' })}
                    >
                        🇬🇧 English
                    </button>
                </div>
            </div>

            {/* Направление */}
            <div className="setting-group">
                <label>Направление перевода</label>
                <div className="direction-switch">
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

            {/* Звук */}
            <div className="setting-group">
                <label>Звук</label>
                <button
                    className={`toggle-btn ${settings.sound ? 'on' : 'off'}`}
                    onClick={() => update({ sound: !settings.sound })}
                >
                    {settings.sound ? '🔊 Включён' : '🔇 Выключен'}
                </button>
            </div>

            {/* Сброс рекордов */}
            <div className="setting-group">
                <button
                    className="danger-btn"
                    onClick={() => {
                        if (confirm('Удалить все рекорды?')) clearRecords();
                    }}
                >
                    🗑 Сбросить рекорды
                </button>
            </div>

            {saved && <div className="saved-toast">✓ Сохранено</div>}
        </div>
    );
}

export default Settings;