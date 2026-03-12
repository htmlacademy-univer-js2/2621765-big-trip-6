import { getRandomArrayElement } from '../util.js';

export const mockOffers = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': '827923a0-63c5-4736-9679-10556e4ee8b3',
        'title': 'Upgrade to a business class',
        'price': 59
      },
      {
        'id': '6a43f1af-11ab-4cbb-8e2e-ea9b0db74f6c',
        'title': 'Choose the radio station',
        'price': 44
      },
      {
        'id': '5d84bdc8-939f-4d1e-a3b9-8eb4a65c067b',
        'title': 'Choose temperature',
        'price': 162
      },
      {
        'id': 'fbc1763e-7353-42b2-9b68-8ea80a155685',
        'title': 'Drive quickly, I am in a hurry',
        'price': 183
      },
      {
        'id': '7f5db014-abf0-4851-a1f2-6a1efb6a2043',
        'title': 'Drive slowly',
        'price': 74
      }
    ]
  },
  {
    'type': 'bus',
    'offers': [
      {
        'id': '7255e9c2-a213-451d-99fa-cd79362c0f06',
        'title': 'Infotainment system',
        'price': 66
      },
      {
        'id': 'ae7420fd-ae8b-434a-8aa3-559a4a07577c',
        'title': 'Order meal',
        'price': 68
      },
      {
        'id': 'cb43ecd8-723f-41ca-984d-1f1212c628c5',
        'title': 'Choose seats',
        'price': 72
      }
    ]
  },
  {
    'type': 'train',
    'offers': [
      {
        'id': 'ce327ebf-48ee-4995-ad1b-4494b20c78d5',
        'title': 'Book a taxi at the arrival point',
        'price': 132
      },
      {
        'id': 'dba30fea-fcf8-4dba-995e-c0305f4d5547',
        'title': 'Order a breakfast',
        'price': 81
      },
      {
        'id': '26f2e6d7-6e22-4389-89c1-d484f234712d',
        'title': 'Wake up at a certain time',
        'price': 38
      }
    ]
  },
  {
    'type': 'flight',
    'offers': [
      {
        'id': '07320423-3e34-4179-8950-97e086ca1a82',
        'title': 'Choose meal',
        'price': 177
      },
      {
        'id': '9e0576a4-ef7a-47fa-902d-a68a559877cd',
        'title': 'Choose seats',
        'price': 38
      },
      {
        'id': 'cd66da33-76a9-4f27-86ac-783b61ec55a1',
        'title': 'Upgrade to comfort class',
        'price': 57
      },
      {
        'id': '065ea93c-349a-4943-a927-eef188423294',
        'title': 'Upgrade to business class',
        'price': 72
      },
      {
        'id': '5533fec5-f2e6-46ca-a5e8-17ccc2cccc8f',
        'title': 'Add luggage',
        'price': 133
      },
      {
        'id': '19f63e21-5fb8-4b1d-945b-a2227093ea8b',
        'title': 'Business lounge',
        'price': 54
      }
    ]
  },
  {
    'type': 'check-in',
    'offers': [
      {
        'id': '48d9aed1-d85a-4c9f-bdad-3dcaa506b3e4',
        'title': 'Choose the time of check-in',
        'price': 173
      },
      {
        'id': '12a021c3-525c-493a-bdb7-d54a970cf198',
        'title': 'Choose the time of check-out',
        'price': 83
      },
      {
        'id': 'd82ecd19-232f-48dd-ac9d-2b6076d04bb1',
        'title': 'Add breakfast',
        'price': 189
      },
      {
        'id': '6ec02364-a591-4d90-8404-1eaa066a1078',
        'title': 'Laundry',
        'price': 103
      },
      {
        'id': '412fdb97-c1d8-4f49-96d1-c214bcf5996b',
        'title': 'Order a meal from the restaurant',
        'price': 128
      }
    ]
  },
  {
    'type': 'ship',
    'offers': [
      {
        'id': '4b5149e7-ab5a-4434-abdb-500112272991',
        'title': 'Choose meal',
        'price': 118
      },
      {
        'id': '28410a50-fc2d-4c50-a03f-3d34957002b8',
        'title': 'Choose seats',
        'price': 199
      },
      {
        'id': '61fccdfd-7ce0-4d7c-9d9c-0d6ccdbd2955',
        'title': 'Upgrade to comfort class',
        'price': 119
      },
      {
        'id': 'e9c52c80-06d4-492f-be22-81878e920c4f',
        'title': 'Upgrade to business class',
        'price': 44
      },
      {
        'id': '1033c209-71b7-42af-890a-da3ed17f423a',
        'title': 'Add luggage',
        'price': 157
      },
      {
        'id': '9f1af2f1-000d-4a38-a2d4-b9d21345193c',
        'title': 'Business lounge',
        'price': 154
      }
    ]
  },
  {
    'type': 'drive',
    'offers': [
      {
        'id': 'c5d6bdf6-4dd0-4c9b-949c-52f1e10fa111',
        'title': 'With automatic transmission',
        'price': 46
      },
      {
        'id': '7d7e437b-aea4-43df-b85d-214ca8994f1c',
        'title': 'With air conditioning',
        'price': 149
      }
    ]
  },
  {
    'type': 'sightseeing',
    'offers': []
  },
  {
    'type': 'restaurant',
    'offers': [
      {
        'id': 'cee1a47a-0122-4ec4-a2cb-f1fb772fd0b3',
        'title': 'Choose live music',
        'price': 90
      },
      {
        'id': 'b908001e-c8d4-422d-9cfa-654166f598f0',
        'title': 'Choose VIP area',
        'price': 65
      }
    ]
  }
];

function getRandomOffer() {
  return getRandomArrayElement(mockOffers);
}

export {getRandomOffer};
