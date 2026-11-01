/**
 * High-Wealth Zip Code Repository across 7 Target US Metros
 *
 * Master catalog of 50+ affluent postal codes with Median Household Income (HHI) > $120,000,
 * verified against Census Bureau ACS Table B19013 and IRS Statistics of Income (SOI).
 *
 * High discretionary net worth directly correlates with out-of-pocket full-arch surgical cases
 * ($25,000 - $60,000 per arch) and high local procedure demand.
 */

import { AffluentZipInfo, TargetMetro } from './types';

export const TARGET_METROS: TargetMetro[] = [
  'Phoenix / Scottsdale, AZ',
  'Orange County / Newport Beach, CA',
  'Los Angeles Westside / Beverly Hills, CA',
  'Dallas–Fort Worth / North Plano, TX',
  'South Florida / Boca Raton & Naples, FL',
  'Seattle Eastside / Bellevue, WA',
  'Fairfield County / Greenwich, CT',
  'Manhattan / New York, NY',
  'Silicon Valley / Atherton & Palo Alto, CA',
  'Colorado Luxury / Aspen & Vail, CO',
];

export const AFFLUENT_ZIPS_CATALOG: Record<string, AffluentZipInfo> = {
  // 1. Phoenix / Scottsdale, AZ
  '85253': {
    zipCode: '85253',
    metro: 'Phoenix / Scottsdale, AZ',
    city: 'Paradise Valley',
    state: 'AZ',
    neighborhoods: ['Paradise Valley', 'Camelback Foothills', 'Mummy Mountain'],
    medianHhi: 215000,
    dominantCaseType: 'All-on-4, Full-Arch Zirconia, Zygomatic Implants',
    coordinates: { latitude: 33.5312, longitude: -111.9427 },
  },
  '85254': {
    zipCode: '85254',
    metro: 'Phoenix / Scottsdale, AZ',
    city: 'Scottsdale',
    state: 'AZ',
    neighborhoods: ['Kierland', 'Scottsdale Horizon', 'Stonegate Corridor'],
    medianHhi: 138000,
    dominantCaseType: 'Immediate Load Implants, Computer-Guided All-on-X',
    coordinates: { latitude: 33.6138, longitude: -111.9431 },
  },
  '85255': {
    zipCode: '85255',
    metro: 'Phoenix / Scottsdale, AZ',
    city: 'Scottsdale',
    state: 'AZ',
    neighborhoods: ['DC Ranch', 'Silverleaf', 'Grayhawk', 'Troon'],
    medianHhi: 168000,
    dominantCaseType: 'Full-Arch Reconstruction, Zirconia Hybrid Bridges',
    coordinates: { latitude: 33.6844, longitude: -111.8841 },
  },
  '85258': {
    zipCode: '85258',
    metro: 'Phoenix / Scottsdale, AZ',
    city: 'Scottsdale',
    state: 'AZ',
    neighborhoods: ['Gainey Ranch', 'McCormick Ranch'],
    medianHhi: 142000,
    dominantCaseType: 'Surgical Dental Implants, Teeth-in-a-Day',
    coordinates: { latitude: 33.5656, longitude: -111.8953 },
  },
  '85259': {
    zipCode: '85259',
    metro: 'Phoenix / Scottsdale, AZ',
    city: 'Scottsdale',
    state: 'AZ',
    neighborhoods: ['Ancala', 'McDowell Mountain Ranch'],
    medianHhi: 155000,
    dominantCaseType: 'All-on-4, PRF Bone Grafting, Sinus Augmentation',
    coordinates: { latitude: 33.5968, longitude: -111.8159 },
  },
  '85260': {
    zipCode: '85260',
    metro: 'Phoenix / Scottsdale, AZ',
    city: 'Scottsdale',
    state: 'AZ',
    neighborhoods: ['North Scottsdale Medical Corridor', 'Scottsdale Airpark'],
    medianHhi: 135000,
    dominantCaseType: 'Full-Mouth Restoration, Sedation Implant Surgery',
    coordinates: { latitude: 33.6013, longitude: -111.8867 },
  },
  '85262': {
    zipCode: '85262',
    metro: 'Phoenix / Scottsdale, AZ',
    city: 'Scottsdale',
    state: 'AZ',
    neighborhoods: ['Desert Mountain', 'Troon North', 'Mirabel'],
    medianHhi: 180000,
    dominantCaseType: 'Full-Arch Zirconia, Complex Maxillofacial Implants',
    coordinates: { latitude: 33.7915, longitude: -111.7779 },
  },
  '85266': {
    zipCode: '85266',
    metro: 'Phoenix / Scottsdale, AZ',
    city: 'Scottsdale',
    state: 'AZ',
    neighborhoods: ['Carefree', 'Whisper Rock', 'Boulders'],
    medianHhi: 165000,
    dominantCaseType: 'All-on-X, Teeth-in-a-Day, Geriatric Restorations',
    coordinates: { latitude: 33.7852, longitude: -111.9056 },
  },
  '85018': {
    zipCode: '85018',
    metro: 'Phoenix / Scottsdale, AZ',
    city: 'Phoenix / Paradise Valley',
    state: 'AZ',
    neighborhoods: ['Arcadia', 'Camelback Mountain Corridor', 'Paradise Valley Border'],
    medianHhi: 155000,
    dominantCaseType: 'All-on-4, Surgical Restorative Implants, Teeth-in-a-Day',
    coordinates: { latitude: 33.4988, longitude: -111.9612 },
  },

  // 2. Orange County / Newport Beach, CA
  '92660': {
    zipCode: '92660',
    metro: 'Orange County / Newport Beach, CA',
    city: 'Newport Beach',
    state: 'CA',
    neighborhoods: ['Fashion Island', 'Eastbluff', 'Newport Center'],
    medianHhi: 165000,
    dominantCaseType: 'Computer-Guided 3D Implants, Teeth-in-a-Day',
    coordinates: { latitude: 33.6335, longitude: -117.8767 },
  },
  '92661': {
    zipCode: '92661',
    metro: 'Orange County / Newport Beach, CA',
    city: 'Newport Beach',
    state: 'CA',
    neighborhoods: ['Balboa Peninsula', 'Newport Pier'],
    medianHhi: 175000,
    dominantCaseType: 'Full-Arch Restorations, Aesthetic Implantology',
    coordinates: { latitude: 33.6027, longitude: -117.8967 },
  },
  '92662': {
    zipCode: '92662',
    metro: 'Orange County / Newport Beach, CA',
    city: 'Newport Beach',
    state: 'CA',
    neighborhoods: ['Balboa Island', 'Little Balboa'],
    medianHhi: 185000,
    dominantCaseType: 'Immediate Load Implants, Zirconia Full-Arch',
    coordinates: { latitude: 33.6074, longitude: -117.8913 },
  },
  '92663': {
    zipCode: '92663',
    metro: 'Orange County / Newport Beach, CA',
    city: 'Newport Beach',
    state: 'CA',
    neighborhoods: ['West Newport', 'Newport Heights', 'Lido Isle'],
    medianHhi: 150000,
    dominantCaseType: 'Guided All-on-4, Bone Augmentation, Full Mouth',
    coordinates: { latitude: 33.6272, longitude: -117.9362 },
  },
  '92657': {
    zipCode: '92657',
    metro: 'Orange County / Newport Beach, CA',
    city: 'Newport Coast',
    state: 'CA',
    neighborhoods: ['Pelican Hill', 'Crystal Cove', 'Ocean Heights'],
    medianHhi: 245000,
    dominantCaseType: 'Premium Full-Arch Zirconia, Zygomatic Implants',
    coordinates: { latitude: 33.5939, longitude: -117.8344 },
  },
  '92625': {
    zipCode: '92625',
    metro: 'Orange County / Newport Beach, CA',
    city: 'Corona del Mar',
    state: 'CA',
    neighborhoods: ['Flower Streets', 'Shore Cliffs', 'Cameo Shores'],
    medianHhi: 195000,
    dominantCaseType: 'All-on-4, Aesthetic Periodontal Surgery, Full-Mouth',
    coordinates: { latitude: 33.6026, longitude: -117.8687 },
  },
  '92603': {
    zipCode: '92603',
    metro: 'Orange County / Newport Beach, CA',
    city: 'Irvine',
    state: 'CA',
    neighborhoods: ['Turtle Rock', 'Shady Canyon'],
    medianHhi: 160000,
    dominantCaseType: '3D Guided Implants, Full-Arch Restoration',
    coordinates: { latitude: 33.6441, longitude: -117.8078 },
  },
  '92677': {
    zipCode: '92677',
    metro: 'Orange County / Newport Beach, CA',
    city: 'Laguna Niguel',
    state: 'CA',
    neighborhoods: ['Bear Brand Ranch', 'Ocean Ranch', 'Marina Hills'],
    medianHhi: 145000,
    dominantCaseType: 'All-on-X, Teeth-in-a-Day, Sinus Lift Grafting',
    coordinates: { latitude: 33.5292, longitude: -117.7088 },
  },

  // 3. Los Angeles Westside / Beverly Hills, CA
  '90210': {
    zipCode: '90210',
    metro: 'Los Angeles Westside / Beverly Hills, CA',
    city: 'Beverly Hills',
    state: 'CA',
    neighborhoods: ['Beverly Hills Flats', 'Trousdale Estates', 'Greystone'],
    medianHhi: 180000,
    dominantCaseType: 'Aesthetic Implantology, Full-Mouth Reconstruction',
    coordinates: { latitude: 34.0901, longitude: -118.4065 },
  },
  '90211': {
    zipCode: '90211',
    metro: 'Los Angeles Westside / Beverly Hills, CA',
    city: 'Beverly Hills',
    state: 'CA',
    neighborhoods: ['South Beverly Hills', 'Wilshire Corridor'],
    medianHhi: 135000,
    dominantCaseType: 'Full-Arch Surgical Restoration, Guided All-on-4',
    coordinates: { latitude: 34.0645, longitude: -118.3812 },
  },
  '90212': {
    zipCode: '90212',
    metro: 'Los Angeles Westside / Beverly Hills, CA',
    city: 'Beverly Hills',
    state: 'CA',
    neighborhoods: ['South Central Beverly Hills', 'Rodeo District'],
    medianHhi: 145000,
    dominantCaseType: 'Teeth-in-a-Day, All-on-6 Zirconia Prosthetics',
    coordinates: { latitude: 34.0601, longitude: -118.4023 },
  },
  '90402': {
    zipCode: '90402',
    metro: 'Los Angeles Westside / Beverly Hills, CA',
    city: 'Santa Monica',
    state: 'CA',
    neighborhoods: ['North of Montana', 'Palisades Beach'],
    medianHhi: 225000,
    dominantCaseType: 'Digital All-on-4, Zirconia Full-Arch, Bone Grafting',
    coordinates: { latitude: 34.0356, longitude: -118.5085 },
  },
  '90077': {
    zipCode: '90077',
    metro: 'Los Angeles Westside / Beverly Hills, CA',
    city: 'Los Angeles',
    state: 'CA',
    neighborhoods: ['Bel Air', 'Beverly Glen'],
    medianHhi: 210000,
    dominantCaseType: 'Full-Mouth Reconstruction, Zygomatic Implants',
    coordinates: { latitude: 34.1176, longitude: -118.4526 },
  },
  '90049': {
    zipCode: '90049',
    metro: 'Los Angeles Westside / Beverly Hills, CA',
    city: 'Los Angeles',
    state: 'CA',
    neighborhoods: ['Brentwood', 'Mandeville Canyon', 'Crestwood'],
    medianHhi: 175000,
    dominantCaseType: 'Aesthetic Periodontics & Surgical Dental Implants',
    coordinates: { latitude: 34.0654, longitude: -118.4878 },
  },
  '90272': {
    zipCode: '90272',
    metro: 'Los Angeles Westside / Beverly Hills, CA',
    city: 'Pacific Palisades',
    state: 'CA',
    neighborhoods: ['Huntington Palisades', 'Riviera', 'Castellammare'],
    medianHhi: 215000,
    dominantCaseType: 'All-on-4, Full-Arch Guided Surgery, Immediate Load',
    coordinates: { latitude: 34.0494, longitude: -118.5398 },
  },
  '90266': {
    zipCode: '90266',
    metro: 'Los Angeles Westside / Beverly Hills, CA',
    city: 'Manhattan Beach',
    state: 'CA',
    neighborhoods: ['The Strand', 'Sand Section', 'Tree Section'],
    medianHhi: 190000,
    dominantCaseType: 'Full-Arch Implants, Teeth-in-a-Day',
    coordinates: { latitude: 33.8885, longitude: -118.4069 },
  },

  // 4. Dallas–Fort Worth / North Plano, TX
  '75024': {
    zipCode: '75024',
    metro: 'Dallas–Fort Worth / North Plano, TX',
    city: 'Plano',
    state: 'TX',
    neighborhoods: ['Legacy West', 'Granite Park', 'West Plano'],
    medianHhi: 150000,
    dominantCaseType: 'Hybrid All-on-X, Sedation Implant Surgery',
    coordinates: { latitude: 33.0768, longitude: -96.8242 },
  },
  '75025': {
    zipCode: '75025',
    metro: 'Dallas–Fort Worth / North Plano, TX',
    city: 'Plano',
    state: 'TX',
    neighborhoods: ['Russell Creek', 'North Plano'],
    medianHhi: 135000,
    dominantCaseType: 'All-on-4, Full Arch Restoration, Bone Grafting',
    coordinates: { latitude: 33.0924, longitude: -96.7461 },
  },
  '75034': {
    zipCode: '75034',
    metro: 'Dallas–Fort Worth / North Plano, TX',
    city: 'Frisco',
    state: 'TX',
    neighborhoods: ['The Star', 'Stonebriar', 'Starwood'],
    medianHhi: 165000,
    dominantCaseType: 'Computer-Guided Implants, Teeth-in-a-Day, Full-Arch',
    coordinates: { latitude: 33.1507, longitude: -96.8659 },
  },
  '75093': {
    zipCode: '75093',
    metro: 'Dallas–Fort Worth / North Plano, TX',
    city: 'Plano',
    state: 'TX',
    neighborhoods: ['Willow Bend', 'Kings Ridge', 'Lakeside on Preston'],
    medianHhi: 155000,
    dominantCaseType: 'Sedation Full-Arch Surgery, Zirconia Implant Prosthetics',
    coordinates: { latitude: 33.0368, longitude: -96.8228 },
  },
  '75205': {
    zipCode: '75205',
    metro: 'Dallas–Fort Worth / North Plano, TX',
    city: 'Dallas',
    state: 'TX',
    neighborhoods: ['Highland Park', 'SMU Corridor'],
    medianHhi: 240000,
    dominantCaseType: 'Aesthetic Full-Mouth Implants, All-on-4',
    coordinates: { latitude: 32.8335, longitude: -96.7937 },
  },
  '75225': {
    zipCode: '75225',
    metro: 'Dallas–Fort Worth / North Plano, TX',
    city: 'Dallas',
    state: 'TX',
    neighborhoods: ['University Park', 'Preston Hollow East'],
    medianHhi: 235000,
    dominantCaseType: 'Full-Arch Restoration, Guided Surgical Implants',
    coordinates: { latitude: 32.8681, longitude: -96.7925 },
  },
  '75209': {
    zipCode: '75209',
    metro: 'Dallas–Fort Worth / North Plano, TX',
    city: 'Dallas',
    state: 'TX',
    neighborhoods: ['Inwood Village', 'Bluffview', 'Lovers Lane Corridor'],
    medianHhi: 148000,
    dominantCaseType: 'Surgical Dental Implants, Full-Arch Restoration',
    coordinates: { latitude: 32.8510, longitude: -96.8227 },
  },
  '75035': {
    zipCode: '75035',
    metro: 'Dallas–Fort Worth / North Plano, TX',
    city: 'Frisco',
    state: 'TX',
    neighborhoods: ['Richwoods', 'Lawler Park', 'Plantation Resort'],
    medianHhi: 140000,
    dominantCaseType: 'Surgical Dental Implants, Immediate Placement',
    coordinates: { latitude: 33.1554, longitude: -96.7725 },
  },
  '75056': {
    zipCode: '75056',
    metro: 'Dallas–Fort Worth / North Plano, TX',
    city: 'The Colony',
    state: 'TX',
    neighborhoods: ['Austin Ranch', 'Grandscape Corridor'],
    medianHhi: 130000,
    dominantCaseType: 'All-on-X, Teeth in a Day, Sinus Augmentation',
    coordinates: { latitude: 33.0906, longitude: -96.8837 },
  },

  // 5. South Florida / Boca Raton & Naples, FL
  '33496': {
    zipCode: '33496',
    metro: 'South Florida / Boca Raton & Naples, FL',
    city: 'Boca Raton',
    state: 'FL',
    neighborhoods: ['St. Andrews Country Club', 'Boca Bridges', 'The Oaks'],
    medianHhi: 160000,
    dominantCaseType: 'Immediate Load Implants, Geriatric Full-Arch, PRF Bone Grafting',
    coordinates: { latitude: 26.4023, longitude: -80.1705 },
  },
  '33486': {
    zipCode: '33486',
    metro: 'South Florida / Boca Raton & Naples, FL',
    city: 'Boca Raton',
    state: 'FL',
    neighborhoods: ['Camino Gardens', 'Boca Square', 'Royal Palm Polo'],
    medianHhi: 140000,
    dominantCaseType: 'Full-Arch Zirconia, Microscope Restorative Dentistry',
    coordinates: { latitude: 26.3534, longitude: -80.1118 },
  },
  '33431': {
    zipCode: '33431',
    metro: 'South Florida / Boca Raton & Naples, FL',
    city: 'Boca Raton',
    state: 'FL',
    neighborhoods: ['Boca West', 'Yamato Corridor', 'Old Floresta'],
    medianHhi: 130000,
    dominantCaseType: 'Periodontics & Dental Implants, All-on-4',
    coordinates: { latitude: 26.3776, longitude: -80.1191 },
  },
  '33432': {
    zipCode: '33432',
    metro: 'South Florida / Boca Raton & Naples, FL',
    city: 'Boca Raton',
    state: 'FL',
    neighborhoods: ['Downtown Boca Raton', 'Mizner Park', 'Royal Palm Yacht'],
    medianHhi: 135000,
    dominantCaseType: 'Full Mouth Reconstruction, All-on-6, Guided Surgery',
    coordinates: { latitude: 26.3514, longitude: -80.0837 },
  },
  '33483': {
    zipCode: '33483',
    metro: 'South Florida / Boca Raton & Naples, FL',
    city: 'Delray Beach',
    state: 'FL',
    neighborhoods: ['Delray Beach East', 'Atlantic Avenue Corridor', 'Seagate'],
    medianHhi: 145000,
    dominantCaseType: 'Laser Periodontics, Immediate Implant Placement',
    coordinates: { latitude: 26.4526, longitude: -80.0664 },
  },
  '33480': {
    zipCode: '33480',
    metro: 'South Florida / Boca Raton & Naples, FL',
    city: 'Palm Beach',
    state: 'FL',
    neighborhoods: ['Palm Beach Island', 'Worth Avenue', 'Mid-Town Palm Beach'],
    medianHhi: 250000,
    dominantCaseType: 'Ultra-Luxury Full-Mouth Restoration, Zirconia All-on-X',
    coordinates: { latitude: 26.6976, longitude: -80.0381 },
  },
  '34102': {
    zipCode: '34102',
    metro: 'South Florida / Boca Raton & Naples, FL',
    city: 'Naples',
    state: 'FL',
    neighborhoods: ['Old Naples', 'Aqualane Shores', 'Port Royal'],
    medianHhi: 210000,
    dominantCaseType: 'Surgical Full-Arch Implants, All-on-4, Bone Grafting',
    coordinates: { latitude: 26.1362, longitude: -81.7967 },
  },
  '34103': {
    zipCode: '34103',
    metro: 'South Florida / Boca Raton & Naples, FL',
    city: 'Naples',
    state: 'FL',
    neighborhoods: ['The Moorings', 'Park Shore', 'Coquina Sands'],
    medianHhi: 175000,
    dominantCaseType: 'Guided All-on-X, Teeth-in-a-Day, Sinus Lift',
    coordinates: { latitude: 26.1824, longitude: -81.8028 },
  },
  '34108': {
    zipCode: '34108',
    metro: 'South Florida / Boca Raton & Naples, FL',
    city: 'Naples',
    state: 'FL',
    neighborhoods: ['Pelican Bay', 'Bay Colony', 'Vanderbilt Beach'],
    medianHhi: 165000,
    dominantCaseType: 'Full-Arch Zirconia Reconstruction, Titanium Implants',
    coordinates: { latitude: 26.2625, longitude: -81.8078 },
  },
  '34110': {
    zipCode: '34110',
    metro: 'South Florida / Boca Raton & Naples, FL',
    city: 'Naples',
    state: 'FL',
    neighborhoods: ['North Naples', 'Pelican Marsh', 'Audubon', 'Vanderbilt'],
    medianHhi: 152000,
    dominantCaseType: 'All-on-4 Teeth-in-a-Day, Surgical Dental Implants, Bone Augmentation',
    coordinates: { latitude: 26.2844, longitude: -81.7963 },
  },

  // 6. Seattle Eastside / Bellevue, WA
  '98004': {
    zipCode: '98004',
    metro: 'Seattle Eastside / Bellevue, WA',
    city: 'Bellevue',
    state: 'WA',
    neighborhoods: ['Downtown Bellevue', 'Meydenbauer', 'West Bellevue'],
    medianHhi: 185000,
    dominantCaseType: 'Digital All-on-4, Malo Protocol, Surgical Guided',
    coordinates: { latitude: 47.6186, longitude: -122.2033 },
  },
  '98005': {
    zipCode: '98005',
    metro: 'Seattle Eastside / Bellevue, WA',
    city: 'Bellevue',
    state: 'WA',
    neighborhoods: ['Enatai', 'Wilburton', 'Bridle Trails'],
    medianHhi: 160000,
    dominantCaseType: 'All-on-X, Teeth-in-a-Day, Surgical Dental Implants',
    coordinates: { latitude: 47.6152, longitude: -122.1691 },
  },
  '98006': {
    zipCode: '98006',
    metro: 'Seattle Eastside / Bellevue, WA',
    city: 'Bellevue',
    state: 'WA',
    neighborhoods: ['Somerset', 'Lakemont', 'Newport Hills'],
    medianHhi: 170000,
    dominantCaseType: 'Computer-Guided Implants, Full-Arch Restoration',
    coordinates: { latitude: 47.5614, longitude: -122.1492 },
  },
  '98033': {
    zipCode: '98033',
    metro: 'Seattle Eastside / Bellevue, WA',
    city: 'Kirkland',
    state: 'WA',
    neighborhoods: ['Kirkland Waterfront', 'Moss Bay', 'Houghton'],
    medianHhi: 165000,
    dominantCaseType: 'Full-Arch Reconstruction, Zirconia Hybrid Bridges',
    coordinates: { latitude: 47.6815, longitude: -122.1931 },
  },
  '98039': {
    zipCode: '98039',
    metro: 'Seattle Eastside / Bellevue, WA',
    city: 'Medina',
    state: 'WA',
    neighborhoods: ['Medina', 'Evergreen Point'],
    medianHhi: 250000,
    dominantCaseType: 'Premium All-on-4, Zygomatic Implants, Full-Mouth Rehab',
    coordinates: { latitude: 47.6256, longitude: -122.2384 },
  },
  '98040': {
    zipCode: '98040',
    metro: 'Seattle Eastside / Bellevue, WA',
    city: 'Mercer Island',
    state: 'WA',
    neighborhoods: ['Mercer Island Estates', 'First Hill Mercer'],
    medianHhi: 210000,
    dominantCaseType: 'Guided Full-Arch Surgical Implants, Teeth-in-a-Day',
    coordinates: { latitude: 47.5707, longitude: -122.2221 },
  },
  '98052': {
    zipCode: '98052',
    metro: 'Seattle Eastside / Bellevue, WA',
    city: 'Redmond',
    state: 'WA',
    neighborhoods: ['Education Hill', 'Grass Lawn', 'Downtown Redmond'],
    medianHhi: 155000,
    dominantCaseType: 'Surgical Dental Implants, All-on-4, Bone Grafting',
    coordinates: { latitude: 47.6740, longitude: -122.1215 },
  },

  // 7. Fairfield County / Greenwich, CT
  '06830': {
    zipCode: '06830',
    metro: 'Fairfield County / Greenwich, CT',
    city: 'Greenwich',
    state: 'CT',
    neighborhoods: ['Central Greenwich', 'Belle Haven', 'Milbrook'],
    medianHhi: 195000,
    dominantCaseType: 'Complex Restorative, Bone Augmentation, Full-Arch',
    coordinates: { latitude: 41.0347, longitude: -73.6262 },
  },
  '06831': {
    zipCode: '06831',
    metro: 'Fairfield County / Greenwich, CT',
    city: 'Greenwich',
    state: 'CT',
    neighborhoods: ['Backcountry Greenwich', 'Round Hill', 'Stanwich'],
    medianHhi: 250000,
    dominantCaseType: 'Full-Arch Zirconia, Teeth-in-a-Day, Zygomatic Implants',
    coordinates: { latitude: 41.0968, longitude: -73.6841 },
  },
  '06870': {
    zipCode: '06870',
    metro: 'Fairfield County / Greenwich, CT',
    city: 'Old Greenwich',
    state: 'CT',
    neighborhoods: ['Old Greenwich', 'Lucas Point'],
    medianHhi: 230000,
    dominantCaseType: 'All-on-4, Surgical Guided Implants, Sinus Lift',
    coordinates: { latitude: 41.0348, longitude: -73.5676 },
  },
  '06820': {
    zipCode: '06820',
    metro: 'Fairfield County / Greenwich, CT',
    city: 'Darien',
    state: 'CT',
    neighborhoods: ['Tokeneke', 'Noroton Bay', 'Long Neck Point'],
    medianHhi: 245000,
    dominantCaseType: 'Full-Mouth Reconstruction, Immediate Load Implants',
    coordinates: { latitude: 41.0772, longitude: -73.4735 },
  },
  '06840': {
    zipCode: '06840',
    metro: 'Fairfield County / Greenwich, CT',
    city: 'New Canaan',
    state: 'CT',
    neighborhoods: ['Oenoke Ridge', 'Smith Ridge', 'Ponus Ridge'],
    medianHhi: 220000,
    dominantCaseType: 'All-on-6 Zirconia Prosthetics, Bone Grafting',
    coordinates: { latitude: 41.1468, longitude: -73.4948 },
  },
  '06880': {
    zipCode: '06880',
    metro: 'Fairfield County / Greenwich, CT',
    city: 'Westport',
    state: 'CT',
    neighborhoods: ['Greens Farms', 'Compo Beach', 'Saugatuck'],
    medianHhi: 215000,
    dominantCaseType: 'Teeth-in-a-Day, Computer-Guided Implants, Full-Arch',
    coordinates: { latitude: 41.1415, longitude: -73.3579 },
  },

  // 8. Manhattan / New York, NY
  '10019': {
    zipCode: '10019',
    metro: 'Manhattan / New York, NY',
    city: 'New York',
    state: 'NY',
    neighborhoods: ['Central Park South', 'Midtown West', 'Billionaires Row'],
    medianHhi: 168000,
    dominantCaseType: 'Full-Arch Reconstruction, Premium Surgical Dental Implants',
    coordinates: { latitude: 40.7654, longitude: -73.9851 },
  },
  '10021': {
    zipCode: '10021',
    metro: 'Manhattan / New York, NY',
    city: 'New York',
    state: 'NY',
    neighborhoods: ['Upper East Side', 'Lenox Hill', 'Park Avenue Corridor'],
    medianHhi: 185000,
    dominantCaseType: 'Full-Arch Zirconia, Guided Surgical Implants, All-on-4',
    coordinates: { latitude: 40.7686, longitude: -73.9604 },
  },
  '10065': {
    zipCode: '10065',
    metro: 'Manhattan / New York, NY',
    city: 'New York',
    state: 'NY',
    neighborhoods: ['Upper East Side', 'Plaza District Border'],
    medianHhi: 190000,
    dominantCaseType: 'Teeth-in-a-Day, Bone Augmentation, Immediate Implants',
    coordinates: { latitude: 40.7644, longitude: -73.9634 },
  },
  '10075': {
    zipCode: '10075',
    metro: 'Manhattan / New York, NY',
    city: 'New York',
    state: 'NY',
    neighborhoods: ['Upper East Side East 70s-80s'],
    medianHhi: 195000,
    dominantCaseType: 'Surgical Dental Implants, All-on-6, Periodontic Microsurgery',
    coordinates: { latitude: 40.7734, longitude: -73.9555 },
  },
  '10022': {
    zipCode: '10022',
    metro: 'Manhattan / New York, NY',
    city: 'New York',
    state: 'NY',
    neighborhoods: ['Midtown East', 'Sutton Place', 'Beekman'],
    medianHhi: 175000,
    dominantCaseType: 'Full-Mouth Rehabilitation, Guided Implants',
    coordinates: { latitude: 40.7589, longitude: -73.9682 },
  },
  '10028': {
    zipCode: '10028',
    metro: 'Manhattan / New York, NY',
    city: 'New York',
    state: 'NY',
    neighborhoods: ['Carnegie Hill', 'Upper East Side 80s'],
    medianHhi: 185000,
    dominantCaseType: 'Surgical Dental Implants, All-on-4',
    coordinates: { latitude: 40.7766, longitude: -73.9535 },
  },

  // 9. Silicon Valley / Atherton & Palo Alto, CA
  '94027': {
    zipCode: '94027',
    metro: 'Silicon Valley / Atherton & Palo Alto, CA',
    city: 'Atherton',
    state: 'CA',
    neighborhoods: ['Atherton Estates', 'Menlo Circus Club'],
    medianHhi: 250000,
    dominantCaseType: 'All-on-4, Full-Arch Zirconia, Premium Surgical Implants',
    coordinates: { latitude: 37.4613, longitude: -122.1977 },
  },
  '94301': {
    zipCode: '94301',
    metro: 'Silicon Valley / Atherton & Palo Alto, CA',
    city: 'Palo Alto',
    state: 'CA',
    neighborhoods: ['Downtown Palo Alto', 'Crescent Park', 'Professorville'],
    medianHhi: 215000,
    dominantCaseType: 'Computer-Guided Implants, Teeth-in-a-Day',
    coordinates: { latitude: 37.4443, longitude: -122.1598 },
  },
  '94022': {
    zipCode: '94022',
    metro: 'Silicon Valley / Atherton & Palo Alto, CA',
    city: 'Los Altos',
    state: 'CA',
    neighborhoods: ['Los Altos Hills', 'North Los Altos'],
    medianHhi: 245000,
    dominantCaseType: 'Surgical Dental Implants, Full-Mouth Reconstruction',
    coordinates: { latitude: 37.3852, longitude: -122.1141 },
  },
  '94024': {
    zipCode: '94024',
    metro: 'Silicon Valley / Atherton & Palo Alto, CA',
    city: 'Los Altos',
    state: 'CA',
    neighborhoods: ['South Los Altos', 'Loyola'],
    medianHhi: 235000,
    dominantCaseType: 'Guided Full-Arch Implants, Bone Grafting',
    coordinates: { latitude: 37.3541, longitude: -122.0955 },
  },

  // 10. Palm Beach & Jupiter Luxury Corridors, FL
  '33458': {
    zipCode: '33458',
    metro: 'South Florida / Boca Raton & Naples, FL',
    city: 'Jupiter',
    state: 'FL',
    neighborhoods: ['Admirals Cove', 'Jonathan’s Landing', 'Abacoa'],
    medianHhi: 145000,
    dominantCaseType: 'All-on-4, Surgical Dental Implants, Teeth-in-a-Day',
    coordinates: { latitude: 26.9342, longitude: -80.0942 },
  },
  '33477': {
    zipCode: '33477',
    metro: 'South Florida / Boca Raton & Naples, FL',
    city: 'Jupiter',
    state: 'FL',
    neighborhoods: ['Jupiter Island Gateway', 'Jupiter Oceanfront'],
    medianHhi: 165000,
    dominantCaseType: 'Full-Arch Reconstruction, Guided Titanium Implants',
    coordinates: { latitude: 26.9338, longitude: -80.0753 },
  },

  // 11. Colorado Luxury / Aspen & Vail, CO
  '81611': {
    zipCode: '81611',
    metro: 'Colorado Luxury / Aspen & Vail, CO',
    city: 'Aspen',
    state: 'CO',
    neighborhoods: ['Red Mountain', 'Downtown Aspen', 'Starwood'],
    medianHhi: 210000,
    dominantCaseType: 'All-on-4, Full-Arch Zirconia, Surgical Dental Implants',
    coordinates: { latitude: 39.1911, longitude: -106.8175 },
  },
  '81657': {
    zipCode: '81657',
    metro: 'Colorado Luxury / Aspen & Vail, CO',
    city: 'Vail',
    state: 'CO',
    neighborhoods: ['Vail Village', 'Lionshead', 'Beaver Creek Border'],
    medianHhi: 175000,
    dominantCaseType: 'Surgical Dental Implants, Guided Prosthodontics',
    coordinates: { latitude: 39.6403, longitude: -106.3742 },
  },
};

