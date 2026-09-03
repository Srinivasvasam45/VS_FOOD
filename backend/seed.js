const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const FoodPartner = require('./models/FoodPartner');
const Food = require('./models/Food');

const samplePartnersData = [
  {
    user: {
      name: 'Chef Rajesh Sharma',
      email: 'biryanihouse@vsfood.com',
      password: 'Password@123',
      phone: '+91 98765 43210',
      role: 'foodPartner',
      profileImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
    },
    partner: {
      restaurantName: 'Royal Biryani House',
      username: 'royalbiryani',
      description: 'Authentic Hyderabadi Dum Biryanis, slow-cooked in sealed clay pots with royal aromatic spices.',
      profileImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 98765 43210',
      address: 'Shop 14, Royal Heritage Square, Banjara Hills Rd 12',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      latitude: 17.4156,
      longitude: 78.4357,
      cuisine: ['Hyderabadi', 'Biryani', 'Mughlai', 'Kebabs'],
      openingHours: '11:00 AM - 11:30 PM',
      rating: 4.8,
      totalReviews: 240,
    },
    foods: [
      {
        name: 'Hyderabadi Special Chicken Dum Biryani',
        description: 'Tender chicken marinated in yogurt and saffron spices, layered with aged basmati rice and slow-cooked in dum style.',
        price: 349,
        category: 'Biryani',
        foodType: 'nonVeg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-taking-a-portion-of-a-rice-dish-with-a-spoon-43285-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        totalReviews: 180,
      },
      {
        name: 'Shahi Mutton Galouti Kebab',
        description: 'Melt-in-your-mouth minced lamb kebabs infused with 24 secret Nawabi spices, served with mint chutney and laccha onions.',
        price: 399,
        category: 'Biryani',
        foodType: 'nonVeg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hot-fried-food-on-a-pan-43284-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        totalReviews: 95,
      },
      {
        name: 'Royal Zafrani Kheer & Gulab Jamun',
        description: 'Creamy saffron rice pudding served chilled with roasted pistachios, alongside warm melt-in-mouth gulab jamuns.',
        price: 189,
        category: 'Desserts',
        foodType: 'veg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-serving-freshly-made-creamy-dessert-43288-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        totalReviews: 64,
      },
    ],
  },
  {
    user: {
      name: 'Chef Marco Rossi',
      email: 'pizzanapoli@vsfood.com',
      password: 'Password@123',
      phone: '+91 98111 22334',
      role: 'foodPartner',
      profileImage: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80',
    },
    partner: {
      restaurantName: 'Bella Napoli Artisan Pizza',
      username: 'bellanapoli',
      description: 'Handcrafted Neapolitan wood-fired pizzas made with fermented sourdough, San Marzano tomato sauce, and fresh fior di latte mozzarella.',
      profileImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 98111 22334',
      address: '22 Gourmet Lane, Jubilee Hills Checkpost',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      latitude: 17.4319,
      longitude: 78.4073,
      cuisine: ['Italian', 'Wood-Fired Pizza', 'Pasta', 'Artisan Bakery'],
      openingHours: '12:00 PM - 11:00 PM',
      rating: 4.7,
      totalReviews: 310,
    },
    foods: [
      {
        name: 'Truffle Burrata & Wild Mushroom Pizza',
        description: 'Crispy sourdough base topped with creamy artisan burrata, black truffle emulsion, caramelized onions, and porcini mushrooms.',
        price: 499,
        category: 'Pizza',
        foodType: 'veg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cutting-a-slice-of-pizza-in-a-wooden-board-43283-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        totalReviews: 215,
      },
      {
        name: 'Spicy Pepperoni & Hot Honey Feast',
        description: 'Generously loaded with Italian smoky pepperoni, hot chili-infused blossom honey drizzle, and gooey mozzarella cheese.',
        price: 549,
        category: 'Pizza',
        foodType: 'nonVeg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-stretching-and-folding-pizza-dough-43282-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        totalReviews: 190,
      },
      {
        name: 'Artisan San Pellegrino Blood Orange Soda',
        description: 'Crisp sparkling Italian mineral water crafted with cold-pressed Mediterranean blood oranges and herbs.',
        price: 149,
        category: 'Beverages',
        foodType: 'veg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-soda-into-a-glass-with-ice-43292-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        totalReviews: 45,
      },
    ],
  },
  {
    user: {
      name: 'Chef Alex Sterling',
      email: 'smashburger@vsfood.com',
      password: 'Password@123',
      phone: '+91 99887 76655',
      role: 'foodPartner',
      profileImage: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=400&q=80',
    },
    partner: {
      restaurantName: 'The Smash Craft Burger Co.',
      username: 'smashburgerco',
      description: 'Ultra-crispy lacy edged smashed burgers, butter-toasted brioche buns, and gourmet dipping sauces.',
      profileImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 99887 76655',
      address: '77 Cyber Enclave, Hitech City Phase 2',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      latitude: 17.4435,
      longitude: 78.3772,
      cuisine: ['American', 'Smash Burgers', 'Gourmet Shakes', 'Sides'],
      openingHours: '11:30 AM - 12:00 AM',
      rating: 4.6,
      totalReviews: 185,
    },
    foods: [
      {
        name: 'Double Smokehouse Cheese Smasher',
        description: 'Two crispy edged smashed beef/chicken patties, double aged cheddar, smoked bacon jam, caramelized shallots, and house secret sauce.',
        price: 329,
        category: 'Burger',
        foodType: 'nonVeg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-and-showing-a-large-burger-43286-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        totalReviews: 140,
      },
      {
        name: 'Crispy Truffle Egg & Guacamole Smasher',
        description: 'Fried sunny egg over seasoned crispy patty, mashed avocado guacamole, chipotle aioli on toasted brioche.',
        price: 279,
        category: 'Burger',
        foodType: 'egg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-preparing-delicious-burgers-in-a-kitchen-43287-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        totalReviews: 72,
      },
      {
        name: 'Lotus Biscoff Thick Shake',
        description: 'Ultra thick vanilla gelato blended with Belgian caramelized Biscoff spread and crushed cookies.',
        price: 219,
        category: 'Beverages',
        foodType: 'veg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-chocolate-sauce-over-an-ice-cream-shake-43290-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        totalReviews: 88,
      },
    ],
  },
  {
    user: {
      name: 'Chef Meenakshi Sundaram',
      email: 'dakshin@vsfood.com',
      password: 'Password@123',
      phone: '+91 97766 55443',
      role: 'foodPartner',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    },
    partner: {
      restaurantName: 'Dakshin Tiffin Bhavan',
      username: 'dakshintiffins',
      description: 'Crispy golden ghee roast dosas, fluffy steamed button idlis, and heritage coastal South Indian filter coffees.',
      profileImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 97766 55443',
      address: '51 Gandhi Road, Secunderabad Clock Tower',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500003',
      latitude: 17.4399,
      longitude: 78.4983,
      cuisine: ['South Indian', 'Tiffins', 'Filter Coffee', 'Pure Vegetarian'],
      openingHours: '06:30 AM - 10:30 PM',
      rating: 4.9,
      totalReviews: 420,
    },
    foods: [
      {
        name: 'Guntur Podi Neyyi Roast Dosa',
        description: 'Paper-thin golden crispy crepe slathered with pure desi ghee and fiery crushed Guntur spice podi, served with 3 signature chutneys and piping sambar.',
        price: 169,
        category: 'South Indian',
        foodType: 'veg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-making-pancakes-on-a-hot-griddle-43289-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        rating: 5.0,
        totalReviews: 320,
      },
      {
        name: 'Malgudi Hot Filter Kaapi',
        description: 'Traditional slow-dripped chicory blend freshly brewed with frothed full-cream milk in a classic brass dabarah and tumbler.',
        price: 79,
        category: 'Beverages',
        foodType: 'veg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-freshly-brewed-hot-coffee-43291-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        totalReviews: 210,
      },
      {
        name: 'Steamed Ghee Thatte Idli with Vada',
        description: 'Large pillowy soft steamed rice cakes drowned in ghee and sambar, paired with a crunchy medu vada.',
        price: 139,
        category: 'South Indian',
        foodType: 'veg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-taking-a-portion-of-a-rice-dish-with-a-spoon-43285-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        totalReviews: 155,
      },
    ],
  },
  {
    user: {
      name: 'Chef Li Wei',
      email: 'wokdragon@vsfood.com',
      password: 'Password@123',
      phone: '+91 96655 44332',
      role: 'foodPartner',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    partner: {
      restaurantName: 'Dragon Wok Asian Kitchen',
      username: 'dragonwok',
      description: 'High-flame wok-tossed noodles, spicy Schezwan specialties, and handmade crystal dim sums.',
      profileImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 96655 44332',
      address: '108 Asian Street, Gachibowli Financial District',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500032',
      latitude: 17.4401,
      longitude: 78.3489,
      cuisine: ['Chinese', 'Pan-Asian', 'Dim Sum', 'Noodles'],
      openingHours: '12:00 PM - 11:30 PM',
      rating: 4.7,
      totalReviews: 270,
    },
    foods: [
      {
        name: 'Szechuan Chilli Garlic Prawn Noodles',
        description: 'Fiery wok-tossed egg noodles loaded with jumbo butterflied prawns, spring scallions, bell peppers, and roasted chili oil.',
        price: 369,
        category: 'Chinese',
        foodType: 'nonVeg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tossing-stir-fry-noodles-in-a-wok-pan-43281-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        totalReviews: 160,
      },
      {
        name: 'Crispy Chilli Paneer Dry',
        description: 'Fresh cottage cheese cubes batter-fried to crisp perfection and tossed with crunchy onions, capsicum, and ginger soya glaze.',
        price: 289,
        category: 'Chinese',
        foodType: 'veg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hot-fried-food-on-a-pan-43284-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        totalReviews: 110,
      },
      {
        name: 'Molten Lava Dark Chocolate Fondant',
        description: 'Warm Belgian dark chocolate cake with a rich liquid truffle center, dusted with icing sugar.',
        price: 199,
        category: 'Desserts',
        foodType: 'egg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-serving-freshly-made-creamy-dessert-43288-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        totalReviews: 145,
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not set in backend/.env');
      process.exit(1);
    }

    console.log('🔄 Connecting to your MongoDB database...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    console.log('🌱 Starting safe, non-destructive seeding check...');

    let insertedRestaurants = 0;
    let insertedFoods = 0;

    for (const data of samplePartnersData) {
      // 1. Check if user already exists
      let user = await User.findOne({ email: data.user.email });
      if (!user) {
        user = await User.create(data.user);
        console.log(`👤 Created partner user: ${user.email}`);
      } else {
        console.log(`ℹ️ User ${data.user.email} already exists. Reusing existing user.`);
      }

      // 2. Check if food partner profile exists
      let partner = await FoodPartner.findOne({ username: data.partner.username });
      if (!partner) {
        partner = await FoodPartner.create({
          ...data.partner,
          user: user._id,
        });
        insertedRestaurants++;
        console.log(`🏪 Created restaurant: ${partner.restaurantName} (@${partner.username})`);
      } else {
        console.log(`ℹ️ Restaurant ${partner.restaurantName} already exists. Skipping partner creation.`);
      }

      // 3. Check and insert foods
      for (const foodItem of data.foods) {
        const existingFood = await Food.findOne({
          foodPartner: partner._id,
          name: foodItem.name,
        });

        if (!existingFood) {
          await Food.create({
            ...foodItem,
            foodPartner: partner._id,
          });
          insertedFoods++;
          console.log(`  🍲 Added food reel: ${foodItem.name} (₹${foodItem.price})`);
        } else {
          console.log(`  ℹ️ Food '${foodItem.name}' already exists. Skipping.`);
        }
      }
    }

    console.log('\n=============================================');
    console.log(`🎉 Seeding completed!`);
    console.log(`   Total new restaurants added: ${insertedRestaurants}`);
    console.log(`   Total new food reels added: ${insertedFoods}`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
