import React from 'react'
import { Link } from 'react-router-dom'

const SideNav = () => {
  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <span></span>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/products/" className="nav-link">
              <span></span>
              Products
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default SideNav