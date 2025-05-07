import { Data, IProductInput, IUserInput } from '@/types'
import { toSlug } from './utils'
import bcrypt from 'bcryptjs'
import { i18n } from '@/i18n-config'

const users: IUserInput[] = [
  {
    name: 'Zineb',
    email: 'z@example.com',
    password: bcrypt.hashSync('1234', 5),
    role: 'Admin',
    address: {
      fullName: 'Zineb Ech',
      street: 'Essaouira Ghazwa',
      city: 'Essaouira',
      province: 'Essaouira',
      postalCode: '44000',
      country: 'Maroc',
      phone: '0661-234567',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Jamila',
    email: 'jamila@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'Admin',
    address: {
      fullName: 'Jamila Kam',
      street: '12 Rue 1',
      city: 'Agadir',
      province: 'Agadir',
      postalCode: '80000',
      country: 'Maroc',
      phone: '0662-345678',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Ahmed',
    email: 'ahmed@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Ahmed Mansouri',
      street: 'Rue Al Yassamine',
      city: 'Casablanca',
      province: 'Casablanca',
      postalCode: '20250',
      country: 'Maroc',
      phone: '0663-456789',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'Amina',
    email: 'amina@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Amina Ben Ali',
      street: 'Avenue Mohammed V',
      city: 'Marrakech',
      province: 'Marrakech',
      postalCode: '40000',
      country: 'Maroc',
      phone: '0664-567890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Mohamed',
    email: 'mohamed@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Mohamed El Idrissi',
      street: 'Boulevard Zerktouni',
      city: 'Rabat',
      province: 'Rabat',
      postalCode: '10000',
      country: 'Maroc',
      phone: '0665-678901',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'Fatima',
    email: 'fatima@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Fatima Zahra',
      street: 'Avenue Hassan II',
      city: 'Fès',
      province: 'Fès',
      postalCode: '30000',
      country: 'Maroc',
      phone: '0666-789012',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Ali',
    email: 'ali@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Ali Bouazza',
      street: 'Rue Al Khansaa',
      city: 'Tanger',
      province: 'Tanger',
      postalCode: '90000',
      country: 'Maroc',
      phone: '0667-890123',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Karima',
    email: 'karima@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Karima Lahlou',
      street: 'Avenue Nador',
      city: 'Oujda',
      province: 'Oujda',
      postalCode: '60000',
      country: 'Maroc',
      phone: '0668-901234',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Youssef',
    email: 'youssef@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Youssef Bakkali',
      street: 'Boulevard Al Massira',
      city: 'Laâyoune',
      province: 'Laâyoune',
      postalCode: '70000',
      country: 'Maroc',
      phone: '0669-012345',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'Samira',
    email: 'samira@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Samira Oukili',
      street: 'Place Al Amal',
      city: 'Tetouan',
      province: 'Tetouan',
      postalCode: '93000',
      country: 'Maroc',
      phone: '0670-123456',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
]


const products: IProductInput[] = [
  // Vêtements - Chemises Traditionnelles
  {
    name: 'Chemise en Coton',
    slug: toSlug('Chemise Marocaine en Coton'),
    category: 'Vêtements',
    images: ['/images/chemisee-coton1.jpg', '/images/chemise-coton2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 45.0,
    listPrice: 60.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.5,
    numReviews: 10,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 4 },
      { rating: 5, count: 5 },
    ],
    numSales: 15,
    countInStock: 12,
    description:
      'Chemise marocaine en coton léger, parfaite pour un look décontracté et traditionnel. Disponible en plusieurs couleurs.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Blanc', 'Bleu', 'Vert'],
    reviews: [],
  },
  {
    name: 'Bracelet Berbère',
    slug: toSlug('Bracelet en Argent Berbère'),
    category: 'Accessoires',
    images: ['/images/bracelet-argent1.jpg', '/images/bracelet-argent2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 50.0,
    listPrice: 65.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.6,
    numReviews: 8,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 3 },
      { rating: 5, count: 4 },
    ],
    numSales: 12,
    countInStock: 15,
    description:
      'Bracelet berbère en argent, fabriqué à la main avec des motifs traditionnels. Un accessoire authentique et intemporel.',
    sizes: ['Unique'],
    colors: ['Argent'],
    reviews: [],
  },
  {
    name: 'Tajine en Terre Cuite',
    slug: toSlug('Tajine en Terre Cuite Traditionnel'),
    category: 'Cuisine',
    images: ['/images/tajine-terre1.jpg', '/images/tajine-terre2.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 40.0,
    listPrice: 55.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.8,
    numReviews: 15,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 4 },
      { rating: 5, count: 9 },
    ],
    numSales: 25,
    countInStock: 20,
    description:
      'Tajine marocain en terre cuite, idéal pour préparer des plats authentiques marocains avec une cuisson lente et savoureuse.',
    sizes: ['Petit', 'Moyen', 'Grand'],
    colors: ['Naturel', 'Décoré'],
    reviews: [],
  },
  {
    name: 'Miroir en Bois',
    slug: toSlug('Miroir en Bois Sculpté'),
    category: 'Décoration',
    images: ['/images/miroir-bois1.jpg', '/images/miroir-bois2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 90.0,
    listPrice: 120.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.8,
    numReviews: 7,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 2 },
      { rating: 5, count: 4 },
    ],
    numSales: 10,
    countInStock: 5,
    description:
      'Miroir marocain encadré en bois sculpté à la main avec des motifs élégants. Parfait pour ajouter une touche artisanale à votre maison.',
    sizes: ['50x70 cm', '70x100 cm'],
    colors: ['Naturel', 'Foncé'],
    reviews: [],
  },
  {
    name: 'Djellaba en Laine',
    slug: toSlug('Djellaba Marocaine en Laine'),
    category: 'Vêtements',
    images: ['/images/djellaba-laine1.jpg', '/images/djellaba-laine2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 80.0,
    listPrice: 100.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.8,
    numReviews: 15,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 1 },
      { rating: 3, count: 1 },
      { rating: 4, count: 4 },
      { rating: 5, count: 9 },
    ],
    numSales: 20,
    countInStock: 8,
    description:
      'Djellaba traditionnelle marocaine en laine, parfaite pour les soirées fraîches. Confort et style authentique.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Gris', 'Beige', 'Noir'],
    reviews: [],
  },
  {
    name: 'Sac en Paille',
    slug: toSlug('Sac Marocain en Paille Tressée'),
    category: 'Sacs',
    images: ['/images/sac-paille1.jpg', '/images/sac-paille2.jpg'],
    tags: ['featured'],
    isPublished: true,
    price: 35.0,
    listPrice: 50.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.5,
    numReviews: 9,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 3 },
      { rating: 5, count: 4 },
    ],
    numSales: 12,
    countInStock: 15,
    description:
      'Sac marocain tressé à la main avec de la paille naturelle, idéal pour vos sorties au marché ou à la plage.',
    sizes: [],
    colors: ['Naturel', 'Blanc'],
    reviews: [],
  },
  {
    name: 'Babouches en Velours ',
    slug: toSlug('Babouches en cuir Brodées'),
    category: 'Chaussures',
    images: ['/images/babouches-velours1.jpg', '/images/babouches-velours2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 40.0,
    listPrice: 55.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.6,
    numReviews: 12,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 4 },
      { rating: 5, count: 6 },
    ],
    numSales: 18,
    countInStock: 10,
    description:
      'Babouches marocaines en cuir , Parfaites pour un style élégant et authentique.',
    sizes: ['38', '39', '40', '41'],
    colors: ['Rouge', 'Noir', 'Bleu'],
    reviews: [],
  },
  {
    name: 'Foulard en Soie ',
    slug: toSlug('Foulard en Soie Traditionnel'),
    category: 'Accessoires',
    images: ['/images/foulard-soie1.jpg', '/images/foulard-soie2.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 25.0,
    listPrice: 35.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.9,
    numReviews: 8,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 2 },
      { rating: 5, count: 5 },
    ],
    numSales: 14,
    countInStock: 12,
    description:
      'Foulard en soie marocaine avec des motifs inspirés de l’art traditionnel. Léger et élégant.',
    sizes: [],
    colors: ['Rouge', 'Vert', 'Bleu'],
    reviews: [],
  },
  {
    name: 'Coussin Brodé',
    slug: toSlug('Coussin Brodé à la Main'),
    category: 'Décoration',
    images: ['/images/coussin-brode1.jpg', '/images/coussin-brode2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 45.0,
    listPrice: 60.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.7,
    numReviews: 10,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 3 },
      { rating: 5, count: 5 },
    ],
    numSales: 15,
    countInStock: 8,
    description:
      'Coussin marocain brodé à la main avec des motifs berbères. Ajoute une touche chaleureuse à votre intérieur.',
    sizes: ['40x40 cm', '50x50 cm'],
    colors: ['Rouge', 'Beige', 'Noir'],
    reviews: [],
  },
          
  
  
  
  // Pantalons Traditionnels
  {
    name: 'Pantalon en Lin',
    slug: toSlug('Pantalon Marocaine en Lin'),
    category: 'Vêtements',
    images: ['/images/pantalon-lin1.jpg', '/images/pantalon-lin2.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 60.0,
    listPrice: 75.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.6,
    numReviews: 8,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 2 },
      { rating: 5, count: 5 },
    ],
    numSales: 18,
    countInStock: 10,
    description:
      'Pantalon marocain en lin, idéal pour les journées chaudes, avec une coupe traditionnelle et confortable.',
    sizes: ['L', 'XL'],
    colors: ['Beige', 'Gris'],
    reviews: [],
  },
  // Sacs
  {
    name: 'Sac à Main',
    slug: toSlug('Sac à Main en Cuir Marocain'),
    category: 'Sacs',
    images: ['/images/sac-cuir1.jpg', '/images/sac-cuir2.jpg','/images/sac-cuir3.jpg'],
    tags: ['featured'],
    isPublished: true,
    price: 120.0,
    listPrice: 150.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.7,
    numReviews: 10,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 2 },
      { rating: 5, count: 7 },
    ],
    numSales: 20,
    countInStock: 5,
    description:
      'Sac à main en cuir marocain, brodé à la main avec des motifs traditionnels. Élégant et pratique pour les occasions spéciales.',
    sizes: [],
    colors: ['Marron', 'Noir'],
    reviews: [],
  },
  {
    name: 'Sac Tissé',
    slug: toSlug('Sac Tissé Marocain'),
    category: 'Sacs',
    images: ['/images/sac-tisse1.jpg', '/images/sac-tisse2.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 55.0,
    listPrice: 70.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.6,
    numReviews: 8,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 3 },
      { rating: 5, count: 4 },
    ],
    numSales: 15,
    countInStock: 10,
    description:
      'Sac marocain tissé à la main avec des fils colorés. Léger et pratique pour les sorties quotidiennes.',
    sizes: [],
    colors: ['Jaune', 'Rouge', 'Bleu'],
    reviews: [],
  },
  // Sandales
  {
    name: 'Sandales en Cuir',
    slug: toSlug('Sandales en Cuir Brodées'),
    category: 'Chaussures',
    images: ['/images/sandales-cuir1.jpg', '/images/sandales-cuir2.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 50.0,
    listPrice: 60.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.8,
    numReviews: 12,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 3 },
      { rating: 5, count: 8 },
    ],
    numSales: 25,
    countInStock: 10,
    description:
      'Sandales marocaines en cuir, brodées à la main avec des motifs traditionnels. Confortables et élégantes.',
    sizes: ['38', '39', '40', '41'],
    colors: ['Marron', 'Beige'],
    reviews: [],
  },
  {
    name: 'Babouches Brodées',
    slug: toSlug('Babouches Marocaines Brodées'),
    category: 'Chaussures',
    images: ['/images/babouches-brodees1.jpg', '/images/babouches-brodees2.jpg'],
    tags: ['featured'],
    isPublished: true,
    price: 35.0,
    listPrice: 45.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.5,
    numReviews: 10,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 3 },
      { rating: 5, count: 5 },
    ],
    numSales: 18,
    countInStock: 8,
    description:
      'Babouches marocaines brodées à la main, légères et confortables, avec des couleurs vibrantes pour un look traditionnel.',
    sizes: ['39', '40', '41'],
    colors: ['Rouge', 'Or'],
    reviews: [],
  },
  // Ceintures
  {
    name: 'Ceinture en Cuir',
    slug: toSlug('Ceinture Marocaine en Cuir'),
    category: 'Accessoires',
    images: ['/images/ceinture-cuir1.jpg', '/images/ceinture-cuir2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 30.0,
    listPrice: 40.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.7,
    numReviews: 5,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 2 },
      { rating: 5, count: 2 },
    ],
    numSales: 12,
    countInStock: 15,
    description:
      'Ceinture en cuir marocain, ornée de broderies traditionnelles. Un accessoire élégant pour compléter votre tenue.',
    sizes: ['S', 'M', 'L'],
    colors: ['Noir', 'Marron'],
    reviews: [],
  },
  // Décorations
  {
    name: 'Plateau en Bois de Thuya ',
    slug: toSlug('Plateau en Bois de Thuya Sculpté'),
    category: 'Décoration',
    images: ['/images/plateau-thuya1.jpg', '/images/plateau-thuya2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 70.0,
    listPrice: 85.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.8,
    numReviews: 9,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 2 },
      { rating: 5, count: 6 },
    ],
    numSales: 15,
    countInStock: 7,
    description:
      'Plateau en bois de thuya marocain, sculpté à la main avec des motifs traditionnels. Parfait pour servir ou décorer.',
    sizes: [],
    colors: ['Marron', 'Noir'],
    reviews: [],
  },
  {
    name: 'Lanternes Marocaines en Métal',
    slug: toSlug('Lanternes Marocaines en Métal'),
    category: 'Décoration',
    images: ['/images/lanterne-metal1.jpg', '/images/lanterne-metal2.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 40.0,
    listPrice: 55.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.7,
    numReviews: 10,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 3 },
      { rating: 5, count: 5 },
    ],
    numSales: 22,
    countInStock: 12,
    description:
      'Lanterne en métal marocain, décorée de motifs traditionnels. Crée une ambiance chaleureuse et accueillante dans votre maison.',
    sizes: [],
    colors: ['Or', 'Argent'],
    reviews: [],
  },
  // Tapis
  {
    name: 'Tapis Beni Ourain',
    slug: toSlug('Tapis Beni Ourain Traditionnel'),
    category: 'Décoration',
    images: ['/images/tapis-beni1.jpg', '/images/tapis-beni2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 250.0,
    listPrice: 300.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.9,
    numReviews: 7,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 2 },
      { rating: 5, count: 4 },
    ],
    numSales: 8,
    countInStock: 5,
    description:
      'Tapis Beni Ourain traditionnel, tissé à la main avec de la laine de haute qualité. Idéal pour ajouter une touche authentique à votre maison.',
    sizes: ['200x300 cm'],
    colors: ['Blanc', 'Noir'],
    reviews: [],
  },
  // Bois de Thuya
  {
    name: 'Boîte en Bois de Thuya',
    slug: toSlug('Boîte en Bois de Thuya Sculptée'),
    category: 'Décoration',
    images: ['/images/boite-thuya1.jpg', '/images/boite-thuya2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 45.0,
    listPrice: 60.0,
    brand: 'Artisanat Marocain',
    avgRating: 4.5,
    numReviews: 6,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 2 },
      { rating: 5, count: 3 },
    ],
    numSales: 10,
    countInStock: 10,
    description:
      'Boîte sculptée en bois de thuya marocain, idéale pour stocker des bijoux ou des objets précieux. Fabriquée à la main.',
    sizes: [],
    colors: ['Marron', 'Noir'],
    reviews: [],
  },
];


