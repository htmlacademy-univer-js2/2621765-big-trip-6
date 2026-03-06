import { getRandomArrayElement } from '../utils.js';

const mockDestinations = [
  {
    id: 'dest-1',
    name: 'Chamonix',
    description: 'Chamonix is a beautiful city near Alps.',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=1',
        description: 'Chamonix city view'
      },
      {
        src: 'https://loremflickr.com/248/152?random=2',
        description: 'Alps mountain'
      }
    ]
  },
  {
    id: 'dest-2',
    name: 'Geneva',
    description: 'Geneva is the second-most-populous city in Switzerland.',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=3',
        description: 'Lake Geneva'
      }
    ]
  },
  {
    id: 'dest-3',
    name: 'Paris',
    description: 'Paris, the capital of France, is known for its art, fashion, and culture.',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=4',
        description: 'Eiffel Tower'
      }
    ]
  }
];

const mockOffers = [
  {
    id: 'offer-taxi-1',
    type: 'taxi',
    title: 'Add luggage',
    price: 30
  },
  {
    id: 'offer-taxi-2',
    type: 'taxi',
    title: 'Business class',
    price: 150
  },
  {
    id: 'offer-flight-1',
    type: 'flight',
    title: 'Choose meal',
    price: 25
  },
  {
    id: 'offer-flight-2',
    type: 'flight',
    title: 'Extra baggage',
    price: 50
  },
  {
    id: 'offer-flight-3',
    type: 'flight',
    title: 'Priority boarding',
    price: 40
  },
  {
    id: 'offer-bus-1',
    type: 'bus',
    title: 'WiFi onboard',
    price: 10
  },
  {
    id: 'offer-train-1',
    type: 'train',
    title: 'First class',
    price: 80
  },
  {
    id: 'offer-train-2',
    type: 'train',
    title: 'Meal included',
    price: 35
  }
];


const mockPoints = [
  {
    id: 'point-1',
    type: 'taxi',
    destinationId: 'dest-1',
    basePrice: 120,
    dateFrom: '12/05/19 06:00',
    dateTo: '12/05/19 07:00',
    isFavorite: true,
    offers: ['offer-taxi-1', 'offer-taxi-2']
  },
  {
    id: 'point-2',
    type: 'flight',
    destinationId: 'dest-2',
    basePrice: 450,
    dateFrom: '13/05/19 10:00',
    dateTo: '13/05/19 12:30',
    isFavorite: false,
    offers: ['offer-flight-1', 'offer-flight-3']
  },
  {
    id: 'point-3',
    type: 'train',
    destinationId: 'dest-3',
    basePrice: 250,
    dateFrom: '14/05/19 15:30',
    dateTo: '14/05/19 18:45',
    isFavorite: true,
    offers: ['offer-train-1']
  },
  {
    id: 'point-4',
    type: 'bus',
    destinationId: 'dest-1',
    basePrice: 45,
    dateFrom: '15/05/19 09:15',
    dateTo: '15/05/19 11:30',
    isFavorite: false,
    offers: ['offer-bus-1']
  },
  {
    id: 'point-5',
    type: 'sightseeing',
    destinationId: 'dest-3',
    basePrice: 85,
    dateFrom: '16/05/19 14:00',
    dateTo: '16/05/19 16:30',
    isFavorite: true,
    offers: []
  }
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

function getRandomOffer() {
  return getRandomArrayElement(mockOffers);
}

function getRandomDestination() {
  return getRandomArrayElement(mockDestinations);
}
export {getRandomPoint,getRandomDestination,getRandomOffer};
