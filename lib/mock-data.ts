// Centralized realistic mock data for Airests POS mockups.
// Keeping this in one place ensures names, prices, and staff stay
// consistent across every surface (POS / KDS / Admin / Customer Web).

export type ConnectivityState = 'online' | 'offline' | 'syncing'

export const brand = {
  tenantName: 'Riverside Hospitality Group',
  locations: [
    {
      id: 'loc-1',
      name: 'Riverside Grill — Downtown',
      city: 'Austin, TX',
      address: '412 Colorado St, Austin, TX 78701',
      manager: 'Elena Cruz',
      phone: '(512) 555-0142',
      staffCount: 24,
      salesToday: 8412.5,
      orders: 214,
      connectivity: 'online' as ConnectivityState,
    },
    {
      id: 'loc-2',
      name: 'Riverside Grill — Riverside',
      city: 'Austin, TX',
      address: '2200 Riverside Dr, Austin, TX 78741',
      manager: 'Marcus Webb',
      phone: '(512) 555-0187',
      staffCount: 19,
      salesToday: 6205.75,
      orders: 168,
      connectivity: 'online' as ConnectivityState,
    },
    {
      id: 'loc-3',
      name: 'Riverside Grill — Domain',
      city: 'Austin, TX',
      address: '11701 Domain Blvd, Austin, TX 78758',
      manager: 'Sofia Bianchi',
      phone: '(512) 555-0119',
      staffCount: 17,
      salesToday: 3980.2,
      orders: 121,
      connectivity: 'syncing' as ConnectivityState,
    },
    {
      id: 'loc-4',
      name: 'Riverside Grill — South Congress',
      city: 'Austin, TX',
      address: '1500 S Congress Ave, Austin, TX 78704',
      manager: 'Derek Holt',
      phone: '(512) 555-0164',
      staffCount: 15,
      salesToday: 5310.0,
      orders: 149,
      connectivity: 'offline' as ConnectivityState,
    },
    {
      id: 'loc-5',
      name: 'Riverside Grill — Lakeline',
      city: 'Cedar Park, TX',
      address: '13343 Lakeline Blvd, Cedar Park, TX 78717',
      manager: 'Grace Malone',
      phone: '(512) 555-0198',
      staffCount: 13,
      salesToday: 4125.4,
      orders: 103,
      connectivity: 'online' as ConnectivityState,
    },
  ],
  registerName: 'Register 2',
  activeLocation: 'Riverside Grill — Downtown, Austin TX',
}

export const staff = [
  { id: 'st-1', name: 'Maria Alvarez', initials: 'MA', role: 'Server', pin: '1943', status: 'Clocked In', lastClockIn: 'Today, 10:58 AM', location: 'Downtown' },
  { id: 'st-2', name: 'Jordan Pierce', initials: 'JP', role: 'Server', pin: '2871', status: 'Clocked In', lastClockIn: 'Today, 11:12 AM', location: 'Downtown' },
  { id: 'st-3', name: 'Devon Shaw', initials: 'DS', role: 'Bartender', pin: '3305', status: 'Clocked In', lastClockIn: 'Today, 10:30 AM', location: 'Downtown' },
  { id: 'st-4', name: 'Priya Nair', initials: 'PN', role: 'Kitchen', pin: '4462', status: 'Clocked In', lastClockIn: 'Today, 9:45 AM', location: 'Downtown' },
  { id: 'st-5', name: 'Tomas Reyes', initials: 'TR', role: 'Shift Manager', pin: '5510', status: 'Clocked In', lastClockIn: 'Today, 9:00 AM', location: 'Downtown' },
  { id: 'st-6', name: 'Aisha Brooks', initials: 'AB', role: 'Server', pin: '6127', status: 'Clocked Out', lastClockIn: 'Yesterday, 6:40 PM', location: 'Riverside' },
  { id: 'st-7', name: 'Noah Kim', initials: 'NK', role: 'Kitchen', pin: '7734', status: 'Clocked In', lastClockIn: 'Today, 10:15 AM', location: 'Domain' },
  { id: 'st-8', name: 'Elena Cruz', initials: 'EC', role: 'General Manager', pin: '8890', status: 'Clocked In', lastClockIn: 'Today, 8:30 AM', location: 'Downtown' },
  { id: 'st-9', name: 'Marcus Webb', initials: 'MW', role: 'General Manager', pin: '9021', status: 'Clocked In', lastClockIn: 'Today, 8:15 AM', location: 'Riverside' },
  { id: 'st-10', name: 'Chloe Dawson', initials: 'CD', role: 'Server', pin: '1152', status: 'Clocked In', lastClockIn: 'Today, 11:30 AM', location: 'Downtown' },
  { id: 'st-11', name: 'Ryan Ostrowski', initials: 'RO', role: 'Bartender', pin: '2286', status: 'Clocked Out', lastClockIn: 'Yesterday, 11:05 PM', location: 'South Congress' },
  { id: 'st-12', name: 'Leah Fontaine', initials: 'LF', role: 'Host', pin: '3397', status: 'Clocked In', lastClockIn: 'Today, 10:50 AM', location: 'Downtown' },
  { id: 'st-13', name: 'Isaac Whitfield', initials: 'IW', role: 'Kitchen', pin: '4408', status: 'Clocked In', lastClockIn: 'Today, 9:20 AM', location: 'Riverside' },
  { id: 'st-14', name: 'Sofia Bianchi', initials: 'SB', role: 'General Manager', pin: '5519', status: 'Clocked In', lastClockIn: 'Today, 8:05 AM', location: 'Domain' },
  { id: 'st-15', name: 'Derek Holt', initials: 'DH', role: 'General Manager', pin: '6620', status: 'Clocked In', lastClockIn: 'Today, 7:55 AM', location: 'South Congress' },
  { id: 'st-16', name: 'Grace Malone', initials: 'GM', role: 'General Manager', pin: '7731', status: 'Clocked In', lastClockIn: 'Today, 8:40 AM', location: 'Lakeline' },
  { id: 'st-17', name: 'Ben Ferraro', initials: 'BF', role: 'Server', pin: '8842', status: 'Clocked In', lastClockIn: 'Today, 11:05 AM', location: 'Riverside' },
  { id: 'st-18', name: 'Nina Osei', initials: 'NO', role: 'Server', pin: '9953', status: 'Clocked In', lastClockIn: 'Today, 10:40 AM', location: 'Domain' },
  { id: 'st-19', name: 'Carlos Mendez', initials: 'CM', role: 'Kitchen', pin: '1064', status: 'Clocked In', lastClockIn: 'Today, 9:10 AM', location: 'South Congress' },
  { id: 'st-20', name: 'Hannah Tovar', initials: 'HT', role: 'Bartender', pin: '2175', status: 'Clocked In', lastClockIn: 'Today, 10:05 AM', location: 'Lakeline' },
]

export const roles = ['Server', 'Bartender', 'Host', 'Kitchen', 'Shift Manager', 'General Manager', 'Owner/Admin']

