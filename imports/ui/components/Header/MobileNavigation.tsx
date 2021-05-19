import React from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Feather from 'react-feather/dist/icons/feather'
import Home from 'react-feather/dist/icons/home'
import Search from 'react-feather/dist/icons/search'
import User from 'react-feather/dist/icons/user'
import Book from 'react-feather/dist/icons/book'

function MobileNavigation () {
  const { pathname } = useLocation()
  const referer = pathname !== '/' ? pathname : null

  return (<div id='mobile-header' className='ui secondary mobile-nav clearfix menu'>
    <div className='header item'>
      <Link to='/' title='На главную' aria-label='На главную'>
        <Home />
      </Link>
    </div>
    <div className='item'>
      <Link to='/search' title='Поиск' aria-label='Поиск'>
        <Search />
      </Link>
    </div>
    <div className='item'>
      <Link to='/new-post' className='write-post' title='Новый пост' aria-label='Новый пост'>
        <Feather />
      </Link>
    </div>
    <div className='item'>
      <Link to='/books/all' title='Книги' aria-label='Книги'>
        <Book />
      </Link>
    </div>
    <div className='user-mobile-menu item'>
      <Link to={referer ? `/login?referer=${referer}` : '/login'} title='Войти' aria-label='Войти' rel='noopener nofollow'>
        <User />
      </Link>
    </div>
  </div>)
}

export default MobileNavigation
