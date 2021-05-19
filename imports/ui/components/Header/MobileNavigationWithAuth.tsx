import React from 'react'
import { Link } from 'react-router-dom'
import Feather from 'react-feather/dist/icons/feather'
import Home from 'react-feather/dist/icons/home'
import Bell from 'react-feather/dist/icons/bell'
import Book from 'react-feather/dist/icons/book'
import { useAuth } from '/imports/hooks'
import AuthMenu from './AuthMenu'

function MobileNavigationWithAuth () {
  const { currUser, currUserId } = useAuth()
  return (<div id='mobile-header' className='ui secondary mobile-nav clearfix menu'>
    <div className='header item'>
      <Link to='/'  title='На главную' aria-label='На главную'>
        <Home />
      </Link>
    </div>
    <div className='item'>
      <Link to='/books/all'  title='Книги' aria-label='Книги'>
        <Book />
      </Link>
    </div>
    <div className='item'>
      <Link to='/new-post' className='write-post'  title='Новый пост' aria-label='Новый пост'>
        <Feather />
      </Link>
    </div>
    <div className='item'>
      <Link to='/me/notifications'  title='Оповещения' aria-label='Оповещения'>
        <Bell />
      </Link>
    </div>
    <div className='user-mobile-menu item'>
      {currUser && currUserId && <AuthMenu currUser={currUser} />}
    </div>
  </div>)
}

export default MobileNavigationWithAuth
