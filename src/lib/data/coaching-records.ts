// Coaching records data extracted from Ted Silary's archive (through 2021)

export interface Coach100Wins {
  name: string;
  schools: string[];
  years: number;
  wins: number;
  legendSlug?: string;
}

export interface CoachWinPct {
  name: string;
  schools: string[];
  record: string;
  pct: number;
  legendSlug?: string;
}

export interface CoachYears {
  name: string;
  stints: { school: string; seasons: string }[];
  totalYears: number;
  legendSlug?: string;
}

// Legend slug lookup for the 14 coaches with tribute pages
const LEGEND_SLUGS: Record<string, string> = {
  'Al Angelo': 'al-angelo',
  'Brian Fluck': 'brian-fluck',
  'Dick Bedesem': 'dick-bedesem',
  'Drew Gordon': 'drew-gordon',
  'Gamp Pellegrini': 'gamp-pellegrini',
  'Gil Brooks': 'gil-brooks',
  'Glen Galeone': 'glen-galeone',
  'Joe Colistra': 'joe-colistra',
  'Pat Manzi': 'pat-manzi',
  'Paul Bartolomeo': 'paul-bartolomeo',
  'Ron Cohen': 'ron-cohen',
  'Steve Devlin': 'steve-devlin',
  'Tom DeFelice': 'tom-defelice',
  'Tom Mullineaux': 'tom-mullineaux',
};

function legend(name: string): string | undefined {
  return LEGEND_SLUGS[name];
}

/** Coaches with 100+ career wins, sorted by wins descending */
export const COACHES_100_WINS: Coach100Wins[] = [
  { name: 'Gamp Pellegrini', schools: ['St. Thomas More', 'St. Joseph\'s Prep', 'Malvern Prep'], years: 42, wins: 278, legendSlug: legend('Gamp Pellegrini') },
  { name: 'Ron Cohen', schools: ['Washington'], years: 30, wins: 261, legendSlug: legend('Ron Cohen') },
  { name: 'Whitey Sullivan', schools: ['Judge'], years: 25, wins: 196 },
  { name: 'Pat Manzi', schools: ['McDevitt'], years: 33, wins: 189, legendSlug: legend('Pat Manzi') },
  { name: 'Al Angelo', schools: ['Frankford'], years: 21, wins: 184, legendSlug: legend('Al Angelo') },
  { name: 'Brian Fluck', schools: ['West Catholic'], years: 20, wins: 179, legendSlug: legend('Brian Fluck') },
  { name: 'Paul Bartolomeo', schools: ['Neumann'], years: 33, wins: 170, legendSlug: legend('Paul Bartolomeo') },
  { name: 'Tex Flannery', schools: ['Bartram', 'La Salle'], years: 33, wins: 164 },
  { name: 'Bob Cullman', schools: ['Central'], years: 25, wins: 163 },
  { name: 'Gil Brooks', schools: ['St. Joseph\'s Prep'], years: 18, wins: 162, legendSlug: legend('Gil Brooks') },
  { name: 'Doc Wallace', schools: ['St. Luke\'s', 'Haverford School'], years: 34, wins: 158 },
  { name: 'Joe Colistra', schools: ['La Salle'], years: 21, wins: 153, legendSlug: legend('Joe Colistra') },
  { name: 'Bill Bernardo', schools: ['Gratz', 'Germantown', 'Northeast'], years: 29, wins: 147 },
  { name: 'George Stratts', schools: ['McDevitt', 'Dougherty', 'O\'Hara'], years: 25, wins: 147 },
  { name: 'Tom Mullineaux', schools: ['Frankford'], years: 16, wins: 145, legendSlug: legend('Tom Mullineaux') },
  { name: 'Mex Siani', schools: ['Bok', 'Southern'], years: 27, wins: 142 },
  { name: 'Cliff Hubbard', schools: ['Roxborough', 'Fels'], years: 35, wins: 139 },
  { name: 'Jim Auch Jr.', schools: ['Malvern Prep', 'Haverford School', 'Episcopal Academy'], years: 26, wins: 137 },
  { name: 'Steve Devlin', schools: ['Archbishop Wood'], years: 11, wins: 132, legendSlug: legend('Steve Devlin') },
  { name: 'John Murphy', schools: ['Mastbaum'], years: 20, wins: 130 },
  { name: 'Tom DeFelice', schools: ['Bok'], years: 18, wins: 129, legendSlug: legend('Tom DeFelice') },
  { name: 'Odie Surrick', schools: ['Frankford'], years: 21, wins: 128 },
  { name: 'Gus Geiges', schools: ['Northeast'], years: 26, wins: 127 },
  { name: 'Glen Galeone', schools: ['Ryan'], years: 19, wins: 123, legendSlug: legend('Glen Galeone') },
  { name: 'Tommy Coyle', schools: ['Judge', 'Penn Charter'], years: 22, wins: 121 },
  { name: 'Lou Grandizio', schools: ['Lincoln'], years: 22, wins: 119 },
  { name: 'Moe Weinstein', schools: ['Roxborough', 'Lincoln'], years: 20, wins: 116 },
  { name: 'Bob Ewing', schools: ['O\'Hara'], years: 16, wins: 116 },
  { name: 'Brew Schumer', schools: ['Northeast'], years: 18, wins: 113 },
  { name: 'Beans Brennan', schools: ['St. James'], years: 22, wins: 112 },
  { name: 'Wes Hackman', schools: ['West Philadelphia'], years: 27, wins: 111 },
  { name: 'John Quinn', schools: ['Ryan', 'Roman', 'North Catholic', 'Conwell-Egan'], years: 22, wins: 111 },
  { name: 'Rick Knox', schools: ['Episcopal Academy', 'CHA/SCH Academy'], years: 20, wins: 109 },
  { name: 'Dan Bielli', schools: ['Kensington-Kennedy', 'Carroll'], years: 15, wins: 106 },
  { name: 'Bill Gallagher', schools: ['Penn Charter', 'Episcopal Academy'], years: 19, wins: 104 },
  { name: 'Jack Turner', schools: ['Germantown Academy'], years: 23, wins: 103 },
];

