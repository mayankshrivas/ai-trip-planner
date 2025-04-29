import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { SelectBudgetOptions, SelectTravelesList, AI_PROMPT } from '../constant/options';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '../service/AImodal';
import { auth, db } from '../service/firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

// Lottie imports
import Lottie from 'lottie-react';

import travelBackground2 from '../assets/travel2.json';
import travelBackground3 from '../assets/travel3.json';

const LOCATIONIQ_TOKEN = 'pk.1f03a056d0c26c32ca213b0b59eb5a15';
const animations = [travelBackground2, travelBackground3];

export default function CreateTrip() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState('');
  const [budget, setBudget] = useState('');
  const [travelGroup, setTravelGroup] = useState('');
  const [formData, setFormData] = useState({ location: '', days: '', budget: '', travelGroup: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const navigate = useNavigate();

  // Rotate background animation every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Trigger submit after login
  useEffect(() => {
    if (isLoggedIn) {
      handleSubmit();
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  // LocationIQ autocomplete
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 2) {
      try {
        const res = await axios.get('https://api.locationiq.com/v1/autocomplete', {
          params: { key: LOCATIONIQ_TOKEN, q: value, format: 'json', limit: 5 },
        });
        setSuggestions(res.data);
      } catch (err) {
        console.error('Error fetching suggestions:', err.response?.data || err.message);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setQuery(place.display_name);
    setSuggestions([]);
    setFormData((prev) => ({ ...prev, location: place.display_name }));
  };

  const handleDaysChange = (e) => {
    const value = e.target.value;
    setDays(value);
    setFormData((prev) => ({ ...prev, days: value }));
  };

  const handleSelectBudget = (title) => {
    setBudget(title);
    setFormData((prev) => ({ ...prev, budget: title }));
  };

  const handleSelectGroup = (title) => {
    setTravelGroup(title);
    setFormData((prev) => ({ ...prev, travelGroup: title }));
  };

  // Google OAuth login
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => GetUserProfile(codeResponse),
    onError: (error) => console.error(error),
  });

  const handleSubmit = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      toast('Oops! You have to sign in first', { duration: 2000 });
      
      return;
    }
    if (!formData.location || !formData.days || formData.days > 105 || !formData.budget || !formData.travelGroup) {
      toast('Please fill all the details properly.', { duration: 2000 });
      return;
    }
    try {
      setLoading(true);
      const prompt = AI_PROMPT
        .replace('{location}', formData.location)
        .replace('{days}', formData.days)
        .replace('{travelGroup}', formData.travelGroup)
        .replace('{budget}', formData.budget);

      const result = await chatSession.sendMessage(prompt);
      const text = await result.response.text();
      console.log('AI Response:', text);
      await saveAiTrip(text);
      toast('Trip Created successfully! 🎉');
    } catch (err) {
      console.error('Submission Error:', err);
      toast('Failed to create trip. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveAiTrip = async (tripData) => {
    if (!tripData) {
      toast('No trip data received from AI.');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.email) {
      toast('User not found.');
      return;
    }
    const docId = Date.now().toString();
    await setDoc(doc(db, 'AiTrips', docId), {
      userSelection: formData,
      tripData: JSON.parse(tripData),
      userEmail: user.email,
      userId: user.id || user.uid || '',
      id: docId,
      createdAt: new Date().toISOString(),
    });
    navigate('/view-trip/' + docId);
  };

  const GetUserProfile = async (tokenInfo) => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        { headers: { Authorization: `Bearer ${tokenInfo.access_token}`, Accept: 'application/json' } }
      );
      localStorage.setItem('user', JSON.stringify(res.data));
      const cred = GoogleAuthProvider.credential(null, tokenInfo.access_token);
      await signInWithCredential(auth, cred);
      setIsLoggedIn(true);
      setOpenDialog(false);
    } catch (error) {
      console.error('Google Sign-in Error:', error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Rotating Lottie Background */}
      <Lottie
        animationData={animations[currentAnimation]}
        loop
        className="absolute inset-0 -z-10 opacity-30"
      />

      <div className="relative z-10 sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10 backdrop-blur-md bg-white/70 rounded-xl pb-20">
        <h2 className="font-bold text-3xl">Tell us your travel preferences 🏕️🌴</h2>
        <p className="mt-3 text-gray-500 text-xl">
          Provide some basic information and our trip planner will generate a
          customized itinerary.
        </p>

        {/* Destination Input */}
        <section className="mt-20">
          <h2 className="text-xl my-3 font-medium">
            What is your Destination of Choice
          </h2>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter destination..."
          />
          {suggestions.length > 0 && (
            <ul className="border border-gray-300 rounded-md mt-2 bg-white shadow-md">
              {suggestions.map((place, idx) => (
                <li
                  key={idx}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectPlace(place)}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
          {selectedPlace && (
            <div className="mt-4 text-blue-600 font-medium">
              ✅ Selected: {selectedPlace.display_name}
            </div>
          )}
        </section>

        {/* Trip Duration */}
        <section className="mt-10">
          <h2 className="text-xl my-3 font-medium">
            For how many days are you planning your trip?
          </h2>
          <Input
            placeholder="Number of days"
            type="number"
            min={1}
            max={105}
            value={days}
            onChange={handleDaysChange}
          />
        </section>

        {/* Budget Options */}
        <section className="mt-10">
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, idx) => (
              <div
                key={idx}
                className={`border p-4 rounded-md shadow-lg transition-all cursor-pointer ${budget === item.title ? 'border-blue-500' : 'hover:shadow-md'}`}                onClick={() => handleSelectBudget(item.title)}
              >
                <h2 className="text-2xl font-bold">{item.icon}</h2>
                <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Travelers List */}
        <section className="mt-10">
          <h2 className="text-xl my-3 font-medium">
            Who are you traveling with?
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectTravelesList.map((item, idx) => (
              <div
                key={idx}
                className={`border p-4 rounded-md shadow-lg transition-all cursor-pointer ${travelGroup === item.title ? 'border-blue-500' : 'hover:shadow-md'}`}                onClick={() => handleSelectGroup(item.title)}
              >
                <h2 className="text-2xl font-bold">{item.icon}</h2>
                <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Submit Button */}
        <div className="my-10 justify-end flex">
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> : 'Generate Trip'}
          </Button>
        </div>

        {/* Google Sign-In Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription className="text-center">
                <img src="/logo.svg" alt="logo" className="mx-auto" />
                <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
                <p>Securely authenticate to continue</p>
                <Button onClick={login} className="w-full mt-5 flex gap-4 items-center justify-center">
                  <FcGoogle className="h-7 w-7" /> Sign In With Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
