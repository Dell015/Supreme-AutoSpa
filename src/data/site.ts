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

export type Service = { id: string; name: string; text: string; benefit: string };
export type ServiceGroup = {
  slug: string;
  title: string;
  short: string;
  lead: string;
  items: Service[];
};

// DRAFT COPY: the 'text' and 'benefit' lines are written from the service names. Confirm them with the owner.
export const groups: ServiceGroup[] = [
  {
    slug: 'car-wash',
    title: 'Wash',
    short: 'Car wash',
    lead: 'Any vehicle, any make. Bring it in dusty, muddy or just overdue.',
    items: [
      { id: 'carwash', name: 'Carwash', text: 'A full exterior wash that removes dust, mud and road film from the body, wheels and glass. For cars, SUVs, pickups and motorcycles.', benefit: 'Your vehicle looks clean again, and regular washing keeps dirt and grime from wearing down the paint.' },
      { id: 'engine-wash', name: 'Engine wash', text: 'Cleans grease, dust and caked-on dirt from the engine bay.', benefit: 'A clean engine bay is easier to inspect, makes leaks and wear easier to spot, and keeps the vehicle looking cared for.' },
      { id: 'undercarriage', name: 'Undercarriage rinsing', text: 'Rinses mud, dirt and road grime from underneath the vehicle and the wheel wells.', benefit: 'Clears the mud that traps moisture against metal parts, which helps protect the underside from rust over time.' },
    ],
  },
  {
    slug: 'detailing',
    title: 'Detail',
    short: 'Detailing',
    lead: 'Interior and exterior detailing, plus the small fixes that make an older car look cared for again.',
    items: [
      { id: 'interior', name: 'Interior detailing', text: 'Deep cleaning of the seats, carpets, panels and glass inside the cabin.', benefit: 'A fresher, cleaner cabin to sit in, with less dust and dirt ground into the upholstery and carpets.' },
      { id: 'exterior', name: 'Exterior detailing', text: 'Paint-focused cleaning and finishing on the outside, going further than a standard wash.', benefit: 'Brings back depth and shine to the paint, so the whole vehicle looks sharper.' },
      { id: 'headlight', name: 'Headlight restoration', text: 'Clears cloudy, yellowed headlight lenses.', benefit: 'Clearer lenses let more light through for better night visibility, and the front of the vehicle looks newer.' },
      { id: 'asphalt', name: 'Asphalt removal', text: 'Lifts road tar and asphalt spots from the paint.', benefit: 'Removes stubborn black spots so they do not stay stuck to the paint and spoil the finish.' },
      { id: 'acid-rain', name: 'Acid rain removal', text: 'Treats the water spots left by acid rain on paint and glass.', benefit: 'Clears the dull marks left by dried rain so paint and glass look clean and clear again.' },
      { id: 'stickers', name: 'Sticker and emblem removal', text: 'Takes off old stickers, decals and emblems cleanly.', benefit: 'Lets you remove old branding or leftover adhesive with care for the paint underneath.' },
      { id: 'back-to-zero', name: 'Back to Zero', text: 'Restores the car to its brand-new state.', benefit: 'A full reset for a vehicle that has seen years of use. A good choice before selling, or when you simply want it to feel new again.' },
      { id: 'seat-covers', name: 'Seat cover installation', text: 'Fitted seat covers, installed for a clean, finished interior.', benefit: 'Protects the original seats from wear and stains, and gives the cabin a fresh look.' },
    ],
  },
  {
    slug: 'repainting',
    title: 'Protect and repaint',
    short: 'Coatings and repainting',
    lead: 'Protective coatings, scheduled maintenance and full body repainting. These jobs are priced per vehicle, so ask for a quote first.',
    items: [
      { id: 'ceramic', name: 'Ceramic coating', text: 'A protective ceramic coating applied to the paint.', benefit: 'Adds gloss, helps shield the paint from dirt and water spots, and makes washing easier.' },
      { id: 'graphene', name: 'Graphene coating', text: 'A graphene-based protective coating applied to the paint.', benefit: 'Adds a deep gloss and a protective layer that repels dirt and water, so the vehicle stays cleaner for longer.' },
      { id: 'pms', name: 'PMS', text: 'Preventive maintenance service, to keep your vehicle running right.', benefit: 'Catches small issues early and helps you avoid bigger repairs and breakdowns later.' },
      { id: 'repaint', name: 'Car repainting', text: 'Full body or panel repainting. Send photos with your quote request.', benefit: 'Restores faded, scratched or damaged paint and gives the vehicle a fresh, even finish.' },
    ],
  },
];

export const allServices: Service[] = groups.flatMap((g) => g.items);

export const vehicleTypes = [
  'Sedan',
  'Hatchback',
  'SUV',
  'MPV or van',
  'Pickup',
  'Motorcycle or scooter',
  'Truck',
  'Tractor or heavy equipment',
  'Other',
];

export type Photo = {
  file: string;
  w: number;
  h: number;
  alt: string;
  caption: string;
  tags: string[];
  // true = stock/sample photo, not taken at the shop. Replace with a real one and remove the flag.
  sample?: boolean;
};

