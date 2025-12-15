import React from 'react'
import { useNavigate } from 'react-router-dom'

const Landing: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome</h1>
        <p className="mb-6">Welcome to Zmooth — a small demo landing page.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-indigo-600 rounded-md hover:bg-indigo-500"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default Landing
