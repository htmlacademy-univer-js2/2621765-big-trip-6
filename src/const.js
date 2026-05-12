const TIPE = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};


const FilterName = {
  [FilterType.EVERYTHING]: 'Everything',
  [FilterType.FUTURE]: 'Future',
  [FilterType.PRESENT]: 'Present',
  [FilterType.PAST]: 'Past',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const FILTERS = [
  { name: FilterType.EVERYTHING, label: 'Everything' },
  { name: FilterType.FUTURE, label: 'Future' },
  { name: FilterType.PRESENT, label: 'Present' },
  { name: FilterType.PAST, label: 'Past' },
];

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const enabledSortType = {
  [SortType.DAY]: true,
  [SortType.EVENT]: false,
  [SortType.TIME]: true,
  [SortType.PRICE]: true,
  [SortType.OFFER]: false,
};


const UpdateType = {
  MINOR: 'minor',
  MAJOR: 'major',
  INIT: 'init',
};

export { TIPE, FilterType, FilterName, FILTERS, MODE, SortType, enabledSortType, UpdateType,UserAction };
