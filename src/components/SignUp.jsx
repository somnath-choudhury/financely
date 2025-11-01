import React, { useState } from 'react'
import Header from './Header'
import { toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { db } from '../firebase.js'
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { auth, provider } from '../firebase.js'
import { CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords mismatch')
      toast.error('Passwords do not match!')
      setLoading(false)
      return
    }

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error('All fields are mandatory!')
      setLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      console.log("User signed up:", user)

      toast.success('Signed up successfully!', {
        position: 'top-right',
        autoClose: 3000,
        transition: Bounce
      })
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      
      await createDoc(user)

      navigate('/dashboard')


    } catch (error) {
      console.error("Firebase error:", error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
  e.preventDefault()
  setLoading(true)

  try {
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required!")
      setLoading(false)
      return
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    console.log('Signed in user:', user)

    toast.success('Logged in successfully!', {
      position: 'top-right',
      autoClose: 3000,
      transition: Bounce
    })

    setEmail('')
    setPassword('')

    await new Promise(resolve => setTimeout(resolve, 500)) 

    navigate('/dashboard')

  } catch (error) { 
    console.error('Login error:', error)
    toast.error(error.message)
  } finally {
    setLoading(false)
  }
}
  const createDoc = async (user) => {

    if (!user) return;

  const userRef = doc(db, "users", user.uid)
  const userData = await getDoc(userRef)

  if (!userData.exists()) {
    try {
    await setDoc(doc(db, "users", user.uid), {
    name: user.displayName ? user.displayName : name,
    email: user.email,
    photoUrl: user.photoUrl? user.photoUrl : "",
    createdAt: new Date(),
});
  toast.success("Doc created")
  setLoading(false)
  }
  catch (error) {
    toast.error(error.message)
    setLoading(false)
  }
  }

  else {
    // toast.error('Doc already exists!')
  }
  
  } 


  const handleGoogleSignUp = () => {
    setLoading(true)

    try {
      signInWithPopup(auth, provider)
      .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log("User google signup", user);
      createDoc(user)
      setLoading(false)
      navigate('/dashboard')
      toast.success("User authenticated!")
      
      // IdP data available using getAdditionalUserInfo(result)
      // ...
  }).catch((error) => {
    setLoading(false) 
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    toast.error(error.message)
    
    // ...
  });
    }
    catch(error) {
      toast.error(error.message)
    }
    
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Header />

      <div className="flex flex-1 justify-center items-center">
       {isLogin ?  

       //Login
       <div className="w-1/2 max-w-md border-2 border-blue-500 rounded-lg p-6 shadow-2xl shadow-blue-500/50">
          <div className="text-xl font-bold mb-4 text-center text-blue-500">
            Login on Financely.
          </div>

          <form onSubmit={handleLogin}>
            <div className="flex flex-col space-y-3">

              <label className='font-semibold'>Email</label>
              <input
                type="email"
                placeholder="Email..."
                className="border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className='font-semibold'>Password</label>
              <input
                type="password"
                placeholder="Password..."
                className="border p-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* {error && <div className='text-red-500 text-sm'>{error}</div>} */}

              <button
                className="bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 cursor-pointer flex justify-center"
                type='submit'
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login using Email and Password'}
              </button>

              <div className="text-center text-gray-500">OR</div>
            </div>
          </form>

          <div className="flex flex-col justify-center mt-3">
            <button
              className="border border-gray-400 rounded-lg py-2 px-6 hover:bg-gray-100 cursor-pointer flex justify-center items-center"
              onClick={handleGoogleSignUp}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'black' }} /> : 'Login using Google'}
            </button>

            <div className='text-center mt-4 cursor-pointer' onClick={() => setIsLogin(false)}>Dont't have an account? Sign Up!</div>
          </div>
        </div> :  
        
        //Signup
        <div className="w-1/2 max-w-md border-2 border-blue-500 rounded-lg p-6 shadow-2xl shadow-blue-500/50">
          <div className="text-xl font-bold mb-4 text-center text-blue-500">
            Sign Up on Financely.
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-3">
              <label className='font-semibold'>Name</label>
              <input
                type="text"
                placeholder="Name..."
                className="border p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label className='font-semibold'>Email</label>
              <input
                type="email"
                placeholder="Email..."
                className="border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className='font-semibold'>Password</label>
              <input
                type="password"
                placeholder="Password..."
                className="border p-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label className='font-semibold'>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password..."
                className="border p-2 rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {error && <div className='text-red-500 text-sm'>{error}</div>}

              <button
                className="bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 cursor-pointer flex justify-center"
                type='submit'
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up using Email and Password'}
              </button>

              <div className="text-center text-gray-500">OR</div>
            </div>
          </form>

          <div className="flex flex-col justify-center mt-3">
            <button
              className="border border-gray-400 rounded-lg py-2 px-6 hover:bg-gray-100 cursor-pointer flex justify-center items-center"
              onClick={handleGoogleSignUp}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'black' }} /> : 'Sign Up using Google'}
            </button>

            <div className='text-center mt-4 cursor-pointer' onClick={() => setIsLogin(true)}>Already have an account? Log In!</div>
          </div>
        </div>}
      </div>
    </div>
  )
}

export default SignUp