/** Coaches with best winning percentages (min 5 full seasons; ties not counted), sorted by pct descending */
export const COACHES_BEST_PCT: CoachWinPct[] = [
  { name: 'Bob Dougherty', schools: ['West Catholic'], record: '41-5-5', pct: 0.891 },
  { name: 'Ank Scanlan', schools: ['St. Joseph\'s Prep'], record: '93-15-10', pct: 0.861 },
  { name: 'Steve Devlin', schools: ['Archbishop Wood'], record: '132-22-1', pct: 0.857, legendSlug: legend('Steve Devlin') },
  { name: 'Albie Crosby', schools: ['Imhotep', 'Neumann-Goretti'], record: '93-16-0', pct: 0.853 },
  { name: 'Al Angelo', schools: ['Frankford'], record: '184-39-5', pct: 0.833, legendSlug: legend('Al Angelo') },
  { name: 'Tom Mullineaux', schools: ['Frankford'], record: '145-31-1', pct: 0.824, legendSlug: legend('Tom Mullineaux') },
  { name: 'Shark McGuinn', schools: ['Malvern Prep'], record: '64-14-4', pct: 0.821 },
  { name: 'Gabe Infante', schools: ['St. Joseph\'s Prep'], record: '91-22-0', pct: 0.805 },
  { name: 'Jack Gillespie', schools: ['North Catholic'], record: '70-19-2', pct: 0.787 },
  { name: 'Drew Gordon', schools: ['La Salle'], record: '91-26-0', pct: 0.778, legendSlug: legend('Drew Gordon') },
  { name: 'Dick Merritt', schools: ['Penn Charter'], record: '93-27-6', pct: 0.775 },
  { name: 'Ray Dooney', schools: ['Penn Charter'], record: '86-25-2', pct: 0.775 },
  { name: 'Ron Cohen', schools: ['Washington'], record: '261-84-2', pct: 0.757, legendSlug: legend('Ron Cohen') },
  { name: 'Jack Ferrante', schools: ['Bonner'], record: '40-14-4', pct: 0.740 },
  { name: 'Gil Brooks', schools: ['St. Joseph\'s Prep'], record: '162-57-2', pct: 0.740, legendSlug: legend('Gil Brooks') },
  { name: 'Dick Bedesem', schools: ['Egan', 'Archbishop Wood'], record: '85-30-5', pct: 0.739, legendSlug: legend('Dick Bedesem') },
  { name: 'Ken Simendinger', schools: ['North Catholic'], record: '62-22-12', pct: 0.738 },
  { name: 'Dave Gueriera', schools: ['Malvern Prep'], record: '33-12-0', pct: 0.733 },
  { name: 'Tom DeFelice', schools: ['Bok'], record: '129-50-1', pct: 0.721, legendSlug: legend('Tom DeFelice') },
  { name: 'Chappy Moore', schools: ['Kenrick', 'O\'Hara'], record: '47-19-0', pct: 0.712 },
  { name: 'Ben Johnston', schools: ['Germantown'], record: '49-20-2', pct: 0.710 },
  { name: 'Ed Baker', schools: ['Haverford School'], record: '49-21-2', pct: 0.700 },
  { name: 'Moe Weinstein', schools: ['Roxborough', 'Lincoln'], record: '116-51-4', pct: 0.695 },
  { name: 'Vince McAneney', schools: ['West Catholic'], record: '52-23-5', pct: 0.693 },
  { name: 'Doc Wallace', schools: ['St. Luke\'s', 'Haverford School'], record: '158-81-24', pct: 0.690 },
  { name: 'Brian Fluck', schools: ['West Catholic'], record: '179-82-0', pct: 0.686, legendSlug: legend('Brian Fluck') },
  { name: 'Kevin Pellegrini', schools: ['Malvern Prep'], record: '37-17-0', pct: 0.685 },
  { name: 'Joe DiDomenic', schools: ['Franklin'], record: '39-18-3', pct: 0.684 },
  { name: 'Doug Macauley', schools: ['Dobbins'], record: '92-43-3', pct: 0.681 },
  { name: 'Bob Ewing', schools: ['O\'Hara'], record: '116-55-4', pct: 0.678 },
  { name: 'Odie Surrick', schools: ['Frankford'], record: '128-61-8', pct: 0.677 },
  { name: 'Bob Cullman', schools: ['Central'], record: '163-78-4', pct: 0.676 },
  { name: 'Whitey Sullivan', schools: ['Judge'], record: '196-95-10', pct: 0.674 },
  { name: 'Hench Murray', schools: ['Penn Charter'], record: '45-23-0', pct: 0.662 },
  { name: 'Mel Hinton', schools: ['Northeast'], record: '47-24-0', pct: 0.662 },
  { name: 'Gamp Pellegrini', schools: ['St. Thomas More', 'St. Joseph\'s Prep', 'Malvern Prep'], record: '278-144-9', pct: 0.659, legendSlug: legend('Gamp Pellegrini') },
  { name: 'John Steinmetz', schools: ['La Salle'], record: '48-25-0', pct: 0.658 },
  { name: 'Fred Hauser', schools: ['Roxborough'], record: '87-46-9', pct: 0.657 },
  { name: 'Todd Fairlie', schools: ['Episcopal Academy'], record: '69-36-0', pct: 0.657 },
  { name: 'Dave Sanderson', schools: ['King'], record: '34-18-1', pct: 0.654 },
  { name: 'John Orsi', schools: ['Penn Charter', 'Episcopal Academy'], record: '64-33-7', pct: 0.652 },
  { name: 'Ken Geiser', schools: ['Franklin'], record: '39-21-0', pct: 0.650 },
  { name: 'Brian McCloskey', schools: ['Penn Charter'], record: '80-44-0', pct: 0.645 },
  { name: 'Gene O\'Pella', schools: ['Dougherty'], record: '58-32-5', pct: 0.644 },
  { name: 'Ray Keegan', schools: ['Episcopal Academy'], record: '45-25-7', pct: 0.643 },
  { name: 'Ed Veith', schools: ['Overbrook', 'Central'], record: '95-53-11', pct: 0.642 },
  { name: 'Gus Geiges', schools: ['Northeast'], record: '127-71-21', pct: 0.641 },
  { name: 'John McAneney', schools: ['West Catholic', 'Northeast', 'Frankford'], record: '72-46-1', pct: 0.640 },
  { name: 'John Murphy', schools: ['Mastbaum'], record: '130-73-2', pct: 0.640 },
  { name: 'Joe Colistra', schools: ['La Salle'], record: '153-88-2', pct: 0.635, legendSlug: legend('Joe Colistra') },
  { name: 'Kevin Clancy', schools: ['Carroll'], record: '67-39-2', pct: 0.632 },
  { name: 'Len Kolenda', schools: ['Overbrook', 'Central'], record: '41-24-6', pct: 0.631 },
  { name: 'Bill Gallagher', schools: ['Penn Charter', 'Episcopal Academy'], record: '104-61-2', pct: 0.630 },
  { name: 'Elwood Geiges', schools: ['Frankford'], record: '84-50-23', pct: 0.627 },
  { name: 'Will Doggett', schools: ['Frankford'], record: '37-22-0', pct: 0.627 },
  { name: 'Frank Conway Sr.', schools: ['Bartram'], record: '88-53-6', pct: 0.624 },
  { name: 'Brew Schumer', schools: ['Northeast'], record: '113-68-2', pct: 0.624 },
  { name: 'Jim Auch Jr.', schools: ['Malvern Prep', 'Haverford School', 'Episcopal Academy'], record: '137-84-7', pct: 0.620 },
  { name: 'Goldie Graham', schools: ['Roman'], record: '87-54-7', pct: 0.617 },
  { name: 'Danny Algeo', schools: ['Roman', 'O\'Hara'], record: '95-60-0', pct: 0.613 },
  { name: 'Jack Gottshalk', schools: ['Bonner'], record: '32-21-4', pct: 0.604 },
  { name: 'Joe Pitt', schools: ['Southern'], record: '77-51-5', pct: 0.602 },
  { name: 'Dan Bielli', schools: ['Kensington-Kennedy', 'Carroll'], record: '106-70-0', pct: 0.602 },
  { name: 'Bill Bernardo', schools: ['Gratz', 'Germantown', 'Northeast'], record: '147-98-10', pct: 0.600 },
];