// Real photos supplied by the shop. Captions only say what is visible.
export const photos: Record<string, Photo> = {
  'fortuner-trd-side': { file: 'fortuner-trd-side', w: 1600, h: 1200, alt: 'White Toyota Fortuner TRD parked in the wash bay under the hex-light ceiling', caption: 'Toyota Fortuner TRD', tags: ['suv', 'bay'] },
  'fortuner-trd-front': { file: 'fortuner-trd-front', w: 1600, h: 1200, alt: 'Front of a white Toyota Fortuner TRD with the hex lights reflected on the hood', caption: 'Fortuner TRD, hex lights on the hood', tags: ['suv', 'bay'] },
  'fortuner-stone-ramp': { file: 'fortuner-stone-ramp', w: 590, h: 443, alt: 'White Fortuner on the stone display ramp beside the shop', caption: 'Fortuner on the stone ramp', tags: ['suv', 'shop'] },
  'shop-evening': { file: 'shop-evening', w: 2400, h: 1800, alt: 'Supreme AutoSpa at dusk with warm lights, the sign and cars in the bays', caption: 'The shop at dusk', tags: ['shop'] },
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

// Photos added 3 Nov (supplied by the shop).
photos['dash-wash'] = { file: 'dash-wash', w: 1800, h: 1350, alt: 'A worker washing a removed dashboard in the bay while the car sits with its doors open', caption: 'Dashboard out and washed by hand', tags: ['detail', 'bay'] };
photos['interior-stripdown'] = { file: 'interior-stripdown', w: 1800, h: 1350, alt: 'Inside of an SUV stripped of its seats and carpet for a deep interior clean', caption: 'Full interior strip-down', tags: ['detail', 'suv'] };
photos['seats-out'] = { file: 'seats-out', w: 1800, h: 1350, alt: 'Two workers cleaning seats that were taken out of an SUV, parked under the copper roof', caption: 'Seats out, cleaned one by one', tags: ['detail', 'suv', 'bay'] };
photos['engine-before'] = { file: 'engine-before', w: 1800, h: 1350, alt: 'Engine bay of a Toyota before washing, with dust and grime on the engine and hoses', caption: 'Engine bay before', tags: ['detail'] };
photos['engine-after'] = { file: 'engine-after', w: 1800, h: 1350, alt: 'The same engine bay after washing, clean and dark with the parts clearly visible', caption: 'Engine bay after', tags: ['detail'] };
photos['mustang-door'] = { file: 'mustang-door', w: 1350, h: 1800, alt: 'Red sports coupe with white stripes parked under the hex lights, driver door open', caption: 'Red coupe under the hex lights', tags: ['car', 'bay'] };
photos['mustang-hex'] = { file: 'mustang-hex', w: 1800, h: 1350, alt: 'Side view of a red sports coupe in the bay with the hex ceiling lights above', caption: 'Red coupe, side view', tags: ['car', 'bay'] };
photos['trucks-hex-bay'] = { file: 'trucks-hex-bay', w: 1800, h: 1350, alt: 'Two lifted trucks with bull bars parked side by side under the hex lights', caption: 'Lifted trucks in the bay', tags: ['pickup', 'suv', 'bay'] };

// SAMPLE PHOTOS: placeholders until the shop has its own. They are labelled on the page.
photos['sample-interior'] = { file: 'sample-interior', w: 1400, h: 1750, alt: 'Sample photo: interior of a blue sedan with black leather seats after detailing', caption: 'Interior detailing', tags: [], sample: true };
photos['sample-engine-bay'] = { file: 'sample-engine-bay', w: 627, h: 1114, alt: 'Sample photo: a clean engine bay under an open hood', caption: 'Engine wash', tags: [], sample: true };
photos['sample-polishing'] = { file: 'sample-polishing', w: 687, h: 1031, alt: 'Sample photo: a polishing machine buffing the paint of a white car', caption: 'Polishing', tags: [], sample: true };

photos['wheel-loader'] = { file: 'wheel-loader', w: 488, h: 732, alt: 'Yellow SDLG wheel loader with two men on it, being washed outdoors under a blue sky', caption: 'SDLG wheel loader', tags: ['other'] };

export const galleryOrder = [
  'mustang-hex',
  'trucks-hex-bay',
  'interior-stripdown',
  'engine-after',
  'mustang-door',
  'seats-out',
  'dash-wash',
  'engine-before',
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
  'wheel-loader',
];

export const reviews = [
  { file: 'review-rented-car', w: 720, h: 933, alt: 'Five-star Google review: "Supreme car wash provides quick yet excellent service. Our rented car looked as good as new after the wash, and it smelled fresh and clean." with the owner\'s reply', label: 'Google review' },
  { file: 'review-yellow-vios', w: 720, h: 951, alt: 'Five-star Google review with a photo of a yellow sedan after its wash, and the owner\'s thank-you reply', label: 'Google review with photo' },
  { file: 'review-messenger-foam', w: 720, h: 1265, alt: 'Messenger message: "Finally found a go-to spot for a quality wash! Huge thanks Supreme Auto Spa for delivering the perfect combo: meticulous attention to detail and a staff that is genuinely kind and hands-on."', label: 'Messenger message' },
  { file: 'review-motorcycle', w: 720, h: 1117, alt: 'Five-star Google review of a motorcycle wash: "Perfect 5, even a motorcycle is a pet! Thank you! Recommended!"', label: 'Google review, motorcycle' },
  { file: 'post-waiting-area', w: 526, h: 815, alt: 'Facebook post from a customer showing the shop sign, the waiting area and cars in the bay: "Comfortable waiting area of SUPREME carwash"', label: 'Facebook post from a customer' },
];
