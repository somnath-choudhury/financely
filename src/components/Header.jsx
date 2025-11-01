import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import {  useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import userDefaultImage from '../assets/user.svg'

const Header = () => {
  const [user, loading] = useAuthState(auth)

  const navigate = useNavigate()

  useEffect (() => {
      if (user){
        navigate('/dashboard')
      }
    }, [user, loading])

  const handleLogout = () => {
      try {
        signOut(auth).then(() => {
          toast.warning('User logged out')
          navigate('/')
      // Sign-out successful.
      toast
      }).catch((error) => {
      // An error happened.
      toast.error(error.message)
      });
      }
      catch (e) {
        toast.error(e.message)
      }
  }
  return (
    <div className='flex p-2 justify-between items-center bg-blue-500'>
        <div className='font-bold text-white text-lg'>Financely.in</div>

        {user && (
        <div className='flex gap-2 items-center'>
          <img
          src={user.photoURL || userDefaultImage}
          alt='User photo'
          className='w-9 h-9 rounded-2xl'
          />
          <p className='text-white font-semibold'>Welcome {user.displayName}</p>
          <button className='font-semibold px-4 py-1 bg-white text-blue-500 rounded-lg hover:text-white hover:bg-blue-700 cursor-pointer' onClick={handleLogout}>Logout</button>
        </div>
        )}
    </div>
  )
}

export default Header
