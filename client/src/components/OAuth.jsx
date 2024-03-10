import React from 'react'
import { Button } from '@mui/material'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const OAuth = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {

        try {

            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)


            const result = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            })

            const data = await res.json();
            console.log(data)
            dispatch(signInSuccess(data))
            navigate('/')
        } catch (err) {
            console.log('Could not sign in with google', err)
        }

    }

    return (
        <div>

            <button type='button' onClick={handleGoogleClick} className='bg-red-700  text-white w-full rounded-lg p-3 text-center uppercase hover:opacity-90'>
                Continue With Google
            </button>

        </div>
    )
}

export default OAuth