const reviews = [
  {
    rating: 1,
    title: 'Poor quality',
    comment:
      'Very disappointed. The item broke after just a few uses. Not worth the money.',
  },
  {
    rating: 2,
    title: 'Disappointed',
    comment:
      "Not as expected. The material feels cheap, and it didn't fit well. Wouldn't buy again.",
  },
  {
    rating: 2,
    title: 'Needs improvement',
    comment:
      "It looks nice but doesn't perform as expected. Wouldn't recommend without upgrades.",
  },
  {
    rating: 3,
    title: 'not bad',
    comment:
      'This product is decent, the quality is good but it could use some improvements in the details.',
  },
  {
    rating: 3,
    title: 'Okay, not great',
    comment:
      'It works, but not as well as I hoped. Quality is average and lacks some finishing.',
  },
  {
    rating: 3,
    title: 'Good product',
    comment:
      'This product is amazing, I love it! The quality is top notch, the material is comfortable and breathable.',
  },
  {
    rating: 4,
    title: 'Pretty good',
    comment:
      "Solid product! Great value for the price, but there's room for minor improvements.",
  },
  {
    rating: 4,
    title: 'Very satisfied',
    comment:
      'Good product! High quality and worth the price. Would consider buying again.',
  },
  {
    rating: 4,
    title: 'Absolutely love it!',
    comment:
      'Perfect in every way! The quality, design, and comfort exceeded all my expectations.',
  },
  {
    rating: 4,
    title: 'Exceeded expectations!',
    comment:
      'Fantastic product! High quality, feels durable, and performs well. Highly recommend!',
  },
  {
    rating: 5,
    title: 'Perfect purchase!',
    comment:
      "Couldn't be happier with this product. The quality is excellent, and it works flawlessly!",
  },
  {
    rating: 5,
    title: 'Highly recommend',
    comment:
      "Amazing product! Worth every penny, great design, and feels premium. I'm very satisfied.",
  },
  {
    rating: 5,
    title: 'Just what I needed',
    comment:
      'Exactly as described! Quality exceeded my expectations, and it arrived quickly.',
  },
  {
    rating: 5,
    title: 'Excellent choice!',
    comment:
      'This product is outstanding! Everything about it feels top-notch, from material to functionality.',
  },
  {
    rating: 5,
    title: "Couldn't ask for more!",
    comment:
      "Love this product! It's durable, stylish, and works great. Would buy again without hesitation.",
  },
]

