// One place for every fact on the site. Edit here, the whole site follows.

export const site = {
  name: 'Supreme AutoSpa',
  url: 'https://supreme-autospa.com',
  tagline:
    'Premium car care in style, where top-notch detailing meets an aesthetic, relaxing ambiance.',
  phone: '0997 931 3517',
  phoneTel: '+639979313517',
  phoneSms: '+639979313517',
  email: 'supreme.autospa2026@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=61584838823186',
  messenger: 'https://m.me/61584838823186',
  address: {
    street: 'Roque Menor St',
    city: 'Cauayan City',
    region: 'Isabela',
    postal: '3305',
    country: 'PH',
  },
  geo: { lat: 16.939934, lng: 121.7565333 },
  mapsUrl:
    'https://www.google.com/maps/place/SUPREME.+AUTOSPA/@16.939934,121.7565333,17z/data=!3m1!4b1!4m6!3m5!1s0x338551d9b96bb8e5:0xd7601b83f4de132b!8m2!3d16.939934!4d121.7565333!16s%2Fg%2F11ywn5thvv?hl=en-US',
  mapsEmbed: 'https://www.google.com/maps?q=16.939934,121.7565333&z=17&output=embed',
  // Open every day, Philippine time.
  hours: { opens: 6, closes: 19, label: '6:00 AM – 7:00 PM', days: 'every day' },
};

// Website credit shown in the footer. Leave name empty to hide it.
export const credit = {
  name: '',
  url: '',
};

export type Service = { id: string; name: string; text: string };
export type ServiceGroup = {
  slug: string;
  title: string;
  short: string;
  lead: string;
  items: Service[];
};

export const groups: ServiceGroup[] = [
  {
    slug: 'car-wash',
    title: 'Wash',
    short: 'Car wash',
    lead: 'Any vehicle, any make. Bring it in dusty, muddy or just overdue.',
    items: [
      { id: 'carwash', name: 'Carwash', text: 'A full exterior wash for cars, SUVs, pickups and motorcycles.' },
      { id: 'engine-wash', name: 'Engine wash', text: 'Cleans grease and dust from the engine bay.' },
      { id: 'undercarriage', name: 'Undercarriage rinsing', text: 'Rinses mud and road grime from underneath the vehicle.' },
    ],
  },
  {
    slug: 'detailing',
    title: 'Detail',
    short: 'Detailing',
    lead: 'Interior and exterior detailing, plus the small fixes that make an older car look cared for again.',
    items: [
      { id: 'interior', name: 'Interior detailing', text: 'Deep cleaning of seats, carpets, panels and glass inside the cabin.' },
      { id: 'exterior', name: 'Exterior detailing', text: 'Paint-focused cleaning and finishing on the outside.' },
      { id: 'headlight', name: 'Headlight restoration', text: 'Clears cloudy, yellowed headlight lenses.' },
      { id: 'asphalt', name: 'Asphalt removal', text: 'Lifts road tar and asphalt spots from the paint.' },
      { id: 'acid-rain', name: 'Acid rain removal', text: 'Treats acid rain water spots on paint and glass.' },
      { id: 'stickers', name: 'Sticker and emblem removal', text: 'Takes off old stickers, decals and emblems cleanly.' },
      { id: 'back-to-zero', name: 'Back to Zero', text: 'Restores the car to its brand-new state.' },
      { id: 'seat-covers', name: 'Seat cover installation', text: 'Fitted seat covers for a clean, finished interior.' },
    ],
  },
  {
    slug: 'repainting',
    title: 'Protect and repaint',
    short: 'Coatings and repainting',
    lead: 'Protective coatings, scheduled maintenance and full body repainting. These jobs are priced per vehicle, so ask for a quote first.',
    items: [
      { id: 'ceramic', name: 'Ceramic coating', text: 'A protective coating that adds gloss and makes washing easier.' },
      { id: 'graphene', name: 'Graphene coating', text: 'A graphene-based protective coating for gloss and easier cleaning.' },
      { id: 'pms', name: 'PMS', text: 'Preventive maintenance service, to keep your vehicle running right.' },
      { id: 'repaint', name: 'Car repainting', text: 'Full body or panel repaint. Send photos with your quote request.' },
    ],
  },
];

export const allServices: Service[] = groups.flatMap((g) => g.items);

export const vehicleTypes = [
  'Sedan or hatchback',
  'SUV or MPV',
  'Pickup or van',
  'Motorcycle',
  'Tractor or other',
];

export type Photo = {
  file: string;
  w: number;
  h: number;
  alt: string;
  caption: string;
  tags: string[];
};

