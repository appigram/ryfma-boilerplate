import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, Icon } from 'semantic-ui-react'
import AuthHeader from './AuthHeader'

const MobileNavigation = ({ pathname, authenticated }) => (
  <Menu id='mobile-header' className='mobile-nav clearfix' secondary >
    <Menu.Item header>
      <Link to='/' className={pathname === '/' ? 'active' : ''}>
        <Icon name='home' />
      </Link>
    </Menu.Item>
    <Menu.Item name='best'>
      <NavLink to='/search' className={pathname.includes('/search') ? 'active' : ''}>
        <Icon name='search' />
      </NavLink>
    </Menu.Item>
    <Menu.Item name='write'>
      <Link to='/new-post' className='write-post'>
        <span>
          <Icon name='plus' />
        </span>
      </Link>
    </Menu.Item>
    <Menu.Item name='books'>
      <NavLink to='/books/all' className={pathname.includes('/books') ? 'active' : ''}>
        <Icon name='book' />
      </NavLink>
    </Menu.Item>
    <Menu.Item name='profile' className='user-mobile-menu'>
      {authenticated
        ? <AuthHeader isMobile />
        : <Link to='/login'>
          <Icon name='user' />
        </Link>
      }
    </Menu.Item>
  </Menu>
)

export default MobileNavigation