export const permissionMatrix = [
  { permission: 'Access POS Register', Server: true, Bartender: true, Host: true, Kitchen: true, 'Shift Manager': true, 'General Manager': true, 'Owner/Admin': true },
  { permission: 'Access Kitchen Display', Server: false, Bartender: true, Host: false, Kitchen: true, 'Shift Manager': true, 'General Manager': true, 'Owner/Admin': true },
  { permission: 'Admin Access', Server: false, Bartender: false, Host: false, Kitchen: false, 'Shift Manager': false, 'General Manager': true, 'Owner/Admin': true },
  { permission: 'Preview Guest Ordering', Server: false, Bartender: false, Host: false, Kitchen: false, 'Shift Manager': true, 'General Manager': true, 'Owner/Admin': true },
  { permission: 'Process Refund', Server: false, Bartender: false, Host: false, Kitchen: false, 'Shift Manager': true, 'General Manager': true, 'Owner/Admin': true },
  { permission: 'Apply Discount', Server: true, Bartender: true, Host: false, Kitchen: false, 'Shift Manager': true, 'General Manager': true, 'Owner/Admin': true },
  { permission: 'Void Order', Server: false, Bartender: false, Host: false, Kitchen: false, 'Shift Manager': true, 'General Manager': true, 'Owner/Admin': true },
  { permission: 'Open / Close Register', Server: false, Bartender: false, Host: true, Kitchen: false, 'Shift Manager': true, 'General Manager': true, 'Owner/Admin': true },
  { permission: 'Edit Menu', Server: false, Bartender: false, Host: false, Kitchen: false, 'Shift Manager': false, 'General Manager': true, 'Owner/Admin': true },
  { permission: 'View Reports', Server: false, Bartender: false, Host: false, Kitchen: false, 'Shift Manager': true, 'General Manager': true, 'Owner/Admin': true },
  { permission: 'Manage Staff', Server: false, Bartender: false, Host: false, Kitchen: false, 'Shift Manager': false, 'General Manager': true, 'Owner/Admin': true },
  { permission: 'Transfer Table / Server', Server: false, Bartender: false, Host: true, Kitchen: false, 'Shift Manager': true, 'General Manager': true, 'Owner/Admin': true },
  { permission: 'Open Cash Drawer', Server: false, Bartender: true, Host: false, Kitchen: false, 'Shift Manager': true, 'General Manager': true, 'Owner/Admin': true },
]

export type ModifierOption = { name: string; priceDelta: number }
export type ModifierGroup = {
  name: string
  required: boolean
  selectType: 'single' | 'multi'
  max?: number
  options: ModifierOption[]
}

export type DietType = 'veg' | 'non-veg'

export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: string
  daypart?: string
  soldOut?: boolean
  spice?: number
  dietary?: string[]
  diet?: DietType
  modifierGroups?: ModifierGroup[]
  image: string
}

const meatPattern = /beef|bacon|chicken|turkey|shrimp|salmon|calamari|wing|pork|fish|anchovy|meat|lamb|steak|patty|cheeseburger/i
const veggiePattern = /\bveggie\b|\bvegetarian\b|\bvegan\b|\bplant[- ]based\b/i

export function getItemDiet(item: MenuItem): DietType {
  if (item.diet) return item.diet
  if (item.dietary?.some((d) => d === 'Vegetarian' || d === 'Vegan')) return 'veg'
  const haystack = `${item.name} ${item.description}`
  if (veggiePattern.test(haystack)) return 'veg'
  if (meatPattern.test(haystack) || /burger/i.test(item.name)) return 'non-veg'
  if (item.category === 'Drinks' || item.category === 'Desserts') return 'veg'
  return 'non-veg'
}

export const menuCategories = ['Bowls', 'Burgers', 'Salads', 'Starters', 'Drinks', 'Desserts']

const defaultModifierGroupsByCategory: Record<string, ModifierGroup[]> = {
  Burgers: [
    {
      name: 'Choose a Cheese',
      required: true,
      selectType: 'single',
      options: [
        { name: 'American', priceDelta: 0 },
        { name: 'Cheddar', priceDelta: 0 },
        { name: 'Swiss', priceDelta: 0.5 },
        { name: 'Pepper Jack', priceDelta: 0.5 },
        { name: 'No Cheese', priceDelta: 0 },
      ],
    },
    {
      name: 'Add-ons',
      required: false,
      selectType: 'multi',
      max: 4,
      options: [
        { name: 'Bacon', priceDelta: 1.5 },
        { name: 'Fried Egg', priceDelta: 1.25 },
        { name: 'Avocado', priceDelta: 1.75 },
        { name: 'Grilled Onions', priceDelta: 0.75 },
        { name: 'Extra Patty', priceDelta: 3.5 },
        { name: 'Jalapeños', priceDelta: 0.75 },
      ],
    },
    {
      name: 'Cooking Temp',
      required: true,
      selectType: 'single',
      options: [
        { name: 'Medium Rare', priceDelta: 0 },
        { name: 'Medium', priceDelta: 0 },
        { name: 'Medium Well', priceDelta: 0 },
        { name: 'Well Done', priceDelta: 0 },
      ],
    },
  ],
  Bowls: [
    {
      name: 'Add-ons',
      required: false,
      selectType: 'multi',
      max: 3,
      options: [
        { name: 'Extra Protein', priceDelta: 3.5 },
        { name: 'Avocado', priceDelta: 1.75 },
        { name: 'Extra Rice', priceDelta: 1.0 },
        { name: 'Extra Sauce', priceDelta: 0.5 },
        { name: 'Fried Egg', priceDelta: 1.25 },
      ],
    },
  ],
  Salads: [
    {
      name: 'Dressing',
      required: true,
      selectType: 'single',
      options: [
        { name: 'On the Side', priceDelta: 0 },
        { name: 'House Vinaigrette', priceDelta: 0 },
        { name: 'Ranch', priceDelta: 0 },
        { name: 'Caesar', priceDelta: 0 },
        { name: 'No Dressing', priceDelta: 0 },
      ],
    },
    {
      name: 'Add Protein',
      required: false,
      selectType: 'multi',
      max: 2,
      options: [
        { name: 'Grilled Chicken', priceDelta: 3.5 },
        { name: 'Shrimp', priceDelta: 4.5 },
        { name: 'Salmon', priceDelta: 5.0 },
        { name: 'Avocado', priceDelta: 1.75 },
      ],
    },
  ],
  Starters: [
    {
      name: 'Add-ons',
      required: false,
      selectType: 'multi',
      max: 3,
      options: [
        { name: 'Extra Sauce', priceDelta: 0.75 },
        { name: 'Ranch', priceDelta: 0.5 },
        { name: 'Blue Cheese', priceDelta: 0.75 },
        { name: 'Make it a Shareable', priceDelta: 3.0 },
      ],
    },
  ],
  Drinks: [
    {
      name: 'Size',
      required: true,
      selectType: 'single',
      options: [
        { name: 'Regular', priceDelta: 0 },
        { name: 'Large', priceDelta: 1.25 },
      ],
    },
    {
      name: 'Add-ons',
      required: false,
      selectType: 'multi',
      max: 3,
      options: [
        { name: 'Extra Shot', priceDelta: 1.0 },
        { name: 'Vanilla Syrup', priceDelta: 0.5 },
        { name: 'Whipped Cream', priceDelta: 0.5 },
        { name: 'No Ice', priceDelta: 0 },
      ],
    },
  ],
  Desserts: [
    {
      name: 'Add-ons',
      required: false,
      selectType: 'multi',
      max: 3,
      options: [
        { name: 'Extra Ice Cream', priceDelta: 1.5 },
        { name: 'Whipped Cream', priceDelta: 0.5 },
        { name: 'Extra Sauce', priceDelta: 0.75 },
        { name: 'Caramel Drizzle', priceDelta: 0.75 },
      ],
    },
  ],
}