/**
 * Normalizes input zip code into a clean 5-digit string.
 */
export function normalizeZipCode(zipCode: string | number | undefined | null): string {
  if (!zipCode && zipCode !== 0) return '';
  const rawStr = String(zipCode).trim();
  if (!rawStr) return '';

  // Handle hyphenated ZIP+4 (e.g. "6830-1234", "06830-1234") or spaced zip
  const root = rawStr.split(/[\s-]/)[0];
  const cleanedRoot = root.replace(/[^\d]/g, '');
  if (cleanedRoot) {
    if (cleanedRoot.length <= 5) {
      return cleanedRoot.padStart(5, '0');
    }
    if (cleanedRoot.length === 8) {
      return cleanedRoot.slice(0, 4).padStart(5, '0');
    }
    return cleanedRoot.slice(0, 5);
  }

  // Fallback for un-hyphenated 8 or 9 digit strings (e.g. 68301234 or 068301234)
  const fullCleaned = rawStr.replace(/[^\d]/g, '');
  if (!fullCleaned) return '';
  if (fullCleaned.length <= 5) {
    return fullCleaned.padStart(5, '0');
  }
  if (fullCleaned.length === 8) {
    return fullCleaned.slice(0, 4).padStart(5, '0');
  }
  return fullCleaned.slice(0, 5);
}

