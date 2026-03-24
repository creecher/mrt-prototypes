import './Header.css'

export default function Header({ onMenuClick }) {
  return (
    <header className="header">
      <button
        className="header__menu-btn"
        onClick={onMenuClick}
        aria-label="Toggle navigation menu"
      >
        <i className="fa-regular fa-sidebar" aria-hidden="true" />
      </button>
      <div className="header__end">
        <div className="header__program">
          <i className="fa-regular fa-folder-heart" />
          <span className="header__program-label">LB Recup</span>
        </div>
        <div className="header__avatar">
          <img
            className="header__avatar-img"
            src={`${import.meta.env.BASE_URL}header-avatar.jpg`}
            alt=""
            width={28}
            height={28}
            decoding="async"
          />
        </div>
      </div>
    </header>
  )
}
