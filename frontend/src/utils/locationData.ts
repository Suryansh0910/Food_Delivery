export const LOCATIONS = {
  Delhi: [
    'Connaught Place', 'Saket', 'Hauz Khas', 'Dwarka', 'Rohini', 
    'Vasant Kunj', 'Karol Bagh', 'Lajpat Nagar', 'Pitampura', 'Janakpuri'
  ],
  Mumbai: [
    'Andheri', 'Bandra', 'Juhu', 'Colaba', 'Powai', 
    'Borivali', 'Goregaon', 'Malad', 'Dadar', 'Worli'
  ],
  Pune: [
    'Koregaon Park', 'Viman Nagar', 'Hinjewadi', 'Kothrud', 'Baner', 
    'Magarpatta', 'Wakad', 'Kharadi', 'Shivaji Nagar', 'Kalyani Nagar'
  ]
};

export type City = keyof typeof LOCATIONS;
