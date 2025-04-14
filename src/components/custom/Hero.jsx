import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import React from 'react'

function Hero() {
  return (
    <div className=' flex flex-col items-center mx-56 gap-9'>
     <h1
     className='font-extrabold text-[50px] text-center mt-16'>
     <span className='text-[#f56551]'>Smart Travel, Smarter Itineraries</span> "Let AI Plan Your Perfect Trip!"
     </h1>
     <p className='text-xl text-gray-500 text-center'>"Your AI-Powered Travel Guru: Crafting Personalized Itineraries Perfectly Aligned with Your Interests & Budget!"</p>
    <Link to={'/create-trip'}>
    <Button>Get Started</Button>
    </Link>
    </div>
  )
}

export default Hero
