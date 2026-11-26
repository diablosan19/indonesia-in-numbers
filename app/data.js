// Indonesia in Numbers — all figures in one place.
// Population is in millions, 2024 mid-year estimates; the 38 province
// populations add up to the national total of 283.50 million exactly.
// Sector shares add to 100%, CPI basket weights add to 100%, and the
// age-pyramid shares add to 100% of the population.
const SITE = {
  name: 'Indonesia in Numbers',
  tagline: 'The country at a glance — people, economy, regions and prices.',
  sourceNote: 'Figures: national statistics, latest available.',
};

// [label, numeric value, decimals, prefix, suffix, year, note]
const INDICATORS = [
  ['Population', 283.5, 1, '', 'M', '2024', 'Mid-year estimate'],
  ['Gross domestic product', 1.4, 2, 'US$', 'tn', '2024', 'Nominal, current prices'],
  ['Economic growth', 5.03, 2, '', '%', '2024', 'Real GDP, year on year'],
  ['GDP per capita', 4919, 0, 'US$', '', '2024', 'Nominal'],
  ['Inflation', 2.86, 2, '', '%', 'Oct 2025', 'Consumer prices, year on year'],
  ['Poverty rate', 8.47, 2, '', '%', 'Sep 2024', 'Share of population'],
  ['Open unemployment', 4.76, 2, '', '%', 'Aug 2024', 'Share of labour force'],
  ['Life expectancy', 72.4, 1, '', ' yrs', '2024', 'At birth'],
  ['Human Development Index', 74.2, 2, '', '', '2024', 'Scale of 0 to 100'],
  ['Gini ratio', 0.375, 3, '', '', '2024', '0 is perfect equality'],
  ['Exports', 264.7, 1, 'US$', 'bn', '2024', 'Goods, free on board'],
  ['Urban population', 58.6, 1, '', '%', '2024', 'Share living in towns and cities'],
];

// Real GDP growth, percent, year on year.
const GDP_GROWTH = [
  [2015, 4.88], [2016, 5.03], [2017, 5.07], [2018, 5.17], [2019, 5.02],
  [2020, -2.07], [2021, 3.7], [2022, 5.31], [2023, 5.05], [2024, 5.03],
];

// Nominal GDP, trillion rupiah.
const NOMINAL_GDP = [
  [2020, 15434], [2021, 16977], [2022, 19588], [2023, 20892], [2024, 22139],
];