// Real photos supplied by the shop. Captions only say what is visible.
export const photos: Record<string, Photo> = {
  'fortuner-trd-side': { file: 'fortuner-trd-side', w: 1600, h: 1200, alt: 'White Toyota Fortuner TRD parked in the wash bay under the hex-light ceiling', caption: 'Toyota Fortuner TRD', tags: ['suv', 'bay'] },
  'fortuner-trd-front': { file: 'fortuner-trd-front', w: 1600, h: 1200, alt: 'Front of a white Toyota Fortuner TRD with the hex lights reflected on the hood', caption: 'Fortuner TRD, hex lights on the hood', tags: ['suv', 'bay'] },
  'fortuner-stone-ramp': { file: 'fortuner-stone-ramp', w: 590, h: 443, alt: 'White Fortuner on the stone display ramp beside the shop', caption: 'Fortuner on the stone ramp', tags: ['suv', 'shop'] },
  'shop-evening': { file: 'shop-evening', w: 1600, h: 1200, alt: 'Supreme AutoSpa at dusk with warm lights, the sign and cars in the bays', caption: 'The shop at dusk', tags: ['shop'] },
  'adv-motorcycle-hex-bay': { file: 'adv-motorcycle-hex-bay', w: 1536, h: 2048, alt: 'Adventure scooter parked in front of an SUV under the hex ceiling lights', caption: 'Adventure scooter in the bay', tags: ['bike', 'bay'] },
  'bmw-4-series': { file: 'bmw-4-series', w: 1600, h: 1200, alt: 'Dark grey BMW coupe parked in the wash bay', caption: 'BMW coupe', tags: ['car', 'bay'] },
  'hilux-ramp-wide': { file: 'hilux-ramp-wide', w: 1600, h: 739, alt: 'White Toyota Hilux raised on the stone wash ramp', caption: 'Toyota Hilux on the wash ramp', tags: ['pickup', 'shop'] },
  'sign-three-suvs': { file: 'sign-three-suvs', w: 896, h: 983, alt: 'Three SUVs parked under the Supreme AutoSpa sign and hex lights', caption: 'Three SUVs under the sign', tags: ['suv', 'shop'] },
  'shop-entrance-side': { file: 'shop-entrance-side', w: 1600, h: 739, alt: 'Side view of the shop entrance with timber and dark cladding, cars waiting along the drive', caption: 'The shop entrance', tags: ['shop'] },
  'hilux-undercarriage-ramp': { file: 'hilux-undercarriage-ramp', w: 1534, h: 2048, alt: 'Rear of a white Toyota Hilux on the ramp used for undercarriage rinsing', caption: 'Hilux on the undercarriage ramp', tags: ['pickup', 'bay'] },
  'engine-wash-hood': { file: 'engine-wash-hood', w: 1600, h: 1200, alt: 'Glossy black hood reflecting the hex ceiling, with a Hilux engine bay open behind', caption: 'Gloss finish, engine bay open behind', tags: ['pickup', 'bay'] },
  'jeep-wrangler': { file: 'jeep-wrangler', w: 1600, h: 1200, alt: 'White Jeep Wrangler Unlimited parked under the copper roof', caption: 'Jeep Wrangler', tags: ['suv', 'bay'] },
  'classic-4x4-wash': { file: 'classic-4x4-wash', w: 1600, h: 1200, alt: 'Blue vintage 4x4 being washed in the bay', caption: 'Vintage 4x4', tags: ['suv', 'bay'] },
  'sign-vintage-4x4': { file: 'sign-vintage-4x4', w: 1600, h: 1200, alt: 'Supreme AutoSpa sign above the bays, a vintage 4x4 and a Hilux being worked on', caption: 'Under the sign', tags: ['shop', 'pickup'] },
};

photos['shop-exterior'] = { file: 'shop-exterior', w: 1800, h: 1350, alt: 'The Supreme AutoSpa building: copper roofs over open bays, dark cladding, bamboo and volcanic stone', caption: 'The shop', tags: ['shop'] };

export const galleryOrder = [
  'sign-vintage-4x4',
  'bmw-4-series',
  'fortuner-trd-side',
  'adv-motorcycle-hex-bay',
  'jeep-wrangler',
  'shop-evening',
  'hilux-undercarriage-ramp',
  'fortuner-trd-front',
  'classic-4x4-wash',
  'engine-wash-hood',
  'sign-three-suvs',
  'hilux-ramp-wide',
  'shop-entrance-side',
  'fortuner-stone-ramp',
];

export const reviews = [
  { file: 'review-rented-car', w: 720, h: 933, alt: 'Five-star Google review: "Supreme car wash provides quick yet excellent service. Our rented car looked as good as new after the wash, and it smelled fresh and clean." with the owner\'s reply', label: 'Google review' },
  { file: 'review-yellow-vios', w: 720, h: 951, alt: 'Five-star Google review with a photo of a yellow sedan after its wash, and the owner\'s thank-you reply', label: 'Google review with photo' },
  { file: 'review-messenger-foam', w: 720, h: 1265, alt: 'Messenger message: "Finally found a go-to spot for a quality wash! Huge thanks Supreme Auto Spa for delivering the perfect combo: meticulous attention to detail and a staff that is genuinely kind and hands-on."', label: 'Messenger message' },
  { file: 'review-motorcycle', w: 720, h: 1117, alt: 'Five-star Google review of a motorcycle wash: "Perfect 5, even a motorcycle is a pet! Thank you! Recommended!"', label: 'Google review, motorcycle' },
  { file: 'post-waiting-area', w: 526, h: 815, alt: 'Facebook post from a customer showing the shop sign, the waiting area and cars in the bay: "Comfortable waiting area of SUPREME carwash"', label: 'Facebook post from a customer' },
];
