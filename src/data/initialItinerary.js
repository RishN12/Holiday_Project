export const INITIAL_ITINERARY = [
  {
    id: "day-1",
    date: "Wed 21st Oct",
    fullDate: "Wednesday 21st October 2026",
    title: "Flight to Florida & Arrival",
    location: "London Heathrow ✈️ Tampa Airport 🏨 Best Western Cocoa Beach",
    category: "flight",
    icon: "Plane",
    summary: "Depart from London Heathrow and arrive at Tampa Airport. Transfer to hotel: Best Western, Cocoa Beach",
    activities: [
      { time: "Morning", title: "Flight Departure from LHR", detail: "Depart from London Heathrow (LHR) on long-haul flight to Tampa, Florida." },
      { time: "Afternoon", title: "Touchdown at Tampa Airport (TPA)", detail: "Pass through US immigration/border control, collect baggage." },
      { time: "Evening", title: "Transfer to Cocoa Beach Hotel", detail: "Coach transfer to Best Western, Cocoa Beach. Check-in, grab dinner & get a good night's rest for NASA tomorrow!" }
    ],
    tips: "Keep passport, ESTA document, school emergency contact, and phone charger in your flight carry-on.",
    hotel: "Best Western, Cocoa Beach"
  },
  {
    id: "day-2",
    date: "Thu 22nd Oct",
    fullDate: "Thursday 22nd October 2026",
    title: "Rocketry Workshop at NASA KSC",
    location: "Kennedy Space Center, Merritt Island, FL",
    category: "nasa",
    icon: "Rocket",
    summary: "Full day Rocketry Workshop at Kennedy Space Center",
    activities: [
      { time: "08:30", title: "Departure to Kennedy Space Center", detail: "Coach drive from Cocoa Beach to KSC." },
      { time: "09:30 - 16:30", title: "Hands-on Rocketry Workshop", detail: "Design, build, and launch model rockets while learning orbital mechanics and rocket engine fundamentals." },
      { time: "Evening", title: "Group Dinner at Cocoa Beach", detail: "Debrief and relax near Cocoa Beach pier." }
    ],
    tips: "Sunscreen, comfortable walking shoes, refillable water bottle, and notebook for workshop physics calculations.",
    hotel: "Best Western, Cocoa Beach"
  },
  {
    id: "day-3",
    date: "Fri 23rd Oct",
    fullDate: "Friday 23rd October 2026",
    title: "NASA Kennedy Space Center Exploration",
    location: "Kennedy Space Center Visitors Complex",
    category: "nasa",
    icon: "Compass",
    summary: "Full day at Kennedy Space Center: Explore exhibits and various areas",
    activities: [
      { time: "09:00", title: "KSC Bus Tour & Saturn V Center", detail: "See active launch pads 39A/39B and stand underneath the massive Saturn V moon rocket." },
      { time: "12:00", title: "Space Shuttle Atlantis & Hubbell Exhibit", detail: "Experience the real Space Shuttle Atlantis suspended in mid-air and Shuttle Launch Experience simulator." },
      { time: "15:00", title: "Astronaut Encounter & IMAX Theater", detail: "Meet a real NASA astronaut and watch 3D space film." }
    ],
    tips: "Bring power bank for photos and cash/card for NASA souvenir store!",
    hotel: "Best Western, Cocoa Beach"
  },
  {
    id: "day-4",
    date: "Sat 24th Oct",
    fullDate: "Saturday 24th October 2026",
    title: "Astronaut Training Experience & Orlando Transfer",
    location: "ATX Center KSC 🚌 Rosen Inn at Pointe, International Drive",
    category: "nasa",
    icon: "Award",
    summary: "Astronaut Training Experience at Kennedy Space Center. Evening transfer to Rosen Inn at Pointe",
    activities: [
      { time: "09:00 - 15:30", title: "Astronaut Training Experience (ATX)", detail: "Train for Mars exploration! Perform simulated spacewalks in microgravity trainers & pilot Mars lander simulators." },
      { time: "16:30", title: "Hotel Transfer to Orlando", detail: "Check out of Cocoa Beach and transfer coach to Rosen Inn at Pointe on International Drive." },
      { time: "19:30", title: "International Drive Dinner & Free Time", detail: "Explore I-Drive area, dinner with group." }
    ],
    tips: "Wear closed-toe athletic sneakers for ATX simulators!",
    hotel: "Rosen Inn at Pointe, Orlando"
  },
  {
    id: "day-5",
    date: "Sun 25th Oct",
    fullDate: "Sunday 25th October 2026",
    title: "Universal Studios & Islands of Adventure",
    location: "Universal Parks Orlando",
    category: "park",
    icon: "Sparkles",
    summary: "Full day at Universal Parks",
    activities: [
      { time: "08:30", title: "Arrival at Universal Orlando", detail: "Enter Wizarding World of Harry Potter (Diagon Alley & Hogsmeade via Hogwarts Express)." },
      { time: "12:30", title: "VelociCoaster & Hulk Coaster Rush", detail: "High speed thrill rides at Islands of Adventure." },
      { time: "17:00", title: "Universal Studios & CityWalk Dinner", detail: "Transformers, Revenge of the Mummy, and dinner on Universal CityWalk." }
    ],
    tips: "Pack light string bag, phone lanyard, and portable charger. Water rides will get you wet!",
    hotel: "Rosen Inn at Pointe, Orlando"
  },
  {
    id: "day-6",
    date: "Mon 26th Oct",
    fullDate: "Monday 26th October 2026",
    title: "i-Fly, Full Sail University & Departure Flight",
    location: "i-Fly Indoor Skydiving 🎓 Full Sail University ✈️ Airport",
    category: "tech",
    icon: "Zap",
    summary: "i-Fly Experience and Full Sail University visit, followed by shopping before departing for return flight",
    activities: [
      { time: "09:30", title: "i-Fly Indoor Skydiving", detail: "Bodyflight indoor skydiving wind tunnel experience!" },
      { time: "11:30", title: "Full Sail University Campus Tour", detail: "Tour world-class audio, gaming, visual arts, and media production labs." },
      { time: "14:30", title: "Orlando Premium Outlets Shopping", detail: "Final souvenir and gift shopping on International Drive." },
      { time: "18:00", title: "Airport Transfer & Departure Flight", detail: "Head to airport for overnight flight back home to London." }
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
