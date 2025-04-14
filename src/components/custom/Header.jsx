import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios'; // ✅ don't forget to install this

function Header() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [openDailog, setOpenDailog] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => GetUserProfile(codeResponse),
    onError: (error) => console.log('Login Failed:', error),
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: 'application/json',
          },
        }
      );

      const userData = res.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData); // ✅ update state after login
      setOpenDailog(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const logout = () => {
    googleLogout();
    localStorage.clear();
    setUser(null); // ✅ update state on logout
  };

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <img src="./logo.svg" alt="ATG" />

      <div>
        {user ? (
          <div className='flex items-center gap-3'>
           
           <a href="/create-trip"><Button variant='outline' className='rounded-full'>+ CreateTrip</Button></a> 
           {/* <a href="/my-trips"><Button variant='outline' className='rounded-full'>My trips</Button></a>  */}

            <Popover>
            <PopoverTrigger asChild>
  <img
    src={user?.picture}
    alt="Profile"
    className="w-8 h-8 rounded-full object-cover border"
  />
</PopoverTrigger>

              <PopoverContent>
                <a href="/"><h2 className='cursor-pointer' onClick={logout}>Logout</h2></a>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDailog(true)}>Sign In</Button>
        )}
      </div>

      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="logo" />
              <h2 className='font-bold text-lg mt-7'>Sign In With Google</h2>
              <p>Sign in to the App with Google Authentication Security</p>
              <Button onClick={login} className='w-full mt-5 flex gap-4 items-center'>
                <FcGoogle className='h-7 w-7' /> Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
