/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useState } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStatus = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/userStatus?email=${session.user.email}`
        );
        const data = await response.json();
        setUserStatus(data.status);
      } catch (error) {
        console.error('Error fetching user status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchUserStatus();
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-gray-800 p-8 rounded-lg shadow-md w-80">
          <p className="mb-4 text-center">You are not signed in.</p>
          <button
            className="flex items-center justify-center bg-white text-gray-800 font-bold py-2 px-4 rounded w-full mb-4 hover:bg-gray-200 transition"
            onClick={() => signIn('google', { redirect: false })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className="mr-3" // Increased margin for more spacing
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign in with Google
          </button>

          <Link href="/login" legacyBehavior>
            <a className="flex items-center justify-center bg-white text-gray-800 font-bold py-2 px-4 rounded w-full hover:bg-gray-200 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                height="24"
                width="24"
                className="mr-3"
                focusable="false"
              >
                <path
                  d="M168-192q-29.7,0-50.85-21.16T96-264.04V-696.28Q96-726 117.15-747T168-768H553q-2,17-1,35.5t6,36.5H168L480-517l140-81q14,13 37,24t41,16L480-432L168-611v347H792V-558.46q20-4.54 37.5-14.04T864-594v329.77Q864-234 842.5-213T792-192H168Zm0-504v432V-696Zm576,72q-50,0-85-35t-35-85t35-85t85-35t85,35t35,85t-35,85t-85,35Z"
                  fill="#444746"
                />
              </svg>
              Sign in with Email
            </a>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <p>Loading user status...</p>
      </div>
    );
  }

  if (userStatus === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-yellow-600">
          Your registration request has been sent! Please wait for approval.
        </p>
      </div>
    );
  } else if (userStatus === 'rejected') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-600">Your registration has been rejected.</p>
      </div>
    );
  } else if (userStatus === 'approved') {
    return (
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 text-left flex items-center">
        <img
          src={session.user.image || '/default-avatar.png'}
          alt="Home"
          className="rounded-full h-40 w-40 mr-6"
        />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2 text-white">
            Welcome, {session.user.name}!
          </h1>
          <p className="text-gray-300 mb-6">{session.user.email}</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-600">
          Your registration status is unknown. Please contact support.
        </p>
      </div>
    );
  }
}