export function getItemModifierGroups(item: MenuItem): ModifierGroup[] {
  if (item.modifierGroups?.length) return item.modifierGroups
  return defaultModifierGroupsByCategory[item.category] ?? []
}

export const menuItems: MenuItem[] = [
  {
    id: 'mi-1',
    name: 'Classic Smash Burger',
    description: 'Double smashed patty, American cheese, pickles, house sauce, brioche bun.',
    price: 12.5,
    category: 'Burgers',
    dietary: [],
    image: '/smash-burger.png',
    modifierGroups: [
      { name: 'Choose a Cheese', required: true, selectType: 'single', options: [
        { name: 'American', priceDelta: 0 },
        { name: 'Cheddar', priceDelta: 0 },
        { name: 'Swiss', priceDelta: 0.5 },
        { name: 'No Cheese', priceDelta: 0 },
      ] },
      { name: 'Add-ons', required: false, selectType: 'multi', max: 3, options: [
        { name: 'Bacon', priceDelta: 1.5 },
        { name: 'Fried Egg', priceDelta: 1.25 },
        { name: 'Avocado', priceDelta: 1.75 },
        { name: 'Grilled Onions', priceDelta: 0.75 },
      ] },
      { name: 'Cooking Temp', required: true, selectType: 'single', options: [
        { name: 'Medium', priceDelta: 0 },
        { name: 'Medium Well', priceDelta: 0 },
        { name: 'Well Done', priceDelta: 0 },
      ] },
    ],
  },
  {
    id: 'mi-2',
    name: 'BBQ Bacon Cheeseburger',
    description: 'Angus patty, smoked bacon, cheddar, crispy onions, house BBQ sauce.',
    price: 13.75,
    category: 'Burgers',
    image: '/bbq-bacon-cheeseburger.png',
  },
  {
    id: 'mi-3',
    name: 'Mushroom Swiss Burger',
    description: 'Sautéed mushrooms, melted swiss, garlic aioli, toasted brioche.',
    price: 13.25,
    category: 'Burgers',
    soldOut: true,
    image: '/mushroom-swiss-burger.png',
  },
  {
    id: 'mi-15',
    name: 'Spicy Jalapeño Turkey Burger',
    description: 'Ground turkey patty, pepper jack, crispy jalapeños, chipotle mayo.',
    price: 12.95,
    category: 'Burgers',
    spice: 2,
    image: '/spicy-turkey-burger.png',
  },
  {
    id: 'mi-16',
    name: 'Black Bean Veggie Burger',
    description: 'House-made black bean patty, avocado, lettuce, tomato, chipotle aioli.',
    price: 11.5,
    category: 'Burgers',
    dietary: ['Vegetarian'],
    image: '/veggie-burger.png',
  },
  {
    id: 'mi-29',
    name: 'Double Cheddar Smash',
    description: 'Two smashed patties, double cheddar, pickles, special sauce.',
    price: 14.5,
    category: 'Burgers',
    image: '/double-cheddar-smash.png',
  },
  {
    id: 'mi-30',
    name: 'Patty Melt',
    description: 'Griddled rye, caramelized onions, swiss, thousand island.',
    price: 13.5,
    category: 'Burgers',
    image: '/patty-melt.png',
  },
  {
    id: 'mi-31',
    name: 'Impossible Smash',
    description: 'Plant-based smash patty, cheddar, pickles, house sauce, brioche.',
    price: 13.95,
    category: 'Burgers',
    dietary: ['Vegetarian'],
    image: '/impossible-smash.png',
  },
  {
    id: 'mi-32',
    name: 'Breakfast Burger',
    description: 'Smash patty, fried egg, bacon, American cheese, hash brown.',
    price: 14.25,
    category: 'Burgers',
    image: '/breakfast-burger.png',
  },
  {
    id: 'mi-33',
    name: 'Kids Cheeseburger',
    description: 'Single patty, American cheese, ketchup, small bun.',
    price: 7.95,
    category: 'Burgers',
    image: '/kids-cheeseburger.png',
  },
  {
    id: 'mi-4',
    name: 'Grilled Chicken Burrito Bowl',
    description: 'Cilantro-lime rice, black beans, grilled chicken, pico, roasted corn.',
    price: 11.95,
    category: 'Bowls',
    dietary: ['Gluten-Free'],
    image: '/burrito-bowl.png',
  },
  {
    id: 'mi-5',
    name: 'Baja Shrimp Bowl',
    description: 'Chili-lime shrimp, cilantro rice, slaw, avocado crema.',
    price: 14.5,
    category: 'Bowls',
    spice: 2,
    image: '/shrimp-rice-bowl.png',
  },
  {
    id: 'mi-6',
    name: 'Harvest Grain Bowl',
    description: 'Farro, roasted squash, kale, cranberries, goat cheese, sherry vinaigrette.',
    price: 12.25,
    category: 'Bowls',
    dietary: ['Vegetarian'],
    image: '/grain-bowl.png',
  },
  {
    id: 'mi-17',
    name: 'Korean BBQ Beef Bowl',
    description: 'Marinated bulgogi beef, steamed rice, kimchi, pickled carrots, sesame.',
    price: 14.95,
    category: 'Bowls',
    spice: 1,
    image: '/korean-bbq-bowl.png',
  },
  {
    id: 'mi-34',
    name: 'Steak Fajita Bowl',
    description: 'Grilled skirt steak, peppers, onions, cilantro rice, pico, crema.',
    price: 15.5,
    category: 'Bowls',
    spice: 1,
    image: '/steak-fajita-bowl.png',
  },
  {
    id: 'mi-35',
    name: 'Tofu Teriyaki Bowl',
    description: 'Crispy tofu, steamed rice, broccoli, sesame, teriyaki glaze.',
    price: 12.75,
    category: 'Bowls',
    dietary: ['Vegetarian'],
    image: '/tofu-teriyaki-bowl.png',
  },
  {
    id: 'mi-36',
    name: 'Mediterranean Hummus Bowl',
    description: 'Hummus, cucumber, tomato, olives, feta, warm pita, lemon oil.',
    price: 11.95,
    category: 'Bowls',
    dietary: ['Vegetarian'],
    image: '/mediterranean-hummus-bowl.png',
  },
  {
    id: 'mi-7',
    name: 'Classic Caesar Salad',
    description: 'Romaine, shaved parmesan, garlic croutons, creamy Caesar dressing.',
    price: 9.5,
    category: 'Salads',
    diet: 'veg',
    image: '/caesar-salad.png',
  },
  {
    id: 'mi-8',
    name: 'Southwest Cobb Salad',
    description: 'Grilled chicken, bacon, egg, avocado, black beans, chipotle ranch.',
    price: 13.0,
    category: 'Salads',
    image: '/cobb-salad.png',
  },
  {
    id: 'mi-18',
    name: 'Grilled Salmon Niçoise Salad',
    description: 'Grilled salmon, new potatoes, green beans, olives, soft egg, cherry tomatoes.',
    price: 16.5,
    category: 'Salads',
    dietary: ['Gluten-Free'],
    image: '/salmon-nicoise-salad.png',
  },
  {
    id: 'mi-19',
    name: 'Roasted Beet & Arugula Salad',
    description: 'Roasted beets, goat cheese, candied walnuts, orange, balsamic drizzle.',
    price: 11.25,
    category: 'Salads',
    dietary: ['Vegetarian', 'Gluten-Free'],
    image: '/beet-arugula-salad.png',
  },
  {
    id: 'mi-37',
    name: 'House Garden Salad',
    description: 'Mixed greens, cucumber, tomato, carrot, balsamic vinaigrette.',
    price: 8.5,
    category: 'Salads',
    dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    image: '/house-garden-salad.png',
  },
  {
    id: 'mi-38',
    name: 'Buffalo Chicken Salad',
    description: 'Crispy buffalo chicken, romaine, blue cheese, celery, ranch.',
    price: 13.5,
    category: 'Salads',
    spice: 2,
    image: '/buffalo-chicken-salad.png',
  },
  {
    id: 'mi-9',
    name: 'Loaded Waffle Fries',
    description: 'Crispy waffle fries, queso, bacon, scallions, chipotle crema.',
    price: 8.5,
    category: 'Starters',
    image: '/loaded-fries.png',
  },
  {
    id: 'mi-10',
    name: 'Crispy Cauliflower Bites',
    description: 'Gochujang glaze, sesame, scallion, side of ranch.',
    price: 9.0,
    category: 'Starters',
    spice: 2,
    dietary: ['Vegetarian'],
    image: '/cauliflower-bites.png',
  },
  {
    id: 'mi-20',
    name: 'Crispy Calamari',
    description: 'Flash-fried calamari, lemon, house marinara.',
    price: 12.0,
    category: 'Starters',
    image: '/crispy-calamari.png',
  },
  {
    id: 'mi-21',
    name: 'Spinach Artichoke Dip',
    description: 'Bubbling skillet dip, toasted baguette, tortilla chips.',
    price: 10.5,
    category: 'Starters',
    dietary: ['Vegetarian'],
    image: '/spinach-artichoke-dip.png',
  },
  {
    id: 'mi-22',
    name: 'Buffalo Chicken Wings',
    description: 'Crispy wings, classic buffalo sauce, celery, blue cheese.',
    price: 11.75,
    category: 'Starters',
    spice: 3,
    image: '/buffalo-wings.png',
  },
  {
    id: 'mi-39',
    name: 'Onion Rings',
    description: 'Beer-battered rings, smoked paprika aioli.',
    price: 7.5,
    category: 'Starters',
    dietary: ['Vegetarian'],
    image: '/onion-rings.png',
  },
  {
    id: 'mi-40',
    name: 'Queso & Chips',
    description: 'Skillet queso, pico, pickled jalapeños, warm tortilla chips.',
    price: 8.95,
    category: 'Starters',
    dietary: ['Vegetarian'],
    image: '/queso-chips.png',
  },
  {
    id: 'mi-41',
    name: 'Chicken Tenders',
    description: 'Crispy tenders, house honey mustard, fries.',
    price: 10.5,
    category: 'Starters',
    image: '/chicken-tenders.png',
  },
  {
    id: 'mi-11',
    name: 'Iced Oat Milk Latte',
    description: 'Double espresso, oat milk, house vanilla syrup, over ice.',
    price: 5.25,
    category: 'Drinks',
    image: '/iced-oat-latte.png',
  },
  {
    id: 'mi-12',
    name: 'Fresh-Squeezed Lemonade',
    description: 'Lemon, cane sugar, mint, filtered still water.',
    price: 3.75,
    category: 'Drinks',
    image: '/lemonade-glass.png',
  },
  {
    id: 'mi-23',
    name: 'Cold Brew Coffee',
    description: 'Slow-steeped 18 hours, served over ice with a cream swirl.',
    price: 4.5,
    category: 'Drinks',
    image: '/cold-brew-coffee.png',
  },
  {
    id: 'mi-24',
    name: 'Strawberry Mint Cooler',
    description: 'Fresh strawberry purée, mint, sparkling soda.',
    price: 4.95,
    category: 'Drinks',
    image: '/strawberry-mint-cooler.png',
  },
  {
    id: 'mi-25',
    name: 'Craft Root Beer Float',
    description: 'House root beer, vanilla bean ice cream.',
    price: 5.5,
    category: 'Drinks',
    image: '/root-beer-float.png',
  },
  {
    id: 'mi-26',
    name: 'Sparkling Water & Lime',
    description: 'Chilled sparkling water, fresh lime.',
    price: 2.75,
    category: 'Drinks',
    dietary: ['Vegan', 'Gluten-Free'],
    image: '/sparkling-water-lime.png',
  },
  {
    id: 'mi-42',
    name: 'Arnold Palmer',
    description: 'Half lemonade, half unsweet iced tea.',
    price: 3.95,
    category: 'Drinks',
    dietary: ['Vegan'],
    image: '/arnold-palmer.png',
  },
  {
    id: 'mi-43',
    name: 'House Iced Tea',
    description: 'Black tea, steeped cold, lemon wedge.',
    price: 2.95,
    category: 'Drinks',
    dietary: ['Vegan'],
    image: '/house-iced-tea.png',
  },
  {
    id: 'mi-44',
    name: 'Horchata',
    description: 'Rice milk, cinnamon, vanilla, over ice.',
    price: 4.25,
    category: 'Drinks',
    dietary: ['Vegetarian'],
    image: '/horchata.png',
  },
  {
    id: 'mi-13',
    name: 'Salted Caramel Skillet Cookie',
    description: 'Warm chocolate-chip cookie, vanilla ice cream, salted caramel.',
    price: 7.5,
    category: 'Desserts',
    image: '/skillet-cookie.png',
  },
  {
    id: 'mi-14',
    name: 'Classic New York Cheesecake',
    description: 'Graham crust, berry compote.',
    price: 6.95,
    category: 'Desserts',
    image: '/cheesecake-slice.png',
  },
  {
    id: 'mi-27',
    name: 'Churros with Chocolate Sauce',
    description: 'Cinnamon sugar churros, warm chocolate dipping sauce.',
    price: 6.5,
    category: 'Desserts',
    dietary: ['Vegetarian'],
    image: '/churros-dessert.png',
  },
  {
    id: 'mi-28',
    name: 'Seasonal Berry Parfait',
    description: 'Layered vanilla yogurt, house granola, mixed berries.',
    price: 5.95,
    category: 'Desserts',
    dietary: ['Vegetarian'],
    image: '/berry-parfait.png',
  },
  {
    id: 'mi-45',
    name: 'Brownie Sundae',
    description: 'Warm brownie, vanilla ice cream, chocolate sauce, pecans.',
    price: 7.25,
    category: 'Desserts',
    dietary: ['Vegetarian'],
    image: '/brownie-sundae.png',
  },
  {
    id: 'mi-46',
    name: 'Key Lime Pie',
    description: 'Graham crust, tart lime custard, whipped cream.',
    price: 6.75,
    category: 'Desserts',
    dietary: ['Vegetarian'],
    image: '/key-lime-pie.png',
  },
  {
    id: 'mi-47',
    name: 'Texas Chili Burger',
    description: 'Smash patty, house chili, cheddar, pickled jalapeños, diced onion.',
    price: 14.75,
    category: 'Burgers',
    spice: 2,
    image: '/smash-burger.png',
  },
  {
    id: 'mi-48',
    name: 'Blue Cheese Burger',
    description: 'Angus patty, crumbled blue cheese, caramelized onions, arugula.',
    price: 14.25,
    category: 'Burgers',
    image: '/bbq-bacon-cheeseburger.png',
  },
  {
    id: 'mi-49',
    name: 'Avocado Ranch Burger',
    description: 'Smash patty, avocado, ranch, lettuce, tomato, toasted brioche.',
    price: 13.95,
    category: 'Burgers',
    image: '/veggie-burger.png',
  },
  {
    id: 'mi-50',
    name: 'Western BBQ Smash',
    description: 'Double smash, onion ring, cheddar, house BBQ, brioche.',
    price: 14.95,
    category: 'Burgers',
    image: '/double-cheddar-smash.png',
  },
  {
    id: 'mi-51',
    name: 'Truffle Mushroom Melt',
    description: 'Patty melt on rye, truffle mushrooms, swiss, garlic butter.',
    price: 15.25,
    category: 'Burgers',
    image: '/mushroom-swiss-burger.png',
  },
  {
    id: 'mi-52',
    name: 'Habanero Smash',
    description: 'Smash patty, habanero jam, pepper jack, pickled onion.',
    price: 13.5,
    category: 'Burgers',
    spice: 3,
    image: '/spicy-turkey-burger.png',
  },
  {
    id: 'mi-53',
    name: 'Chipotle Steak Bowl',
    description: 'Skirt steak, chipotle rice, black beans, corn, avocado, crema.',
    price: 15.95,
    category: 'Bowls',
    spice: 2,
    image: '/steak-fajita-bowl.png',
  },
  {
    id: 'mi-54',
    name: 'Lemon Herb Chicken Bowl',
    description: 'Grilled chicken, quinoa, cucumber, tomato, feta, lemon herb dressing.',
    price: 13.25,
    category: 'Bowls',
    dietary: ['Gluten-Free'],
    image: '/burrito-bowl.png',
  },
  {
    id: 'mi-55',
    name: 'Sweet Potato Grain Bowl',
    description: 'Roasted sweet potato, farro, kale, pepitas, maple tahini.',
    price: 12.5,
    category: 'Bowls',
    dietary: ['Vegetarian', 'Vegan'],
    image: '/grain-bowl.png',
  },
  {
    id: 'mi-56',
    name: 'Coconut Curry Bowl',
    description: 'Crispy tofu, coconut curry, jasmine rice, cilantro, lime.',
    price: 13.75,
    category: 'Bowls',
    spice: 2,
    dietary: ['Vegetarian', 'Vegan'],
    image: '/tofu-teriyaki-bowl.png',
  },
  {
    id: 'mi-57',
    name: 'Carnitas Bowl',
    description: 'Slow-cooked pork, cilantro rice, pickled onion, salsa verde.',
    price: 14.5,
    category: 'Bowls',
    spice: 1,
    image: '/korean-bbq-bowl.png',
  },
  {
    id: 'mi-58',
    name: 'Falafel Bowl',
    description: 'Crispy falafel, hummus, cucumber salad, tahini, warm pita.',
    price: 12.95,
    category: 'Bowls',
    dietary: ['Vegetarian', 'Vegan'],
    image: '/mediterranean-hummus-bowl.png',
  },
  {
    id: 'mi-59',
    name: 'Garlic Parmesan Fries',
    description: 'Crispy fries, garlic butter, parmesan, parsley.',
    price: 7.25,
    category: 'Starters',
    dietary: ['Vegetarian'],
    image: '/loaded-fries.png',
  },
  {
    id: 'mi-60',
    name: 'Street Corn',
    description: 'Charred corn, cotija, chili-lime crema, cilantro.',
    price: 7.95,
    category: 'Starters',
    dietary: ['Vegetarian'],
    image: '/queso-chips.png',
  },
  {
    id: 'mi-61',
    name: 'Nachos Supreme',
    description: 'Tortilla chips, queso, pico, jalapeños, crema. Add chicken +3.',
    price: 11.5,
    category: 'Starters',
    dietary: ['Vegetarian'],
    image: '/queso-chips.png',
  },
  {
    id: 'mi-62',
    name: 'Fried Pickles',
    description: 'Dill pickle chips, beer batter, ranch.',
    price: 7.75,
    category: 'Starters',
    dietary: ['Vegetarian'],
    image: '/onion-rings.png',
  },
  {
    id: 'mi-63',
    name: 'Pretzel Bites',
    description: 'Warm salted pretzels, beer cheese dip.',
    price: 8.25,
    category: 'Starters',
    dietary: ['Vegetarian'],
    image: '/spinach-artichoke-dip.png',
  },
  {
    id: 'mi-64',
    name: 'Mozzarella Sticks',
    description: 'Fried mozzarella, house marinara.',
    price: 8.5,
    category: 'Starters',
    dietary: ['Vegetarian'],
    image: '/crispy-calamari.png',
  },
]

