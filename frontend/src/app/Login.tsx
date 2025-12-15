import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const user = await login(email, password)
    if (user) {
      if (user.role === 'super') navigate('/super-admin')
      else navigate('/')
    } else setError('Invalid credentials')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent text-white px-4">
      <div className="w-full max-w-lg">
        <div className="p-8 rounded-xl border border-green-800 bg-[#07100b] shadow-lg">
          <h1 className="text-4xl font-extrabold mb-8 text-center">Admin Login</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter email"
                className="w-full px-4 py-3 rounded-lg bg-[#162029] border border-green-700 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="email"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-lg bg-[#071014] border border-green-700 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  type={showPassword ? 'text' : 'password'}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-300 hover:text-white"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && <div className="text-red-400">{error}</div>}

            <div>
              <button type="submit" className="w-full py-3 rounded-md bg-[#00ff3c] text-black font-medium hover:brightness-95">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
