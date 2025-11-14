// Country and city data with country codes
export const COUNTRIES_DATA = [
  {
    name: "United States",
    code: "US",
    countryCode: "+1",
    cities: [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San Jose",
      "Austin",
      "Miami",
      "Denver",
      "Seattle",
      "Boston",
    ],
  },
  {
    name: "Canada",
    code: "CA",
    countryCode: "+1",
    cities: [
      "Toronto",
      "Montreal",
      "Vancouver",
      "Calgary",
      "Ottawa",
      "Edmonton",
      "Halifax",
      "Winnipeg",
    ],
  },
  {
    name: "United Kingdom",
    code: "UK",
    countryCode: "+44",
    cities: [
      "London",
      "Manchester",
      "Birmingham",
      "Leeds",
      "Glasgow",
      "Edinburgh",
      "Liverpool",
      "Bristol",
    ],
  },
  {
    name: "Australia",
    code: "AU",
    countryCode: "+61",
    cities: [
      "Sydney",
      "Melbourne",
      "Brisbane",
      "Perth",
      "Adelaide",
      "Gold Coast",
      "Newcastle",
    ],
  },
  {
    name: "Germany",
    code: "DE",
    countryCode: "+49",
    cities: [
      "Berlin",
      "Munich",
      "Frankfurt",
      "Cologne",
      "Hamburg",
      "Dresden",
      "Düsseldorf",
    ],
  },
  {
    name: "France",
    code: "FR",
    countryCode: "+33",
    cities: [
      "Paris",
      "Lyon",
      "Marseille",
      "Toulouse",
      "Nice",
      "Nantes",
      "Strasbourg",
    ],
  },
  {
    name: "Spain",
    code: "ES",
    countryCode: "+34",
    cities: [
      "Madrid",
      "Barcelona",
      "Valencia",
      "Seville",
      "Bilbao",
      "Malaga",
    ],
  },
  {
    name: "Italy",
    code: "IT",
    countryCode: "+39",
    cities: [
      "Rome",
      "Milan",
      "Naples",
      "Turin",
      "Palermo",
      "Genoa",
    ],
  },
  {
    name: "Netherlands",
    code: "NL",
    countryCode: "+31",
    cities: [
      "Amsterdam",
      "Rotterdam",
      "The Hague",
      "Utrecht",
      "Eindhoven",
      "Groningen",
    ],
  },
  {
    name: "Brazil",
    code: "BR",
    countryCode: "+55",
    cities: [
      "São Paulo",
      "Rio de Janeiro",
      "Brasília",
      "Salvador",
      "Fortaleza",
      "Belo Horizonte",
    ],
  },
  {
    name: "Mexico",
    code: "MX",
    countryCode: "+52",
    cities: [
      "Mexico City",
      "Guadalajara",
      "Monterrey",
      "Cancún",
      "Playa del Carmen",
      "Puerto Vallarta",
    ],
  },
  {
    name: "Japan",
    code: "JP",
    countryCode: "+81",
    cities: [
      "Tokyo",
      "Osaka",
      "Kyoto",
      "Yokohama",
      "Sapporo",
      "Fukuoka",
    ],
  },
  {
    name: "South Korea",
    code: "KR",
    countryCode: "+82",
    cities: ["Seoul", "Busan", "Daegu", "Incheon", "Daejeon", "Gwangju"],
  },
  {
    name: "India",
    code: "IN",
    countryCode: "+91",
    cities: [
      "New Delhi",
      "Mumbai",
      "Bangalore",
      "Hyderabad",
      "Chennai",
      "Kolkata",
    ],
  },
  {
    name: "South Africa",
    code: "ZA",
    countryCode: "+27",
    cities: [
      "Johannesburg",
      "Cape Town",
      "Durban",
      "Pretoria",
      "Port Elizabeth",
    ],
  },
  {
    name: "Nigeria",
    code: "NG",
    countryCode: "+234",
    cities: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan"],
  },
  {
    name: "Thailand",
    code: "TH",
    countryCode: "+66",
    cities: ["Bangkok", "Phuket", "Chiang Mai", "Pattaya", "Krabi"],
  },
  {
    name: "Philippines",
    code: "PH",
    countryCode: "+63",
    cities: ["Manila", "Quezon City", "Cebu", "Davao", "Makati"],
  },
  {
    name: "Singapore",
    code: "SG",
    countryCode: "+65",
    cities: ["Singapore"],
  },
  {
    name: "Argentina",
    code: "AR",
    countryCode: "+54",
    cities: [
      "Buenos Aires",
      "Córdoba",
      "Rosario",
      "Mendoza",
      "La Plata",
    ],
  },
]

export function getCountries() {
  return COUNTRIES_DATA.map((c) => ({
    name: c.name,
    code: c.code,
    countryCode: c.countryCode,
  }))
}

export function getCitiesByCountry(countryCode: string) {
  const country = COUNTRIES_DATA.find((c) => c.code === countryCode)
  return country?.cities || []
}

export function getCountryCode(countryCode: string) {
  const country = COUNTRIES_DATA.find((c) => c.code === countryCode)
  return country?.countryCode || ""
}