export type TableStatus = 'open' | 'seated' | 'check-printed' | 'needs-bussing'

export type FloorTable = {
  id: string
  label: string
  seats: number
  shape: 'square' | 'round' | 'booth'
  room: 'Main Dining' | 'Patio' | 'Bar'
  status: TableStatus
  server?: string
  elapsed?: string
  total?: number
  x: number
  y: number
  w: number
  h: number
}

export const floorTables: FloorTable[] = [
  { id: 't1', label: 'T1', seats: 2, shape: 'round', room: 'Main Dining', status: 'seated', server: 'MA', elapsed: '18m', total: 34.5, x: 4, y: 4, w: 2, h: 2 },
  { id: 't2', label: 'T2', seats: 2, shape: 'round', room: 'Main Dining', status: 'open', x: 4, y: 20, w: 2, h: 2 },
  { id: 't3', label: 'T3', seats: 4, shape: 'square', room: 'Main Dining', status: 'check-printed', server: 'JP', elapsed: '52m', total: 96.2, x: 24, y: 4, w: 3, h: 3 },
  { id: 't4', label: 'T4', seats: 4, shape: 'square', room: 'Main Dining', status: 'seated', server: 'JP', elapsed: '6m', total: 12.0, x: 44, y: 4, w: 3, h: 3 },
  { id: 't5', label: 'T5', seats: 4, shape: 'square', room: 'Main Dining', status: 'open', x: 64, y: 4, w: 3, h: 3 },
  { id: 't6', label: 'T6', seats: 6, shape: 'booth', room: 'Main Dining', status: 'seated', server: 'MA', elapsed: '31m', total: 148.75, x: 8, y: 36, w: 4, h: 3 },
  { id: 't7', label: 'T7', seats: 6, shape: 'booth', room: 'Main Dining', status: 'needs-bussing', server: 'JP', elapsed: '—', total: 0, x: 40, y: 36, w: 4, h: 3 },
  { id: 't8', label: 'T8', seats: 2, shape: 'round', room: 'Main Dining', status: 'open', x: 74, y: 36, w: 2, h: 2 },
  { id: 't9', label: 'T9', seats: 4, shape: 'square', room: 'Main Dining', status: 'open', x: 72, y: 68, w: 3, h: 3 },
  { id: 't10', label: 'T10', seats: 2, shape: 'round', room: 'Main Dining', status: 'seated', server: 'CD', elapsed: '4m', total: 8.5, x: 4, y: 68, w: 2, h: 2 },
  { id: 't11', label: 'T11', seats: 8, shape: 'booth', room: 'Main Dining', status: 'seated', server: 'MA', elapsed: '22m', total: 212.4, x: 28, y: 68, w: 5, h: 3 },
  { id: 'p1', label: 'P1', seats: 4, shape: 'square', room: 'Patio', status: 'seated', server: 'DS', elapsed: '12m', total: 28.4, x: 6, y: 6, w: 3, h: 3 },
  { id: 'p2', label: 'P2', seats: 4, shape: 'square', room: 'Patio', status: 'open', x: 26, y: 6, w: 3, h: 3 },
  { id: 'p3', label: 'P3', seats: 2, shape: 'round', room: 'Patio', status: 'seated', server: 'DS', elapsed: '44m', total: 61.0, x: 46, y: 6, w: 2, h: 2 },
  { id: 'p4', label: 'P4', seats: 6, shape: 'booth', room: 'Patio', status: 'open', x: 6, y: 30, w: 4, h: 3 },
  { id: 'p5', label: 'P5', seats: 2, shape: 'round', room: 'Patio', status: 'seated', server: 'CD', elapsed: '15m', total: 22.0, x: 30, y: 30, w: 2, h: 2 },
  { id: 'p6', label: 'P6', seats: 4, shape: 'square', room: 'Patio', status: 'open', x: 46, y: 30, w: 3, h: 3 },
  { id: 'b1', label: 'B1', seats: 1, shape: 'round', room: 'Bar', status: 'seated', server: 'DS', elapsed: '8m', total: 9.5, x: 6, y: 6, w: 2, h: 2 },
  { id: 'b2', label: 'B2', seats: 1, shape: 'round', room: 'Bar', status: 'open', x: 16, y: 6, w: 2, h: 2 },
  { id: 'b3', label: 'B3', seats: 1, shape: 'round', room: 'Bar', status: 'needs-bussing', server: 'DS', elapsed: '—', total: 0, x: 26, y: 6, w: 2, h: 2 },
  { id: 'b4', label: 'B4', seats: 1, shape: 'round', room: 'Bar', status: 'seated', server: 'DS', elapsed: '26m', total: 33.0, x: 36, y: 6, w: 2, h: 2 },
  { id: 'b5', label: 'B5', seats: 2, shape: 'round', room: 'Bar', status: 'open', x: 46, y: 6, w: 2, h: 2 },
]