/** Coaches with the most years coached, sorted by totalYears descending */
export const COACHES_MOST_YEARS: CoachYears[] = [
  {
    name: 'Gamp Pellegrini',
    stints: [
      { school: 'St. Thomas More', seasons: '1967-69' },
      { school: 'St. Joseph\'s Prep', seasons: '1970-77' },
      { school: 'Malvern Prep', seasons: '1978-08' },
    ],
    totalYears: 42,
    legendSlug: legend('Gamp Pellegrini'),
  },
  {
    name: 'Cliff Hubbard',
    stints: [
      { school: 'Roxborough', seasons: '1969-02' },
      { school: 'Fels', seasons: '2006-07' },
    ],
    totalYears: 36,
  },
  {
    name: 'Doc Wallace',
    stints: [
      { school: 'St. Luke\'s', seasons: '1921-26' },
      { school: 'Haverford School', seasons: '1929-56' },
    ],
    totalYears: 34,
  },
  {
    name: 'Paul Bartolomeo',
    stints: [
      { school: 'South Catholic/Neumann', seasons: '1946-78' },
    ],
    totalYears: 33,
    legendSlug: legend('Paul Bartolomeo'),
  },
  {
    name: 'Tex Flannery',
    stints: [
      { school: 'Bartram', seasons: '1944-47' },
      { school: 'La Salle', seasons: '1956-84' },
    ],
    totalYears: 33,
  },
  {
    name: 'Pat Manzi',
    stints: [
      { school: 'McDevitt', seasons: '1982-13, 15' },
    ],
    totalYears: 33,
    legendSlug: legend('Pat Manzi'),
  },
  {
    name: 'Ron Cohen',
    stints: [
      { school: 'Washington', seasons: '1985-14' },
    ],
    totalYears: 30,
    legendSlug: legend('Ron Cohen'),
  },
  {
    name: 'Bill Bernardo',
    stints: [
      { school: 'Gratz', seasons: '1950-51' },
      { school: 'Germantown', seasons: '1955-67' },
      { school: 'Northeast', seasons: '1968-81' },
    ],
    totalYears: 29,
  },
  {
    name: 'John Urban',
    stints: [
      { school: 'Bok', seasons: '1962-67' },
      { school: 'Olney', seasons: '1969-90' },
    ],
    totalYears: 28,
  },
  {
    name: 'Wes Hackman',
    stints: [
      { school: 'West Philadelphia', seasons: '1927-53' },
    ],
    totalYears: 27,
  },
  {
    name: 'Mex Siani',
    stints: [
      { school: 'Bok', seasons: '1948-57' },
      { school: 'Southern', seasons: '1958-74' },
    ],
    totalYears: 27,
  },
  {
    name: 'Larry Oliver',
    stints: [
      { school: 'Edison', seasons: '1983-09' },
    ],
    totalYears: 27,
  },
  {
    name: 'Gus Geiges',
    stints: [
      { school: 'Northeast', seasons: '1926-51' },
    ],
    totalYears: 26,
  },
  {
    name: 'Jim Auch Jr.',
    stints: [
      { school: 'Malvern Prep', seasons: '1964-65' },
      { school: 'Haverford School', seasons: '1967-69' },
      { school: 'Episcopal Academy', seasons: '1974' },
      { school: 'Episcopal Academy', seasons: '1977-84' },
      { school: 'Episcopal Academy', seasons: '1986-94' },
      { school: 'Episcopal Academy', seasons: '1998-00' },
    ],
    totalYears: 26,
  },
  {
    name: 'Charlie Guida',
    stints: [
      { school: 'Bok', seasons: '1968-92' },
    ],
    totalYears: 25,
  },
  {
    name: 'George Stratts',
    stints: [
      { school: 'McDevitt', seasons: '1970-73' },
      { school: 'Dougherty', seasons: '1974-84' },
      { school: 'O\'Hara', seasons: '1994-03' },
    ],
    totalYears: 25,
  },
  {
    name: 'Bob Cullman',
    stints: [
      { school: 'Central', seasons: '1972-96' },
    ],
    totalYears: 25,
  },
  {
    name: 'Whitey Sullivan',
    stints: [
      { school: 'Judge', seasons: '1974-85' },
      { school: 'Judge', seasons: '1987-99' },
    ],
    totalYears: 25,
  },
  {
    name: 'Vince Trombetta',
    stints: [
      { school: 'Franklin', seasons: '1969-92' },
    ],
    totalYears: 24,
  },
  {
    name: 'Jack Turner',
    stints: [
      { school: 'Germantown Academy', seasons: '1964-86' },
    ],
    totalYears: 23,
  },
  {
    name: 'Beans Brennan',
    stints: [
      { school: 'St. James', seasons: '1943-64' },
    ],
    totalYears: 22,
  },
  {
    name: 'Bud Conrad',
    stints: [
      { school: 'Dobbins', seasons: '1952-73' },
    ],
    totalYears: 22,
  },
  {
    name: 'Lou Grandizio',
    stints: [
      { school: 'Lincoln', seasons: '1964-85' },
    ],
    totalYears: 22,
  },
  {
    name: 'John Quinn',
    stints: [
      { school: 'Ryan', seasons: '1968-75' },
      { school: 'Ryan', seasons: '1981-84' },
      { school: 'Ryan', seasons: '1988-89' },
      { school: 'Roman', seasons: '1992-93' },
      { school: 'North Catholic', seasons: '1994-96' },
      { school: 'Conwell-Egan', seasons: '1999-01' },
    ],
    totalYears: 22,
  },
  {
    name: 'Alex Saddic',
    stints: [
      { school: 'University City', seasons: '1973-94' },
    ],
    totalYears: 22,
  },
  {
    name: 'Tommy Coyle',
    stints: [
      { school: 'Judge', seasons: '2000-12' },
      { school: 'Penn Charter', seasons: '2013-21' },
    ],
    totalYears: 22,
  },
  {
    name: 'Odie Surrick',
    stints: [
      { school: 'Frankford', seasons: '1941-42' },
      { school: 'Frankford', seasons: '1946-64' },
    ],
    totalYears: 21,
  },
  {
    name: 'Al Angelo',
    stints: [
      { school: 'Frankford', seasons: '1965-84' },
      { school: 'Frankford', seasons: '1987' },
    ],
    totalYears: 21,
    legendSlug: legend('Al Angelo'),
  },
  {
    name: 'Joe Colistra',
    stints: [
      { school: 'La Salle', seasons: '1985-05' },
    ],
    totalYears: 21,
    legendSlug: legend('Joe Colistra'),
  },
  {
    name: 'Ellwood Geiges',
    stints: [
      { school: 'Frankford', seasons: '1918-29' },
      { school: 'Frankford', seasons: '1933-40' },
    ],
    totalYears: 20,
  },
  {
    name: 'Moe Weinstein',
    stints: [
      { school: 'Roxborough', seasons: '1943-50' },
      { school: 'Lincoln', seasons: '1951-58' },
      { school: 'Lincoln', seasons: '1960-63' },
    ],
    totalYears: 20,
  },
  {
    name: 'John Murphy',
    stints: [
      { school: 'Mastbaum', seasons: '1984-03' },
    ],
    totalYears: 20,
  },
  {
    name: 'Brian Fluck',
    stints: [
      { school: 'West Catholic', seasons: '1999-18' },
    ],
    totalYears: 20,
    legendSlug: legend('Brian Fluck'),
  },
  {
    name: 'Rick Knox',
    stints: [
      { school: 'Episcopal Academy', seasons: '2001-04' },
      { school: 'CHA/SCH Academy', seasons: '2006-21' },
    ],
    totalYears: 20,
  },
];
