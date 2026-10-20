export const INITIAL_ITINERARY = [
  {
    id: "day-1",
    date: "Wed 21st Oct",
    fullDate: "Wednesday 21st October 2026",
    title: "Flight to Florida & Arrival",
    location: "London Heathrow Terminal 3 → Charlotte → Jacksonville → Cocoa Beach",
    category: "flight",
    icon: "Plane",
    summary: "Meet at Heathrow, fly to Jacksonville, then transfer to Cocoa Beach.",
    activities: [
      { time: "06:00", title: "Meet at Heathrow Terminal 3", detail: "Students should be dropped at Terminal 3. Meet in the American Airlines zone." },
      { time: "09:15", title: "Flight to Charlotte", detail: "American Airlines flight AA0731. This is a 9-hour flight." },
      { time: "15:58", title: "Flight to Jacksonville", detail: "Local time. American Airlines flight AA3129, a 1.5-hour connection." },
      { time: "Evening", title: "Transfer to the first hotel", detail: "Two-hour journey to the first hotel with a dinner stop. Dinner is covered by student cash." },
      { time: "21:30", title: "Check in and rest", detail: "Arrive at Best Western Cocoa Beach and prepare for day 2." }
    ],
    tips: "Keep passport, ESTA document, school emergency contact, and phone charger in your flight carry-on.",
    hotel: "Best Western, Cocoa Beach"
  },
  {
    id: "day-2",
    date: "Thu 22nd Oct",
    fullDate: "Thursday 22nd October 2026",
    title: "Kennedy Space Center",
    location: "Kennedy Space Center, Merritt Island, FL",
    category: "nasa",
    icon: "Rocket",
    summary: "Astronaut training, KSC exploration, and an evening guest talk.",
    activities: [
      { time: "07:00", title: "Buffet breakfast at the hotel", detail: "Breakfast before the day at Kennedy Space Center." },
      { time: "Morning", title: "Astronaut training experience", detail: "Take part in the scheduled astronaut training experience." },
      { time: "Afternoon", title: "Explore Kennedy Space Center", detail: "Explore KSC and stop for lunch. Students should purchase lunch at their own expense." },
      { time: "Evening", title: "Dinner and guest speaker", detail: "Buffet dinner by Fish Camp Grill followed by a talk with guest speaker Robert Katz." }
    ],
    tips: "Sunscreen, comfortable walking shoes, refillable water bottle, and notebook for workshop physics calculations.",
    hotel: "Best Western, Cocoa Beach"
  },
  {
    id: "day-3",
    date: "Fri 23rd Oct",
    fullDate: "Friday 23rd October 2026",
    title: "Kennedy Space Center",
    location: "Kennedy Space Center Visitors Complex",
    category: "nasa",
    icon: "Compass",
    summary: "Explore the key KSC exhibits and finish with an evening in Cocoa Beach.",
    activities: [
      { time: "07:00", title: "Buffet breakfast at the hotel", detail: "Breakfast before returning to Kennedy Space Center." },
      { time: "Daytime", title: "Explore the KSC", detail: "See Space Shuttle Atlantis, Saturn V Rocket, Rocket Garden, and the Shuttle Launch Experience." },
      { time: "Lunch", title: "Lunch stop", detail: "Students purchase lunch at their own expense." },
      { time: "Evening", title: "Explore Cocoa Beach", detail: "Visit Cocoa Beach hot spots, Westgate Pier, and Ron Jon's, the world's largest surf shop." }
    ],
    tips: "Bring power bank for photos and cash/card for NASA souvenir store!",
    hotel: "Best Western, Cocoa Beach"
  },
  {
    id: "day-4",
    date: "Sat 24th Oct",
    fullDate: "Saturday 24th October 2026",
    title: "Rocketry and Robotics Workshop",
    location: "Florida Film and STEM Academy → Rosen Inn at Pointe",
    category: "tech",
    icon: "Award",
    summary: "Workshop day, Florida Mall shopping, and the move to the second hotel.",
    activities: [
      { time: "06:00", title: "Buffet breakfast at the hotel", detail: "Breakfast before checking out." },
      { time: "Morning", title: "Check out and travel to Florida Film and STEM Academy", detail: "Board the coach for the 1.5-hour journey." },
      { time: "09:00 - 14:00", title: "Rocketry and Robotics workshop", detail: "Lunch will be provided during the workshop." },
      { time: "Afternoon", title: "Florida Mall shopping", detail: "Visit Florida Mall for shopping." },
      { time: "Evening", title: "Check in and dinner", detail: "Check in at Rosen Inn @ Pointe Orlando and have pre-ordered dinner at Jojo's Shake House." }
    ],
    tips: "Wear closed-toe athletic sneakers for ATX simulators!",
    hotel: "Rosen Inn at Pointe, Orlando"
  },
  {
    id: "day-5",
    date: "Sun 25th Oct",
    fullDate: "Sunday 25th October 2026",
    title: "Universal Studios and Islands of Adventure",
    location: "Universal Parks Orlando",
    category: "park",
    icon: "Sparkles",
    summary: "A full day exploring both Universal parks.",
    activities: [
      { time: "Morning", title: "Buffet breakfast at the hotel", detail: "Breakfast before heading to the parks." },
      { time: "All day", title: "Explore Islands of Adventure and Universal Studios", detail: "Meeting points will be organised throughout the day." },
      { time: "Dinner", title: "Dinner with food vouchers", detail: "Food vouchers are worth $30 and may be used at any point during the day." }
    ],
    tips: "Pack light string bag, phone lanyard, and portable charger. Water rides will get you wet!",
    hotel: "Rosen Inn at Pointe, Orlando"
  },
  {
    id: "day-6",
    date: "Mon 26th Oct",
    fullDate: "Monday 26th October 2026",
    title: "iFly and Full Sail University",
    location: "iFly → Full Sail University → Orlando Airport",
    category: "tech",
    icon: "Zap",
    summary: "iFly, Full Sail University, luggage collection, and the return flight.",
    activities: [
      { time: "07:00", title: "Buffet breakfast at the hotel", detail: "Breakfast before the final activity day." },
      { time: "Morning", title: "iFly workshop and activity", detail: "Take part in the scheduled iFly experience." },
      { time: "Afternoon", title: "Full Sail University guided tour", detail: "Visit Full Sail University before returning to the hotel." },
      { time: "Later", title: "Collect luggage and choose lunch", detail: "Return to the hotel to collect luggage. Lunch options are nearby." },
      { time: "17:54", title: "Flight to Charlotte", detail: "Orlando to Charlotte, flight AA2227." },
      { time: "21:15", title: "Flight to London Heathrow", detail: "Charlotte to London Heathrow, flight AA0732." }
    ],
    tips: "Have passport and customs declaration ready. Dress comfortably for overnight flight.",
    hotel: "In Flight (Overnight)"
  },
  {
    id: "day-7",
    date: "Tue 27th Oct",
    fullDate: "Tuesday 27th October 2026",
    title: "Arrival at London Heathrow",
    location: "London Heathrow Airport (LHR)",
    category: "flight",
    icon: "CheckCircle",
    summary: "Arrive back at London Heathrow",
    activities: [
      { time: "Morning", title: "Touchdown at London Heathrow", detail: "Land safely in London, clear customs, collect bags, and head home after an unforgettable Florida trip!" }
    ],
    tips: "Set clocks back to UK time and share photos with family!",
    hotel: "Home"
  }
];