export const openChecks = [
  { id: 'chk-1', label: 'Table 3', tableId: 't3', orderType: 'dine-in' as const, server: 'Jordan Pierce', elapsed: '52m', total: 96.2, type: 'Dine-In' },
  { id: 'chk-2', label: 'Table 6', tableId: 't6', orderType: 'dine-in' as const, server: 'Maria Alvarez', elapsed: '31m', total: 148.75, type: 'Dine-In' },
  { id: 'chk-3', label: 'Takeout #4471', tableId: null, orderType: 'takeout' as const, server: 'Maria Alvarez', elapsed: '9m', total: 42.3, type: 'Takeout' },
  { id: 'chk-4', label: 'Table 4', tableId: 't4', orderType: 'dine-in' as const, server: 'Jordan Pierce', elapsed: '6m', total: 12.0, type: 'Dine-In' },
  { id: 'chk-5', label: 'Table 11', tableId: 't11', orderType: 'dine-in' as const, server: 'Maria Alvarez', elapsed: '22m', total: 212.4, type: 'Dine-In' },
  { id: 'chk-6', label: 'Bar Tab B4', tableId: 'b4', orderType: 'bar' as const, server: 'Devon Shaw', elapsed: '26m', total: 33.0, type: 'Bar' },
  { id: 'chk-7', label: 'Pickup #4474', tableId: null, orderType: 'pickup' as const, server: 'Chloe Dawson', elapsed: '3m', total: 27.5, type: 'Pickup' },
  { id: 'chk-8', label: 'Table 10', tableId: 't10', orderType: 'dine-in' as const, server: 'Chloe Dawson', elapsed: '4m', total: 8.5, type: 'Dine-In' },
]