const data: Data = {
  users,
  products,
  reviews,
  webPages: [
    {
      title: 'About Us',
      slug: 'about-us',
      content: `Welcome to HandTerra, your trusted destination for high-quality Moroccan handcrafted products and exceptional service.
Our mission is to provide the best shopping experience by offering a wide range of unique, handcrafted items at competitive prices on a user-friendly platform.

At HandTerra, customer satisfaction is our priority. We carefully curate a diverse selection, from everyday essentials to exclusive artisan pieces, ensuring there's something for everyone. Enjoy fast shipping, secure payments, and top-notch customer support.

Thank you for choosing HandTerra — we look forward to being part of your journey and delivering value every step of the way.`,
      isPublished: true,
    },
    {
      title: 'Contact Us',
      slug: 'contact-us',
      content: `We’re here to help! If you have any questions, concerns, or feedback, please don’t hesitate to reach out to us. Our team is ready to assist you and ensure you have the best shopping experience.

Customer Support
For inquiries about orders, products, or account-related issues, contact our customer support team:

Email: support@handterra.com
Phone: +212 (123) 456-7890
Live Chat: Available on our website from 9 AM to 6 PM (Monday to Friday).
Head Office
For corporate or business-related inquiries, reach out to our headquarters:

Address: 1234 Artisan St, Suite 567, Essaouira, Morocco
Phone: +212 (987) 654-3210
We look forward to assisting you! Your satisfaction is our priority.
`,
      isPublished: true,
    },
    
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: `We value your privacy and are committed to protecting your personal information. This Privacy Notice explains how we collect, use, and share your data when you interact with our services. By using our platform, you consent to the practices described herein.

We collect data such as your name, email address, and payment details to provide you with personalized services and enhance your experience. This information may also be used for marketing purposes, but only with your consent. Additionally, we may share your data with trusted third-party providers to facilitate transactions or deliver products.

Your data is safeguarded through robust security measures to prevent unauthorized access. However, you have the right to access, correct, or delete your personal information at any time. For inquiries or concerns regarding your privacy, please contact our support team.

.`,
      isPublished: true,
    },
    {
      title: 'Conditions of Use',
      slug: 'conditions-of-use',
      content: `Welcome to HandTerra. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. These terms govern your use of our platform, including browsing, purchasing products, and interacting with any content or services provided. You must be at least 18 years old or have the consent of a parent or guardian to use this website. Any breach of these terms may result in the termination of your access to our platform.

We strive to ensure all product descriptions, pricing, and availability information on our website are accurate. However, errors may occur, and we reserve the right to correct them without prior notice. All purchases are subject to our return and refund policy. By using our site, you acknowledge that your personal information will be processed according to our privacy policy, ensuring your data is handled securely and responsibly. Please review these terms carefully before proceeding with any transactions.


`,
      isPublished: true,
    },
    {
      title: 'Customer Service',
      slug: 'customer-service',
      content: `At HandTerra, our customer service team is here to ensure you have the best shopping experience. Whether you need assistance with orders, product details, or returns, we are committed to providing prompt and helpful support.

If you have questions or concerns, please reach out to us through our multiple contact options:

Email: support@handterra.com
Phone: +212 (123) 456-7890
Live Chat: Available on our website for instant assistance
We also provide helpful resources such as order tracking, product guides, and FAQs to assist you with common inquiries. Your satisfaction is our priority, and we’re here to resolve any issues quickly and efficiently. Thank you for choosing HandTerra.

!`,
      isPublished: true,
    },
    {
      title: 'Returns Policy',
      slug: 'returns-policy',
      content: 'Returns Policy Content',
      isPublished: true,
    },
    
    {
      title: 'Blog',
      slug: 'blog',
      content: 'Blog Content',
      isPublished: true,
    },
    {
      title: 'Sell Products',
      slug: 'sell',
      content: `Sell Products Content`,
      isPublished: true,
    },
    {
      title: 'Become Affiliate',
      slug: 'become-affiliate',
      content: 'Become Affiliate Content',
      isPublished: true,
    },
    {
      title: 'Advertise Your Products',
      slug: 'advertise',
      content: 'Advertise Your Products',
      isPublished: true,
    },
    {
      title: 'Shipping Rates & Policies',
      slug: 'shipping',
      content: 'Shipping Rates & Policies',
      isPublished: true,
    },
  ],
  headerMenus: [
    {
      name: "Categories and Products",
      href: '/search?tag=Categories&Products',
    },
    
    
    
    {
      name: 'Customer Service',
      href: '/page/customer-service',
    },
    {
      name: 'About Us',
      href: '/page/about-us',
    },
   
  ],
  carousels: [
    {
      title: 'Handcrafted Decor: Moroccan Art for Your Home',
      buttonCaption: 'Shop Now',
      image: '/images/banner3.jpg',
      url: '/search?tag=Categories&Products',
      isPublished: true,
    },
    {
      title: 'Handcrafted Clothing: Moroccan Elegance',
      buttonCaption: 'Shop Now',
      image: '/images/banner1.jpg',
      url: '/search?tag=Categories&Products',
      isPublished: true,
    },
    {
      title: 'Handcrafted Jewelry: Art You Can Wear',
      buttonCaption: 'See More',
      image: '/images/banner2.jpg',
      url: '/search?tag=Categories&Products',
      isPublished: true,
    },
  ],
  settings: [
    {
      common: {
        freeShippingMinPrice: 35,
        isMaintenanceMode: false,
        defaultTheme: 'Light',
        defaultColor: 'Gold',
        pageSize: 9,
      },
      site: {
        name: 'HandTerra',
        description:
          'Le site web e-commerce "HandTerra" propose des produits artisanaux faits à la main, mettant en valeur l\'authenticité et le savoir-faire traditionnel..',
        keywords: 'HandTerra',
        url: 'http://localhost:3000',
        logo: '/icons/logo.png',
        slogan: 'HandTerra : Où chaque pièce raconte une histoire !',
        author: 'Artisan du Maroc',
        copyright: '2025,HandTerra',
        email: 'admin@example.com',
        address: 'Essaouira',
        phone: '+212 6 123 456 78',
      },
      carousels: [
        {
          title: 'Handcrafted Clothing: Moroccan Elegance',
          buttonCaption: 'Shop Now',
          image: '/images/banner1.jpg',
          url: '/search?tag=Categories&Products',
        },
        {
          title: 'Handcrafted Decor: Moroccan Art for Your Home',
          buttonCaption: 'Shop Now',
          image: '/images/banner3.jpg',
          url: '/search?tag=Categories&Products',
        },
        {
          title: 'Handcrafted Jewelry: Art You Can Wear',
          buttonCaption: 'See More',
          image: '/images/banner2.jpg',
          url: '/search?tag=Categories&Products',
        },
      ],
      availableLanguages: i18n.locales.map((locale) => ({
        code: locale.code,
        name: locale.name,
      })),
      defaultLanguage: 'en-US',
      availableCurrencies: [
        {
          name: 'Morocco',
          code: 'MAD',
          symbol: 'MAD',
          convertRate: 1,
        },
        { name: 'Euro', code: 'EUR', symbol: '€', convertRate: 0.96 },
        { name: 'Dirham', code: 'MAD', symbol: 'MD', convertRate: 3.67 },
      ],
      defaultCurrency: 'MAD',
      availablePaymentMethods: [
        { name: 'PayPal', commission: 0 },
        { name: 'Stripe', commission: 0 },
        { name: 'Cash On Delivery', commission: 0 },
      ],
      defaultPaymentMethod: 'PayPal',
      availableDeliveryDates: [
        {
          name: 'Tomorrow',
          daysToDeliver: 1,
          shippingPrice: 12.9,
          freeShippingMinPrice: 0,
        },
        {
          name: 'Next 3 Days',
          daysToDeliver: 3,
          shippingPrice: 6.9,
          freeShippingMinPrice: 0,
        },
        {
          name: 'Next 5 Days',
          daysToDeliver: 5,
          shippingPrice: 4.9,
          freeShippingMinPrice: 35,
        },
      ],
      defaultDeliveryDate: 'Next 5 Days',
    },
  ],
}

export default data