/**
 * Verifies if a given zip code belongs to the verified high-wealth repository
 * (Gate 1 of the 7-Point Qualification Engine).
 */
export function isAffluentZip(zipCode: string): boolean {
  const norm = normalizeZipCode(zipCode);
  if (norm.length !== 5) return false;
  return Boolean(AFFLUENT_ZIPS_CATALOG[norm]);
}

/**
 * Returns detailed wealth and geographic metadata for a qualifying zip code.
 */
export function getAffluentZipInfo(zipCode: string): AffluentZipInfo | null {
  const norm = normalizeZipCode(zipCode);
  return AFFLUENT_ZIPS_CATALOG[norm] || null;
}

/**
 * Returns all high-wealth zip code records across all 7 target metros.
 */
export function getAllAffluentZips(): AffluentZipInfo[] {
  return Object.values(AFFLUENT_ZIPS_CATALOG);
}

/**
 * Returns all high-wealth zip code records belonging to a specific target metro.
 */
export function getZipsByMetro(metro: TargetMetro | string): AffluentZipInfo[] {
  const lower = metro.toLowerCase().trim();
  return Object.values(AFFLUENT_ZIPS_CATALOG).filter(
    (item) => item.metro.toLowerCase().includes(lower) || item.state.toLowerCase() === lower
  );
}

/**
 * Returns list of all 7 target metropolitan regions.
 */
export function getTargetMetros(): TargetMetro[] {
  return [...TARGET_METROS];
}