export type TicketItem = { name: string; qty: number; modifiers?: string[]; done?: boolean }
export type Station = 'Grill' | 'Fry' | 'Salad' | 'Bar' | 'Expo'
export type OrderType = 'dine-in' | 'takeout' | 'delivery'

export type KitchenTicket = {
  id: string
  orderNumber: string
  orderType: OrderType
  tableOrName: string
  station: Station
  items: TicketItem[]
  firedAt: string
  ageMinutes: number
}

export const kitchenTickets: KitchenTicket[] = [
  { id: 'kt-1', orderNumber: '#4471', orderType: 'dine-in', tableOrName: 'Table 6', station: 'Grill', firedAt: '12:04 PM', ageMinutes: 2, items: [
    { name: 'Classic Smash Burger x2', qty: 2, modifiers: ['Cheddar', '+Bacon', 'Medium Well'] },
    { name: 'BBQ Bacon Cheeseburger', qty: 1, modifiers: ['No Onion'] },
  ] },
  { id: 'kt-2', orderNumber: '#4472', orderType: 'takeout', tableOrName: 'Priya S.', station: 'Grill', firedAt: '11:59 AM', ageMinutes: 6, items: [
    { name: 'Mushroom Swiss Burger', qty: 1 },
    { name: 'Loaded Waffle Fries', qty: 1 },
  ] },
  { id: 'kt-3', orderNumber: '#4468', orderType: 'dine-in', tableOrName: 'Table 3', station: 'Grill', firedAt: '11:51 AM', ageMinutes: 14, items: [
    { name: 'Classic Smash Burger', qty: 1, modifiers: ['Swiss', '+Egg'] },
  ] },
  { id: 'kt-9', orderNumber: '#4473', orderType: 'dine-in', tableOrName: 'Table 11', station: 'Grill', firedAt: '12:08 PM', ageMinutes: 1, items: [
    { name: 'Korean BBQ Beef Bowl', qty: 2 },
    { name: 'Black Bean Veggie Burger', qty: 1, modifiers: ['No Bun'] },
  ] },
  { id: 'kt-10', orderNumber: '#4474', orderType: 'takeout', tableOrName: 'Chloe D.', station: 'Grill', firedAt: '12:07 PM', ageMinutes: 3, items: [
    { name: 'Spicy Jalapeño Turkey Burger', qty: 1, modifiers: ['Extra Jalapeño'] },
  ] },
  { id: 'kt-4', orderNumber: '#4471', orderType: 'dine-in', tableOrName: 'Table 6', station: 'Fry', firedAt: '12:04 PM', ageMinutes: 2, items: [
    { name: 'Loaded Waffle Fries', qty: 2 },
    { name: 'Crispy Cauliflower Bites', qty: 1, modifiers: ['Extra Ranch'] },
  ] },
  { id: 'kt-5', orderNumber: '#4470', orderType: 'delivery', tableOrName: 'DoorDash — Kim R.', station: 'Fry', firedAt: '11:57 AM', ageMinutes: 8, items: [
    { name: 'Loaded Waffle Fries', qty: 3 },
  ] },
  { id: 'kt-11', orderNumber: '#4473', orderType: 'dine-in', tableOrName: 'Table 11', station: 'Fry', firedAt: '12:08 PM', ageMinutes: 1, items: [
    { name: 'Crispy Calamari', qty: 1 },
    { name: 'Buffalo Chicken Wings', qty: 1, modifiers: ['Extra Sauce'] },
  ] },
  { id: 'kt-12', orderNumber: '#4475', orderType: 'delivery', tableOrName: 'Uber Eats — Owen T.', station: 'Fry', firedAt: '11:49 AM', ageMinutes: 16, items: [
    { name: 'Spinach Artichoke Dip', qty: 1 },
  ] },
  { id: 'kt-6', orderNumber: '#4469', orderType: 'dine-in', tableOrName: 'Table 4', station: 'Salad', firedAt: '11:58 AM', ageMinutes: 7, items: [
    { name: 'Southwest Cobb Salad', qty: 1, modifiers: ['No Bacon'] },
    { name: 'Classic Caesar Salad', qty: 1 },
  ] },
  { id: 'kt-7', orderNumber: '#4471', orderType: 'dine-in', tableOrName: 'Table 6', station: 'Salad', firedAt: '12:04 PM', ageMinutes: 2, items: [
    { name: 'Harvest Grain Bowl', qty: 1 },
  ] },
  { id: 'kt-13', orderNumber: '#4476', orderType: 'dine-in', tableOrName: 'Table 10', station: 'Salad', firedAt: '12:06 PM', ageMinutes: 3, items: [
    { name: 'Grilled Salmon Niçoise Salad', qty: 1 },
    { name: 'Roasted Beet & Arugula Salad', qty: 1 },
  ] },
  { id: 'kt-8', orderNumber: '#4467', orderType: 'takeout', tableOrName: 'Alex M.', station: 'Grill', firedAt: '11:47 AM', ageMinutes: 18, items: [
    { name: 'BBQ Bacon Cheeseburger', qty: 2 },
  ] },
  { id: 'kt-14', orderNumber: '#4477', orderType: 'dine-in', tableOrName: 'Bar B4', station: 'Bar', firedAt: '12:09 PM', ageMinutes: 1, items: [
    { name: 'Strawberry Mint Cooler', qty: 2 },
    { name: 'Iced Oat Milk Latte', qty: 1 },
  ] },
  { id: 'kt-15', orderNumber: '#4478', orderType: 'dine-in', tableOrName: 'Bar B1', station: 'Bar', firedAt: '12:02 PM', ageMinutes: 4, items: [
    { name: 'Craft Root Beer Float', qty: 1 },
    { name: 'Cold Brew Coffee', qty: 1 },
  ] },
  { id: 'kt-16', orderNumber: '#4479', orderType: 'takeout', tableOrName: 'Nina O.', station: 'Bar', firedAt: '11:53 AM', ageMinutes: 13, items: [
    { name: 'Fresh-Squeezed Lemonade', qty: 4 },
  ] },
]

