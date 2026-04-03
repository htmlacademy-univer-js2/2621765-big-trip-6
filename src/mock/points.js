import { getRandomArrayElement } from '../util.js';


export const mockPoints = [
  {
    'id': '26b32a80-3cf2-4e1d-9329-9ae4b80335bd',
    'basePrice': 9741,
    'dateFrom': '2026-04-27T14:42:05.804Z',
    'dateTo': '2026-04-28T21:03:05.804Z',
    'destination': '9a19e8ca-b32b-4841-9212-2780884ecb8e',
    'isFavorite': false,
    'offers': ['412fdb97-c1d8-4f49-96d1-c214bcf5996b'],
    'type': 'check-in'
  },
  {
    'id': '4db8f155-2a91-4639-b967-d41e2e42d96d',
    'basePrice': 464,
    'dateFrom': '2026-04-30T21:42:05.804Z',
    'dateTo': '2026-05-02T00:21:05.804Z',
    'destination': 'ab819382-4d59-4589-a496-fc1c891efd8f',
    'isFavorite': false,
    'offers': [
      '5d84bdc8-939f-4d1e-a3b9-8eb4a65c067b',
      'fbc1763e-7353-42b2-9b68-8ea80a155685',
      '7f5db014-abf0-4851-a1f2-6a1efb6a2043'
    ],
    'type': 'taxi'
  },
  {
    'id': 'b0140283-7f4e-4e16-8389-5e592e2c15c2',
    'basePrice': 2001,
    'dateFrom': '2026-05-03T19:10:05.804Z',
    'dateTo': '2026-05-04T11:05:05.804Z',
    'destination': '9d533531-6395-48e2-b067-d82c9cf0d237',
    'isFavorite': false,
    'offers': ['26f2e6d7-6e22-4389-89c1-d484f234712d'],
    'type': 'train'
  },
  {
    'id': '537f8a97-dd72-4ac9-8055-3312b5cdfd84',
    'basePrice': 5773,
    'dateFrom': '2026-05-05T10:57:05.804Z',
    'dateTo': '2026-05-05T18:20:05.804Z',
    'destination': '0730f4e2-3644-4055-9339-1c000a3a2a7b',
    'isFavorite': false,
    'offers': [
      '065ea93c-349a-4943-a927-eef188423294',
      '5533fec5-f2e6-46ca-a5e8-17ccc2cccc8f',
      '19f63e21-5fb8-4b1d-945b-a2227093ea8b'
    ],
    'type': 'flight'
  },
  {
    'id': '3c06e2ff-aff8-4b93-95fa-35452310bc28',
    'basePrice': 5174,
    'dateFrom': '2026-05-07T03:37:05.804Z',
    'dateTo': '2026-05-07T10:15:05.804Z',
    'destination': '9d533531-6395-48e2-b067-d82c9cf0d237',
    'isFavorite': false,
    'offers': [],
    'type': 'train'
  },
  {
    'id': '2a9060ac-d2e7-49c9-b1a2-6c480c7ac0c8',
    'basePrice': 5963,
    'dateFrom': '2026-05-07T17:51:05.804Z',
    'dateTo': '2026-05-08T10:46:05.804Z',
    'destination': 'ab819382-4d59-4589-a496-fc1c891efd8f',
    'isFavorite': false,
    'offers': [],
    'type': 'drive'
  },
  {
    'id': '88cc2132-8e5c-41d8-9cb3-831771335e9d',
    'basePrice': 3687,
    'dateFrom': '2026-05-09T19:32:05.804Z',
    'dateTo': '2026-05-10T23:01:05.804Z',
    'destination': '9a19e8ca-b32b-4841-9212-2780884ecb8e',
    'isFavorite': true,
    'offers': [
      'fbc1763e-7353-42b2-9b68-8ea80a155685',
      '7f5db014-abf0-4851-a1f2-6a1efb6a2043'
    ],
    'type': 'taxi'
  },
  {
    'id': 'eedbe1a6-9706-4557-af4b-37aa868c9e8b',
    'basePrice': 2600,
    'dateFrom': '2026-05-12T22:26:05.804Z',
    'dateTo': '2026-05-13T10:58:05.804Z',
    'destination': 'c928b356-6eac-45bc-8456-9200c8219546',
    'isFavorite': true,
    'offers': [
      'ce327ebf-48ee-4995-ad1b-4494b20c78d5',
      'dba30fea-fcf8-4dba-995e-c0305f4d5547',
      '26f2e6d7-6e22-4389-89c1-d484f234712d'
    ],
    'type': 'train'
  },
  {
    'id': 'b429ed0a-c6a2-40eb-bb83-416a7740f797',
    'basePrice': 4041,
    'dateFrom': '2026-05-14T13:56:05.804Z',
    'dateTo': '2026-05-14T21:38:05.804Z',
    'destination': 'ab819382-4d59-4589-a496-fc1c891efd8f',
    'isFavorite': true,
    'offers': [
      'e9c52c80-06d4-492f-be22-81878e920c4f',
      '1033c209-71b7-42af-890a-da3ed17f423a',
      '9f1af2f1-000d-4a38-a2d4-b9d21345193c'
    ],
    'type': 'ship'
  },
  {
    'id': 'b19533b6-479b-4049-982c-d697b4226b6e',
    'basePrice': 1953,
    'dateFrom': '2026-05-15T16:47:05.804Z',
    'dateTo': '2026-05-17T12:15:05.804Z',
    'destination': 'ab819382-4d59-4589-a496-fc1c891efd8f',
    'isFavorite': true,
    'offers': [
      '4b5149e7-ab5a-4434-abdb-500112272991',
      '28410a50-fc2d-4c50-a03f-3d34957002b8',
      '61fccdfd-7ce0-4d7c-9d9c-0d6ccdbd2955',
      'e9c52c80-06d4-492f-be22-81878e920c4f',
      '1033c209-71b7-42af-890a-da3ed17f423a',
      '9f1af2f1-000d-4a38-a2d4-b9d21345193c'
    ],
    'type': 'ship'
  },
  {
    'id': '9dcbe561-d0e3-4f43-831d-e80a34df0881',
    'basePrice': 9940,
    'dateFrom': '2026-05-19T10:33:05.804Z',
    'dateTo': '2026-05-20T07:25:05.804Z',
    'destination': '9a19e8ca-b32b-4841-9212-2780884ecb8e',
    'isFavorite': true,
    'offers': [],
    'type': 'sightseeing'
  },
  {
    'id': 'e8517d34-46c0-44fb-a8e3-4c6210d3ee98',
    'basePrice': 9310,
    'dateFrom': '2026-05-21T11:18:05.804Z',
    'dateTo': '2026-05-23T10:01:05.804Z',
    'destination': '634287d2-8b83-45d4-b0f5-6398ddf36ece',
    'isFavorite': true,
    'offers': [
      'cd66da33-76a9-4f27-86ac-783b61ec55a1',
      '065ea93c-349a-4943-a927-eef188423294',
      '5533fec5-f2e6-46ca-a5e8-17ccc2cccc8f',
      '19f63e21-5fb8-4b1d-945b-a2227093ea8b'
    ],
    'type': 'flight'
  },
  {
    'id': 'f414d396-e8ac-45ab-9f4e-bb5ef03faf1b',
    'basePrice': 6740,
    'dateFrom': '2026-05-24T05:34:05.804Z',
    'dateTo': '2026-05-25T21:41:05.804Z',
    'destination': '21ee2714-abfc-42e3-8b30-8c8516698435',
    'isFavorite': true,
    'offers': [],
    'type': 'ship'
  },
  {
    'id': '85fc2d29-c03f-4c72-b64b-7f4e87f96f7a',
    'basePrice': 9770,
    'dateFrom': '2026-05-26T22:38:05.804Z',
    'dateTo': '2026-05-27T19:31:05.804Z',
    'destination': 'c928b356-6eac-45bc-8456-9200c8219546',
    'isFavorite': true,
    'offers': [],
    'type': 'ship'
  },
  {
    'id': '5d9406fd-0c09-4b8d-872b-4ba60954d4ab',
    'basePrice': 7400,
    'dateFrom': '2026-05-29T15:19:05.804Z',
    'dateTo': '2026-05-31T09:36:05.804Z',
    'destination': '9a19e8ca-b32b-4841-9212-2780884ecb8e',
    'isFavorite': false,
    'offers': [
      'fbc1763e-7353-42b2-9b68-8ea80a155685',
      '7f5db014-abf0-4851-a1f2-6a1efb6a2043'
    ],
    'type': 'taxi'
  }
];


function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}


export {getRandomPoint};