// [name, island group, capital, population (millions), area (km2), HDI, poverty %]
// Groups: SU Sumatera, JA Jawa, BN Bali & Nusa Tenggara, KA Kalimantan,
// SL Sulawesi, MP Maluku & Papua.
const PROVINCES = [
  ['Aceh', 'SU', 'Banda Aceh', 5.55, 57956, 74.25, 14.25],
  ['Sumatera Utara', 'SU', 'Medan', 16.3, 72981, 74.76, 8.15],
  ['Sumatera Barat', 'SU', 'Padang', 5.76, 42013, 74.88, 5.55],
  ['Riau', 'SU', 'Pekanbaru', 6.94, 87024, 75.25, 6.85],
  ['Kepulauan Riau', 'SU', 'Tanjung Pinang', 2.16, 8201, 77.97, 5.15],
  ['Jambi', 'SU', 'Jambi', 3.68, 50058, 73.75, 7.15],
  ['Sumatera Selatan', 'SU', 'Palembang', 9.03, 91592, 73.15, 11.05],
  ['Kepulauan Bangka Belitung', 'SU', 'Pangkal Pinang', 1.51, 16424, 73.05, 4.35],
  ['Bengkulu', 'SU', 'Bengkulu', 2.11, 19919, 73.85, 13.75],
  ['Lampung', 'SU', 'Bandar Lampung', 9.42, 34624, 72.85, 10.95],
  ['DKI Jakarta', 'JA', 'Jakarta', 10.56, 664, 82.46, 4.15],
  ['Jawa Barat', 'JA', 'Bandung', 50.85, 35378, 74.45, 7.45],
  ['Jawa Tengah', 'JA', 'Semarang', 38.09, 32801, 74.35, 10.35],
  ['DI Yogyakarta', 'JA', 'Yogyakarta', 3.77, 3133, 81.62, 10.75],
  ['Jawa Timur', 'JA', 'Surabaya', 42.11, 47803, 75.35, 9.85],
  ['Banten', 'JA', 'Serang', 12.43, 9663, 75.45, 5.05],
  ['Bali', 'BN', 'Denpasar', 4.41, 5780, 78.32, 3.85],
  ['Nusa Tenggara Barat', 'BN', 'Mataram', 5.52, 18572, 72.05, 12.55],
  ['Nusa Tenggara Timur', 'BN', 'Kupang', 5.66, 47931, 68.96, 18.95],
  ['Kalimantan Barat', 'KA', 'Pontianak', 5.72, 147307, 71.76, 6.65],
  ['Kalimantan Tengah', 'KA', 'Palangka Raya', 2.8, 153564, 72.55, 5.05],
  ['Kalimantan Selatan', 'KA', 'Banjarmasin', 4.26, 38744, 74.05, 4.25],
  ['Kalimantan Timur', 'KA', 'Samarinda', 4.02, 129067, 78.87, 5.95],
  ['Kalimantan Utara', 'KA', 'Tanjung Selor', 0.73, 75467, 73.95, 6.35],
  ['Sulawesi Utara', 'SL', 'Manado', 2.73, 13892, 74.75, 6.95],
  ['Sulawesi Tengah', 'SL', 'Palu', 3.17, 61841, 71.25, 11.85],
  ['Sulawesi Selatan', 'SL', 'Makassar', 9.46, 46717, 74.65, 8.05],
  ['Sulawesi Tenggara', 'SL', 'Kendari', 2.82, 38068, 72.95, 10.55],
  ['Gorontalo', 'SL', 'Gorontalo', 1.23, 11257, 69.85, 14.85],
  ['Sulawesi Barat', 'SL', 'Mamuju', 1.62, 16787, 68.85, 11.05],
  ['Maluku', 'MP', 'Ambon', 1.98, 46158, 71.05, 15.85],
  ['Maluku Utara', 'MP', 'Sofifi', 1.42, 31982, 70.45, 6.15],
  ['Papua', 'MP', 'Jayapura', 1.1, 82680, 61.55, 24.35],
  ['Papua Pegunungan', 'MP', 'Wamena', 1.49, 51213, 59.45, 34.55],
  ['Papua Selatan', 'MP', 'Merauke', 0.54, 131140, 66.35, 24.15],
  ['Papua Tengah', 'MP', 'Nabire', 1.35, 66130, 62.85, 28.95],
  ['Papua Barat', 'MP', 'Manokwari', 0.56, 60275, 72.45, 20.85],
  ['Papua Barat Daya', 'MP', 'Sorong', 0.64, 39122, 71.35, 19.35],
];

const ISLAND_GROUPS = [
  ['ALL', 'All islands'], ['SU', 'Sumatera'], ['JA', 'Jawa'],
  ['BN', 'Bali & Nusa Tenggara'], ['KA', 'Kalimantan'],
  ['SL', 'Sulawesi'], ['MP', 'Maluku & Papua'],
];

const NATIONAL_POP = 283.5;

// Age pyramid: [cohort label, male % of population, female % of population].
// Male 50.8% + female 49.2% = 100%.
const AGE_PYRAMID = [
  ['0–4', 4.0, 3.8], ['5–9', 4.2, 4.0], ['10–14', 4.3, 4.1],
  ['15–19', 4.4, 4.2], ['20–24', 4.5, 4.3], ['25–29', 4.4, 4.2],
  ['30–34', 4.2, 4.0], ['35–39', 3.9, 3.7], ['40–44', 3.6, 3.5],
  ['45–49', 3.2, 3.1], ['50–54', 2.8, 2.7], ['55–59', 2.3, 2.3],
  ['60–64', 1.8, 1.8], ['65–69', 1.4, 1.4], ['70–74', 0.9, 1.0],
  ['75–79', 0.5, 0.6], ['80+', 0.4, 0.5],
];

const DEMO_FACTS = [
  ['Median age', '30.1 years', 'Half the population is younger, half older.'],
  ['Children 0–14', '24.4%', 'About 69 million people are under 15.'],
  ['Working age 15–64', '68.9%', 'About 195 million people are of working age.'],
  ['Older people 65+', '6.7%', 'About 19 million people are 65 or older.'],
  ['Dependency ratio', '45.1', 'Every 100 working-age people support about 45 others.'],
  ['Sex ratio', '103.2', 'About 103 men for every 100 women.'],
  ['Largest cohort', 'Age 20–24', '8.8% of the population, about 24.9 million people.'],
  ['Most populous province', 'Jawa Barat', '50.85 million people, 17.9% of the nation.'],
  ['Densest province', 'DKI Jakarta', 'About 15,904 people per square kilometre.'],
  ['Least dense province', 'Papua Pegunungan', 'About 29 people per square kilometre.'],
];

