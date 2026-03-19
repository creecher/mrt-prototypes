import './Header.css'

export default function Header({ onMenuClick }) {
  return (
    <header className="header">
      <button
        className="header__menu-btn"
        onClick={onMenuClick}
        aria-label="Toggle navigation menu"
      >
        <i className="fa-solid fa-bars" />
      </button>
      <div className="header__end">
        <div className="header__program">
          <i className="fa-regular fa-folder-heart" />
          <span className="header__program-label">LB Recup</span>
        </div>
        <div className="header__avatar">
          <i className="fa-solid fa-user" />
        </div>
      </div>
    </header>
  )
}
