// This is your fake API response
export const mockReportData = {
  address: "Connaught Place, New Delhi, Delhi 110001, India",
  location: {
    lat: 28.6324,
    lon: 77.217,
  },
  healthScore: {
    grade: "C",
    description: "Moderate environmental health. Some areas need attention.",
  },
  aqi: {
    value: 152,
    rating: "Unhealthy",
  },
  noise: {
    value: 68,
    rating: "Moderate",
  },
  complaints: {
    count: 3,
    rating: "Poor",
    items: [
      {
        lat: 28.633,
        lon: 77.218,
        category: "Garbage",
        text: "Garbage bin overflowing for 3 days near metro station gate 2.",
      },
      {
        lat: 28.631,
        lon: 77.219,
        category: "Infrastructure",
        text: "Broken streetlight on the inner circle road.",
      },
      {
        lat: 28.634,
        lon: 77.216,
        category: "Noise",
        text: "Loud construction noise continuing after 10 PM.",
      },
    ],
  },
};