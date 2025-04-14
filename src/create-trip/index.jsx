import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { SelectBudgetOptions, SelectTravelesList } from '../constant/options';
import { Button } from '../components/ui/button';
import { toast } from "sonner";
import { AI_PROMPT } from '../constant/options';
import { chatSession } from '../service/AImodal';
import { auth, db } from '../service/firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

const LOCATIONIQ_TOKEN = 'pk.1f03a056d0c26c32ca213b0b59eb5a15';

function CreateTrip() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [openDailog, setOpenDailog] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const [days, setDays] = useState('');
  const [budget, setBudget] = useState('');
  const [travelGroup, setTravelGroup] = useState('');
  const [formData, setFormData] = useState({
    location: '',
    days: '',
    budget: '',
    travelGroup: '',
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      handleSubmit();
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const res = await axios.get(`https://api.locationiq.com/v1/autocomplete`, {
          params: {
            key: LOCATIONIQ_TOKEN,
            q: value,
            format: 'json',
            limit: 5,
          },
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

  const handleSelectBudget = (budgetTitle) => {
    setBudget(budgetTitle);
    setFormData((prev) => ({ ...prev, budget: budgetTitle }));
  };

  const handleSelectGroup = (groupTitle) => {
    setTravelGroup(groupTitle);
    setFormData((prev) => ({ ...prev, travelGroup: groupTitle }));
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => GetUserProfile(codeResponse),
    onError: (error) => console.log(error),
  });

  const handleSubmit = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDailog(true);
      return;
    }

    if (
      formData?.days > 105 ||
      !formData?.location ||
      !formData?.days ||
      !formData?.budget ||
      !formData?.travelGroup
    ) {
      toast("Please fill all the details properly.", { duration: 2000 });
      return;
    }

    try {
      setLoading(true);
      const FINAL_PROMPT = AI_PROMPT
      // console.log(FINAL_PROMPT)
        .replace('{location}', formData.location)
        .replace('{days}', formData.days)
        .replace('{travelGroup}', formData.travelGroup)
        .replace('{budget}', formData.budget);

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = await result?.response?.text();

      console.log("AI Response:", responseText);

      await SaveAiTrip(responseText);
      toast("Trip saved successfully! 🎉");
    } catch (error) {
      console.error("Submission Error:", error);
      toast("Failed to create trip. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    if (!TripData) {
      toast("No trip data received from AI.");
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
      toast("User not found.");
      return;
    }

    const docId = Date.now().toString();

    await setDoc(doc(db, "AiTrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user.email, // Needed for Firestore rules
      userId: user.id || user.uid || "",
      id: docId,
      createdAt: new Date().toISOString()
    });
    navigate('/view-trip/'+docId)
  };

  const GetUserProfile = async (tokenInfo) => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: `application/json`,
          }
        }
      );
  
      const userData = res.data;
      localStorage.setItem('user', JSON.stringify(userData));
  
      const credential = GoogleAuthProvider.credential(null, tokenInfo?.access_token);
      // await signInWithCredential(auth, credential);
  
      setIsLoggedIn(true);
      setOpenDailog(false); // ✅ Immediately close the dialog
      await signInWithCredential(auth, credential); // then sign in
    } catch (error) {
      console.error("unfortunately it works", error);
      
    }
  };
  

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      {/* Destination Input */}
      <section className='mt-20'>
        <h2 className='text-xl my-3 font-medium'>What is your Destination of Choice</h2>
        <input
          type='text'
          value={query}
          onChange={handleInputChange}
          className='w-full p-3 border border-gray-300 rounded-md shadow-sm'
          placeholder='Enter destination...'
        />

        {suggestions.length > 0 && (
          <ul className='border border-gray-300 rounded-md mt-2 bg-white shadow-md'>
            {suggestions.map((place, index) => (
              <li
                key={index}
                className='p-2 cursor-pointer hover:bg-gray-100'
                onClick={() => handleSelectPlace(place)}
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}

        {selectedPlace && (
          <div className='mt-4 text-green-600 font-medium'>
            ✅ Selected: {selectedPlace.display_name}
          </div>
        )}
      </section>

      {/* Trip Duration */}
      <section className='mt-10'>
        <h2 className='text-xl my-3 font-medium'>For how many days are you planning your trip?</h2>
        <Input
          placeholder='Number of days'
          type='number'
          min={1}
          max={105}
          value={days}
          onChange={handleDaysChange}
        />
      </section>

      {/* Budget Options */}
      <section className='mt-10'>
        <h2 className='text-xl my-3 font-medium'>What is Your Budget?</h2>
        <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              className={`border p-4 rounded-md shadow-lg transition-all cursor-pointer ${budget === item.title ? 'border-blue-500' : 'hover:shadow-md'}`}
              onClick={() => handleSelectBudget(item.title)}
            >
              <h2 className='text-2xl font-bold'>{item.icon}</h2>
              <h3 className='text-lg font-semibold mt-2'>{item.title}</h3>
              <p className='text-gray-600'>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Travelers List */}
      <section className='mt-10'>
        <h2 className='text-xl my-3 font-medium'>Who are you traveling with?</h2>
        <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5'>
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              className={`border p-4 rounded-md shadow-lg transition-all cursor-pointer ${travelGroup === item.title ? 'border-blue-500' : 'hover:shadow-md'}`}
              onClick={() => handleSelectGroup(item.title)}
            >
              <h2 className='text-2xl font-bold'>{item.icon}</h2>
              <h3 className='text-lg font-semibold mt-2'>{item.title}</h3>
              <p className='text-gray-600'>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Submit Button */}
      <div className='my-10 justify-end flex'>
        <Button disabled={loading} onClick={handleSubmit}>
          {loading ? (
            <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' />
          ) : (
            'Let’s Go'
          )}
        </Button>
      </div>

      {/* Google Dialog */}
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

export default CreateTrip;
