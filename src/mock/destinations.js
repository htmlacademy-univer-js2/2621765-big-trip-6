import { getRandomArrayElement } from '../util.js';


export const mockDestinations = [
  {
    'id': '7655ac0a-99d2-4435-ae91-36690216dcb4',
    'description': 'Monaco - full of of cozy canteens where you can try the best coffee in the Middle East',
    'name': 'Monaco',
    'pictures': [
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/3.jpg',
        'description': 'Monaco with an embankment of a mighty river as a centre of attraction'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/13.jpg',
        'description': 'Monaco with an embankment of a mighty river as a centre of attraction'
      }
    ]
  },
  {
    'id': '9a19e8ca-b32b-4841-9212-2780884ecb8e',
    'description': '',
    'name': 'Vien',
    'pictures': []
  },
  {
    'id': '21ee2714-abfc-42e3-8b30-8c8516698435',
    'description': 'Den Haag - with an embankment of a mighty river as a centre of attraction',
    'name': 'Den Haag',
    'pictures': [
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/17.jpg',
        'description': 'Den Haag full of of cozy canteens where you can try the best coffee in the Middle East'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/5.jpg',
        'description': 'Den Haag in a middle of Europe'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/9.jpg',
        'description': 'Den Haag famous for its crowded street markets with the best street food in Asia'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/8.jpg',
        'description': 'Den Haag with an embankment of a mighty river as a centre of attraction'
      }
    ]
  },
  {
    'id': '634287d2-8b83-45d4-b0f5-6398ddf36ece',
    'description': 'Kopenhagen - with a beautiful old town',
    'name': 'Kopenhagen',
    'pictures': [
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/10.jpg',
        'description': 'Kopenhagen in a middle of Europe'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/16.jpg',
        'description': 'Kopenhagen a perfect place to stay with a family'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/9.jpg',
        'description': 'Kopenhagen for those who value comfort and coziness'
      }
    ]
  },
  {
    'id': '0730f4e2-3644-4055-9339-1c000a3a2a7b',
    'description': 'Frankfurt - is a beautiful city',
    'name': 'Frankfurt',
    'pictures': [
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/15.jpg',
        'description': 'Frankfurt with a beautiful old town'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/12.jpg',
        'description': 'Frankfurt with crowded streets'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/9.jpg',
        'description': 'Frankfurt with an embankment of a mighty river as a centre of attraction'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/2.jpg',
        'description': 'Frankfurt with an embankment of a mighty river as a centre of attraction'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/13.jpg',
        'description': 'Frankfurt middle-eastern paradise'
      }
    ]
  },
  {
    'id': 'bd920677-7596-4afe-bd60-8106281414a6',
    'description': 'Amsterdam - a perfect place to stay with a family',
    'name': 'Amsterdam',
    'pictures': [
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/15.jpg',
        'description': 'Amsterdam a perfect place to stay with a family'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/2.jpg',
        'description': 'Amsterdam with crowded streets'
      }
    ]
  },
  {
    'id': 'c928b356-6eac-45bc-8456-9200c8219546',
    'description': '',
    'name': 'Milan',
    'pictures': []
  },
  {
    'id': '528f7c59-ed72-4a89-bc8f-1da5d9711c2c',
    'description': 'Helsinki - with an embankment of a mighty river as a centre of attraction',
    'name': 'Helsinki',
    'pictures': [
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/12.jpg',
        'description': 'Helsinki a perfect place to stay with a family'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/16.jpg',
        'description': 'Helsinki full of of cozy canteens where you can try the best coffee in the Middle East'
      }
    ]
  },
  {
    'id': '9d533531-6395-48e2-b067-d82c9cf0d237',
    'description': '',
    'name': 'Tokio',
    'pictures': []
  },
  {
    'id': 'ab819382-4d59-4589-a496-fc1c891efd8f',
    'description': '',
    'name': 'Moscow',
    'pictures': []
  }
];


function getRandomDestination() {
  return getRandomArrayElement(mockDestinations);
}

export{getRandomDestination};

