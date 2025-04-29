
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { FcGoogle } from 'react-icons/fc';
import { FaGlobeAmericas } from 'react-icons/fa';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Header() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = useGoogleLogin({
    onSuccess: (res) => fetchUser(res),
    onError: (err) => console.error('Login failed', err),
  });

  const fetchUser = async ({ access_token }) => {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setOpenDialog(false);
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    googleLogout();
    localStorage.removeItem('user');
    setUser(null);
  };

  const globeVariants = {
    animate: { rotate: 360 },
  };
  const hoverVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 font-serif relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Animated Globe Logo */}
        <motion.a
          href="/"
          className="flex items-center gap-2 text-blue-700"
          initial={{ scale: 1 }}
          whileHover={hoverVariants.hover}
          whileTap={hoverVariants.tap}
        >
          <motion.div
            className="h-10 w-10"
            variants={globeVariants}
            animate="animate"
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          >
            <FaGlobeAmericas className="h-full w-full" />
          </motion.div>
          <motion.span
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            ATG
          </motion.span>
        </motion.a>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <motion.a
                href="/create-trip"
                whileHover={hoverVariants.hover}
                whileTap={hoverVariants.tap}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Button className="bg-white-600 text-black  py-2 px-6 rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition">
  + Create Trip
</Button>

              </motion.a>

              <Popover>
                <PopoverTrigger asChild>
                  <motion.img
                    src={user.picture}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border-2 border-blue-700 object-cover cursor-pointer"
                    whileHover={hoverVariants.hover}
                    whileTap={hoverVariants.tap}
                  />
                </PopoverTrigger>
                <PopoverContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-3">
                  <button
                    onClick={logout}
                    className="w-full text-left text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <motion.button
              onClick={() => setOpenDialog(true)}
              className="bg-black text-white rounded-3xl px-4 py-2"
              whileHover={hoverVariants.hover}
              whileTap={hoverVariants.tap}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              Sign In
            </motion.button>
          )}
        </div>
      </div>

      {/* Sign-in Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogDescription className="text-center">
              <motion.div
                className="mx-auto h-12 mb-4 w-12 text-blue-700"
                variants={globeVariants}
                animate="animate"
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              >
                <FaGlobeAmericas className="h-full w-full" />
              </motion.div>
              <h2 className="text-xl font-semibold mb-2">Sign In with Google</h2>
              <p className="text-gray-600 mb-4">
                Securely sign in to manage your trips.
              </p>
              <motion.button
                onClick={login}
                className="w-full flex items-center justify-center gap-2 rounded-full border px-4 py-2 hover:bg-gray-100"
                whileHover={hoverVariants.hover}
                whileTap={hoverVariants.tap}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <FcGoogle className="h-6 w-6" /> Continue with Google
              </motion.button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