// [industry, share of GDP %, growth 2024 %]. Shares add to 100%.
const SECTORS = [
  ['Manufacturing', 18.67, 4.27],
  ['Agriculture, forestry & fishing', 12.53, 1.14],
  ['Wholesale & retail trade', 12.84, 4.86],
  ['Construction', 9.45, 7.52],
  ['Mining & quarrying', 8.47, 3.98],
  ['Public administration & defence', 7.27, 5.21],
  ['Transportation & storage', 5.69, 8.69],
  ['Information & communication', 4.17, 7.03],
  ['Financial & insurance services', 4.1, 6.72],
  ['Education', 3.22, 6.05],
  ['Accommodation & food services', 2.63, 9.87],
  ['Real estate', 2.56, 3.45],
  ['Other services', 5.89, 8.94],
  ['Health & social work', 1.36, 6.88],
  ['Electricity & gas', 1.15, 5.12],
];

const TRADE_CARDS = [
  ['Exports', 'US$264.7bn', '2024', 'Goods, free on board'],
  ['Imports', 'US$234.2bn', '2024', 'Goods, cost, insurance & freight'],
  ['Trade surplus', 'US$30.5bn', '2024', 'Fifth straight year in surplus'],
  ['Top export', 'Coal', 'US$31.6bn', 'Followed by palm oil and iron & steel'],
  ['Top destination', 'China', '22.5% share', 'Followed by the United States and Japan'],
  ['Top import', 'Machinery', 'US$38.9bn', 'Machinery and electrical equipment lead'],
];

// Monthly inflation, percent year on year: [month label, headline, core].
const INFLATION = [
  ['Jan 23', 5.28, 3.27], ['Feb 23', 5.47, 3.09], ['Mar 23', 4.97, 2.94],
  ['Apr 23', 4.33, 2.83], ['May 23', 4.0, 2.66], ['Jun 23', 3.52, 2.58],
  ['Jul 23', 3.08, 2.43], ['Aug 23', 3.27, 2.18], ['Sep 23', 2.28, 2.0],
  ['Oct 23', 2.56, 1.91], ['Nov 23', 2.86, 1.87], ['Dec 23', 2.61, 1.8],
  ['Jan 24', 2.57, 1.68], ['Feb 24', 2.75, 1.69], ['Mar 24', 3.05, 1.77],
  ['Apr 24', 3.0, 1.82], ['May 24', 2.84, 1.93], ['Jun 24', 2.51, 1.9],
  ['Jul 24', 2.13, 1.95], ['Aug 24', 2.12, 2.02], ['Sep 24', 1.84, 2.09],
  ['Oct 24', 1.71, 2.21], ['Nov 24', 1.55, 2.26], ['Dec 24', 1.57, 2.26],
  ['Jan 25', 0.76, 2.36], ['Feb 25', -0.09, 2.48], ['Mar 25', 1.03, 2.51],
  ['Apr 25', 1.95, 2.5], ['May 25', 1.6, 2.4], ['Jun 25', 1.87, 2.37],
  ['Jul 25', 2.37, 2.42], ['Aug 25', 2.31, 2.52], ['Sep 25', 2.65, 2.53],
  ['Oct 25', 2.86, 2.56],
];

// CPI basket: [group, weight %, inflation Oct 2025 % y-on-y]. Weights add to 100%.
const CPI_GROUPS = [
  ['Food, beverages & tobacco', 26.02, 1.84],
  ['Housing, water, electricity & fuel', 16.55, 1.12],
  ['Transport', 12.05, 0.98],
  ['Food & beverage provision', 9.89, 2.45],
  ['Personal care & other services', 6.02, 4.02],
  ['Furnishings & household equipment', 5.94, 1.35],
  ['Information, communication & financial services', 5.85, -0.42],
  ['Education', 5.54, 1.87],
  ['Clothing & footwear', 5.42, 1.02],
  ['Health', 4.59, 2.11],
  ['Recreation, sport & culture', 2.13, 1.68],
];

// [release, reference period, date]
const RELEASES = [
  ['Consumer Price Index', 'November 2025', '1 Dec 2025'],
  ['International Trade', 'October 2025', '17 Nov 2025'],
  ['Gross Domestic Product', 'Q3 2025', '5 Nov 2025'],
  ['Labour Force Survey', 'August 2025', '5 Nov 2025'],
  ['Poverty Profile', 'September 2025', '15 Jan 2026'],
  ['Human Development Index', '2025', '12 Feb 2026'],
];
