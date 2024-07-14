'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setMessage(result.error);
    } else {
      setMessage('Login successful!');
      window.location.href = '/';
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-4">
      <form
        onSubmit={submitHandler}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Login
        </h2>
        {message && (
          <div
            className={`mb-4 text-center ${
              message.includes('successful') ? 'text-green-500' : 'text-red-600'
            }`}
          >
            {message}
          </div>
        )}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white mb-2"
          >
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white mb-2"
          >
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
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