export const failedEvents = [
  { id: 'ev-1', type: 'Payment Webhook', timestamp: 'Today, 12:41 PM', reason: 'Timeout waiting for terminal ACK', retries: 2 },
  { id: 'ev-2', type: 'Delivery Adapter', timestamp: 'Today, 11:58 AM', reason: 'DoorDash menu sync — item mapping mismatch', retries: 1 },
  { id: 'ev-3', type: 'Payment Webhook', timestamp: 'Today, 10:22 AM', reason: 'Card terminal offline', retries: 3 },
  { id: 'ev-4', type: 'Delivery Adapter', timestamp: 'Today, 9:47 AM', reason: 'Uber Eats — store hours conflict', retries: 1 },
  { id: 'ev-5', type: 'Payment Webhook', timestamp: 'Yesterday, 4:12 PM', reason: 'Signature verification failed', retries: 4 },
  { id: 'ev-6', type: 'Delivery Adapter', timestamp: 'Yesterday, 1:30 PM', reason: 'Grubhub — item 86&#39;d but still visible', retries: 2 },
  { id: 'ev-7', type: 'Payment Webhook', timestamp: 'Yesterday, 11:15 AM', reason: 'Duplicate charge detected — auto-voided', retries: 1 },
]

export const salesTrend = [
  { day: 'Mon', sales: 6120 },
  { day: 'Tue', sales: 6840 },
  { day: 'Wed', sales: 7210 },
  { day: 'Thu', sales: 7590 },
  { day: 'Fri', sales: 9840 },
  { day: 'Sat', sales: 11320 },
  { day: 'Sun', sales: 9870 },
]

export const topItems = [
  { name: 'Classic Smash Burger', qty: 412, sales: 5150.0 },
  { name: 'Grilled Chicken Burrito Bowl', qty: 356, sales: 4254.2 },
  { name: 'Loaded Waffle Fries', qty: 298, sales: 2533.0 },
  { name: 'Iced Oat Milk Latte', qty: 275, sales: 1443.75 },
  { name: 'BBQ Bacon Cheeseburger', qty: 231, sales: 3176.25 },
  { name: 'Korean BBQ Beef Bowl', qty: 204, sales: 3049.8 },
  { name: 'Southwest Cobb Salad', qty: 188, sales: 2444.0 },
  { name: 'Buffalo Chicken Wings', qty: 176, sales: 2068.0 },
]

export const restaurantProfile = {
  name: 'Riverside Grill',
  tagline: 'Downtown Austin',
  address: '412 Colorado St, Austin, TX 78701',
  hours: 'Mon–Sun · 11:00 AM – 10:00 PM',
  isOpen: true,
  prepTime: '15–20 min',
  isThrottled: true,
}

export type Integration = {
  id: string
  name: string
  category: 'Payments' | 'Delivery' | 'Accounting' | 'Marketing' | 'Reviews'
  status: 'connected' | 'action-needed' | 'not-connected'
  detail: string
}

export const integrationsCatalog: Integration[] = [
  { id: 'int-1', name: 'Stripe Terminal', category: 'Payments', status: 'connected', detail: 'Card-present + tap-to-pay' },
  { id: 'int-2', name: 'DoorDash', category: 'Delivery', status: 'connected', detail: 'Menu synced 12 min ago' },
  { id: 'int-3', name: 'Uber Eats', category: 'Delivery', status: 'action-needed', detail: 'Store-hours conflict detected' },
  { id: 'int-4', name: 'Grubhub', category: 'Delivery', status: 'connected', detail: 'Menu synced 1 hr ago' },
  { id: 'int-5', name: 'QuickBooks Online', category: 'Accounting', status: 'connected', detail: 'Daily journal export at 2 AM' },
  { id: 'int-6', name: 'Mailchimp', category: 'Marketing', status: 'not-connected', detail: 'Sync loyalty members to campaigns' },
  { id: 'int-7', name: 'Google Business Profile', category: 'Reviews', status: 'connected', detail: '4.7★ average · 812 reviews' },
  { id: 'int-8', name: 'Yelp for Business', category: 'Reviews', status: 'action-needed', detail: 'Reconnect required — token expired' },
  { id: 'int-9', name: 'Twilio SMS', category: 'Marketing', status: 'connected', detail: 'Order-ready text alerts' },
]

