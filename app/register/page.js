'use client';
import { useState } from 'react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretCode, setShowSecretCode] = useState(false);

  async function submitHandler(event) {
    event.preventDefault();
    setLoading(true);
    setSuccess('');

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, profileImage, secretCode }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setLoading(false);

    if (res.ok) {
      setSuccess('Registration request sent! Please wait for approval.');
    } else {
      let errorMessage = 'An error occurred';
      try {
        const data = await res.json();
        errorMessage = data.message || errorMessage;
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
      alert(errorMessage);
    }
  }

  return (
    <div className="flex items-center justify-center h-full p-4">
      <form
        onSubmit={submitHandler}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-3xl"
      >
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Register
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-white mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-white mb-2">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-400"
            >
              {showPassword ? '👀' : '🙈'}
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="profileImage" className="block text-white mb-2">
              Profile Image URL
            </label>
            <input
              type="text"
              id="profileImage"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter profile image URL"
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="secretCode" className="block text-white mb-2">
              Secret Code
            </label>
            <input
              type={showSecretCode ? 'text' : 'password'}
              id="secretCode"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              required
              className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter secret code"
            />
            <button
              type="button"
              onClick={() => setShowSecretCode(!showSecretCode)}
              className="absolute right-2 top-2 text-gray-400"
            >
              {showSecretCode ? '👀' : '🙈'}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-6"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        {success && (
          <p className="mt-4 text-green-500 text-center">{success}</p>
        )}
      </form>
    </div>
  );
}
