const TIPE = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
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

export{TIPE,FilterType,FILTERS,MODE};