export const testimonials = [
  { id: 'tm-1', name: 'Sarah K.', rating: 5, quote: 'The smash burger is unreal and ordering ahead saved us so much time on a busy Friday night.' },
  { id: 'tm-2', name: 'Marcus T.', rating: 5, quote: 'Best patio in downtown. The staff always remembers our order and the app makes reordering effortless.' },
  { id: 'tm-3', name: 'Devi R.', rating: 4, quote: 'Loved the Korean BBQ bowl — generous portions and the QR ordering at our table was seamless.' },
]

export const loyalty = {
  memberName: 'Alex Morgan',
  pointsBalance: 1240,
  pointsToNextReward: 260,
  tier: 'Gold',
  rewardAt: 1500,
}

export const registers = [
  { id: 'reg-1', name: 'Register 1', location: 'Downtown', bound: true, lastSeen: 'Just now', version: 'POS 1.4.2' },
  { id: 'reg-2', name: 'Register 2', location: 'Downtown', bound: true, lastSeen: 'Just now', version: 'POS 1.4.2' },
  { id: 'reg-3', name: 'Register 1', location: 'Riverside', bound: true, lastSeen: '4 min ago', version: 'POS 1.4.1' },
  { id: 'reg-4', name: 'Register 1', location: 'Domain', bound: false, lastSeen: 'Never', version: '—' },
  { id: 'reg-5', name: 'Expo Display', location: 'Downtown', bound: true, lastSeen: '1 min ago', version: 'KDS 1.2.0' },
]

export const discountsCatalog = [
  { id: 'd-1', name: 'Open $', type: 'Amount', value: 'Variable', code: 'OPEN$', managerPin: true },
  { id: 'd-2', name: 'Open %', type: 'Percent', value: 'Variable', code: 'OPEN%', managerPin: true },
  { id: 'd-3', name: 'Staff Meal', type: 'Percent', value: '50%', code: 'STAFF', managerPin: true },
  { id: 'd-4', name: 'Loyalty Reward', type: 'Amount', value: '$5.00', code: 'GOLD5', managerPin: false },
  { id: 'd-5', name: 'Happy Hour', type: 'Percent', value: '15%', code: 'HH15', managerPin: false },
]

export const customers = [
  { id: 'cu-1', name: 'Jamie Rodriguez', phone: '(512) 555-0148', email: 'jamie.rodriguez@email.com', orders: 18, lastVisit: 'Today', spend: 412.5 },
  { id: 'cu-2', name: 'Priya Shah', phone: '(512) 555-0193', email: 'priya.s@email.com', orders: 9, lastVisit: 'Yesterday', spend: 188.2 },
  { id: 'cu-3', name: 'Alex Morgan', phone: '(512) 555-0111', email: 'alex.morgan@email.com', orders: 41, lastVisit: 'Aug 16', spend: 980.0 },
  { id: 'cu-4', name: 'Chloe D.', phone: '(512) 555-0177', email: 'chloe.d@email.com', orders: 3, lastVisit: 'Today', spend: 54.75 },
]

export const cashDrawer = {
  startingFloat: 200,
  cashSales: 428.5,
  paidIn: 40,
  paidOut: 15,
  drops: 200,
  expected: 453.5,
}

export const printQueue = [
  { id: 'pq-1', type: 'KOT', target: 'Grill printer', check: 'Table 6', status: 'printed', time: '12:04 PM' },
  { id: 'pq-2', type: 'KOT', target: 'Expo printer', check: 'Takeout #4471', status: 'retry', time: '12:05 PM' },
  { id: 'pq-3', type: 'Receipt', target: 'Register 2', check: 'Table 3', status: 'printed', time: '12:09 PM' },
  { id: 'pq-4', type: 'KOT', target: 'Salad printer', check: 'Table 11', status: 'queued', time: '12:11 PM' },
]

export const deviceHeartbeats = [
  { name: 'Register 2', kind: 'POS', status: 'online', latency: '42 ms' },
  { name: 'Grill KDS', kind: 'Kitchen', status: 'online', latency: '38 ms' },
  { name: 'Expo KDS', kind: 'Kitchen', status: 'online', latency: '51 ms' },
  { name: 'Receipt printer', kind: 'Printer', status: 'online', latency: '12 ms' },
  { name: 'Grill printer', kind: 'Printer', status: 'degraded', latency: '910 ms' },
  { name: 'Cash drawer', kind: 'Hardware', status: 'online', latency: '—' },
]

export type InventoryItem = {
  id: string
  name: string
  onHand: number
  par: number
  unit: string
  cost: number
}

export const inventoryItems: InventoryItem[] = [
  { id: 'inv-1', name: 'Brioche buns', onHand: 48, par: 60, unit: 'ea', cost: 0.42 },
  { id: 'inv-2', name: 'Angus smash patties', onHand: 22, par: 80, unit: 'ea', cost: 1.85 },
  { id: 'inv-3', name: 'Romaine', onHand: 6, par: 12, unit: 'heads', cost: 1.2 },
  { id: 'inv-4', name: 'Fries', onHand: 18, par: 20, unit: 'lb', cost: 1.1 },
  { id: 'inv-5', name: 'American cheese', onHand: 40, par: 50, unit: 'slices', cost: 0.12 },
  { id: 'inv-6', name: 'Swiss cheese', onHand: 18, par: 30, unit: 'slices', cost: 0.18 },
  { id: 'inv-7', name: 'House sauce', onHand: 12, par: 16, unit: 'oz', cost: 0.18 },
  { id: 'inv-8', name: 'Pickle chips', onHand: 8, par: 10, unit: 'oz', cost: 0.08 },
  { id: 'inv-9', name: 'Smoked bacon', onHand: 14, par: 20, unit: 'slices', cost: 0.35 },
  { id: 'inv-10', name: 'Sautéed mushrooms', onHand: 4, par: 8, unit: 'oz', cost: 0.22 },
  { id: 'inv-11', name: 'Turkey patties', onHand: 30, par: 40, unit: 'ea', cost: 1.6 },
  { id: 'inv-12', name: 'Black bean patties', onHand: 16, par: 24, unit: 'ea', cost: 1.1 },
  { id: 'inv-13', name: 'Garlic aioli', onHand: 10, par: 12, unit: 'oz', cost: 0.2 },
  { id: 'inv-14', name: 'Caesar dressing', onHand: 9, par: 12, unit: 'oz', cost: 0.16 },
  { id: 'inv-15', name: 'Parmesan', onHand: 5, par: 8, unit: 'oz', cost: 0.4 },
  { id: 'inv-16', name: 'Garlic croutons', onHand: 7, par: 10, unit: 'oz', cost: 0.14 },
]

export const reservations = [
  { time: '5:30 PM', name: 'Chen party', covers: 4, notes: 'Patio' },
  { time: '6:00 PM', name: 'Webb', covers: 2, notes: '—' },
  { time: '7:15 PM', name: 'Nair', covers: 6, notes: 'High chair' },
]

export const giftCards = [
  { number: '•••• 4412', balance: 75, status: 'Active' },
  { number: '•••• 8821', balance: 0, status: 'Redeemed' },
  { number: '•••• 0194', balance: 40, status: 'Active' },
]
