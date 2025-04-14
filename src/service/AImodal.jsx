import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Load API key from environment variable
const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

// ✅ Safety check for missing key
if (!apiKey) {
  throw new Error("❌ Google Gemini API Key is missing! Check your .env file and ensure it starts with VITE_");
}

// ✅ Create AI client
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Use stable model version (recommended)
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Try "gemini-pro" first — it's public and stable
  // If you're sure you have access to a preview version, switch back later
});

  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseModalities: [
    ],
    responseMimeType: "application/json",
  };
  
  
  export const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Generate Travel plan for location:Las Vegas,for 3days for couple with a Cheap budget,Give me a Hotels option list with HotelName,Hotel address,Price,Hotel image url,geo cordinates,rating,descriptions and suggest itenary with the placename,place Details,Place image url,Geo coordinates,tickets pricing,Time to travel each location for 3 days with each day plan with best time to visit in JSON format"
          }
        ]
      },
      {
        role: "model",
        parts: [
          {
            text: `{
    "hotels": [
      {
        "hotelName": "The STRAT Hotel",
        "address": "2000 Las Vegas Blvd S, Las Vegas, NV 89104",
        "price": "$39 per night",
        "imageUrl": "https://example.com/strat-hotel.jpg",
        "geoCoordinates": { "lat": 36.1479, "lng": -115.1566 },
        "rating": 4.0,
        "description": "Budget-friendly hotel with an observation deck offering panoramic views of Las Vegas."
      },
      {
        "hotelName": "Ellis Island Hotel",
        "address": "4250 Koval Ln, Las Vegas, NV 89109",
        "price": "$49 per night",
        "imageUrl": "https://example.com/ellis-hotel.jpg",
        "geoCoordinates": { "lat": 36.1136, "lng": -115.1624 },
        "rating": 4.1,
        "description": "Affordable hotel located near the Strip with a microbrewery and live entertainment."
      }
    ],
    "itinerary": {
      "day1": {
        "bestTimeToVisit": "Morning to Late Evening",
        "places": [
          {
            "placeName": "The Strip",
            "details": "Famous stretch of Las Vegas Boulevard known for casinos and attractions.",
            "imageUrl": "https://example.com/the-strip.jpg",
            "geoCoordinates": { "lat": 36.1147, "lng": -115.1728 },
            "ticketPrice": "Free",
            "travelTime": "5 mins from hotel"
          },
          {
            "placeName": "Bellagio Fountain Show",
            "details": "Choreographed water performances with music and lights.",
            "imageUrl": "https://example.com/bellagio-fountains.jpg",
            "geoCoordinates": { "lat": 36.1126, "lng": -115.1767 },
            "ticketPrice": "Free",
            "travelTime": "10 mins walk"
          },
          {
            "placeName": "Fremont Street Experience",
            "details": "LED canopy with live music, street performers, and historic casinos.",
            "imageUrl": "https://example.com/fremont-street.jpg",
            "geoCoordinates": { "lat": 36.1700, "lng": -115.1443 },
            "ticketPrice": "Free",
            "travelTime": "15 mins by car"
          }
        ]
      },
      "day2": {
        "bestTimeToVisit": "Morning to Afternoon",
        "places": [
          {
            "placeName": "Red Rock Canyon",
            "details": "Scenic desert cliffs and rock formations, perfect for hiking and sightseeing.",
            "imageUrl": "https://example.com/red-rock.jpg",
            "geoCoordinates": { "lat": 36.1350, "lng": -115.4270 },
            "ticketPrice": "$15 per vehicle",
            "travelTime": "30 mins by car"
          },
          {
            "placeName": "Las Vegas Premium Outlets",
            "details": "Outdoor mall with designer outlet stores and food court.",
            "imageUrl": "https://example.com/outlets.jpg",
            "geoCoordinates": { "lat": 36.1750, "lng": -115.1731 },
            "ticketPrice": "Free entry",
            "travelTime": "20 mins from Red Rock"
          }
        ]
      },
      "day3": {
        "bestTimeToVisit": "Afternoon to Night",
        "places": [
          {
            "placeName": "High Roller Observation Wheel",
            "details": "One of the world's tallest observation wheels with panoramic city views.",
            "imageUrl": "https://example.com/high-roller.jpg",
            "geoCoordinates": { "lat": 36.1170, "lng": -115.1686 },
            "ticketPrice": "$23.50 per person",
            "travelTime": "10 mins from hotel"
          },
          {
            "placeName": "The Venetian - Gondola Ride",
            "details": "Romantic gondola ride in a replica of Venice's canals inside a resort.",
            "imageUrl": "https://example.com/venetian.jpg",
            "geoCoordinates": { "lat": 36.1215, "lng": -115.1696 },
            "ticketPrice": "$34 per person",
            "travelTime": "5 mins walk"
          }
        ]
      }
    }
  }`
          }
        ]
      }
    ]
  });
  
  
  