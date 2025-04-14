import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import CreateTrip from './create-trip/index.jsx';
import Header from './components/custom/Header';
import { Toaster } from "@/components/ui/sonner"
import { GoogleOAuthProvider } from '@react-oauth/google';
import Viewtrip from './view-trip/[tripId]/index';
import MyTrips from '/src/my-trips/index';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/create-trip',
    element:<CreateTrip/>,
  },
  {
    path:'/view-trip/:tripId',
    element:<Viewtrip/>,
  },
  {
    path:'/my-trips',
    element:<MyTrips/>,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
   <Header/>
   <Toaster/>

    <RouterProvider router={router} />
    </GoogleOAuthProvider>;
  </StrictMode>
);
