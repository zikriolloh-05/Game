import React from 'react';
import Logo from '../../ui/logo/logo';
import './style.css';
import homeIcon from './home.svg'
import AboutIcon from './About.svg'
import SkilsIcon from './skils.svg'
import ProjectsIcon from './Projects.svg'
import ContactsIcon from './Contact.svg'
function Header({ activeSection, onScrollToSection, isScrolled }) {
  const menuItems = [
    { id: 'home', label: 'Главная', icon: homeIcon },
    { id: 'about', label: 'О себе', icon: AboutIcon },
    { id: 'skills', label: 'Навыки', icon: SkilsIcon },
    { id: 'projects', label: 'Проекты', icon: ProjectsIcon },
    { id: 'contact', label: 'Контакты', icon: ContactsIcon }
  ];

  const handleClick = (e, id) => {
    e.preventDefault();
    onScrollToSection(id);
  };

  return (
    <>
      {/* ===== ВЕРХНИЙ НАВБАР (десктоп) ===== */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Logo onClick={() => onScrollToSection('home')} />
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={activeSection === item.id ? 'active' : ''}
                >
                  {item.label}
                </a>
              </li>
            ))}

            <li className="resume-actions">
              <a
                href="/images/CV/cv-sharipov-zikriolloh.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="resume-btn view"
              >
                Резюме
              </a>
              <a
                href="/images/CV/cv-sharipov-zikriolloh.pdf"
                download="CV_Sharipov_Zikriolloh.pdf"
                className="resume-btn download"
                aria-label="Скачать резюме"
              >
                <svg className="iconDownload" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="16" height="16" aria-hidden="true">
                  <path d="M50 86 L14 48 Q10 44 16 44 H34 V18 Q34 12 40 12 H60 Q66 12 66 18 V44 H84 Q90 44 86 48 Z" fill="currentColor" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* ===== НИЖНЯЯ ПАНЕЛЬ (мобилка) ===== */}
      <nav className="bottom-nav">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={activeSection === item.id ? 'active' : ''}
          >
            <span className="bottom-nav-icon">
              {typeof item.icon === 'string' && (item.icon.includes('/') || item.icon.includes('.')) ? (
                <img src={item.icon} alt="" width="22" height="22" />
              ) : (
                item.icon
              )}
            </span>
            <small>{item.label}</small>
          </a>
        ))}
      </nav>
    </>
  );
}
export default Header;