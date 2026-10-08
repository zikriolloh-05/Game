import React from 'react';
import './BottomNav.css';
import { IconGame, IconHome, IconSettings, IconTrophy } from './Icons/icons';

const NAV_ITEMS = [
    { key: 'home', Icon: IconHome, label: 'Главная' },
    { key: 'game', Icon: IconGame, label: 'Игра' },
    { key: 'records', Icon: IconTrophy, label: 'Рекорды' },
    { key: 'settings', Icon: IconSettings, label: 'Настройки' },
];

function BottomNav({ active, onChange }) {
    return (
        <nav className="bottom-nav">
            {NAV_ITEMS.map(({ key, Icon, label }) => (
                <button
                    key={key}
                    className={`nav-item ${active === key ? 'active' : ''}`}
                    onClick={() => onChange(key)}
                >
                    <span className="nav-icon"><Icon /></span>
                    <span className="nav-label">{label}</span>
                </button>
            ))}
        </nav>
    );
}

export default BottomNav;