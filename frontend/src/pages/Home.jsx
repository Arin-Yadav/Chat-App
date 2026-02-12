import React from 'react'
import { Link } from 'react-router-dom'
import {RouteLogin} from '../helpers/RouteName'

const Home = () => {
  return (
    <div className='text-2xl'>
      <h2>Homepage</h2>
      <Link to={RouteLogin} className='hover:underline'>
      Login
      </Link>
    </div>
  )
}

export default Home