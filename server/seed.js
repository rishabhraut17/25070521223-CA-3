require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const sampleProducts = [
  // ==========================================
  // MEN COLLECTION (10+ Garments)
  // ==========================================
  {
    name: 'THRUST Heavyweight Oversized Boxy Tee',
    slug: 'thrust-heavyweight-oversized-boxy-tee',
    description: 'Constructed from 280 GSM combed organic cotton. Features drop-shoulder silhouette, thick ribbed collar, and reinforced flatlock stitching.',
    category: 'Men',
    price: 1499,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: ['Prussian Black', 'Chalk White', 'Charcoal Slate'],
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'French Terry 440 GSM Relaxed Pullover Hoodie',
    slug: 'french-terry-440-gsm-relaxed-pullover-hoodie',
    description: 'Ultra-dense 440 GSM loopback cotton fleece with double-panel structured hood, concealed kangaroo pocket, and heavy ribbed hems.',
    category: 'Men',
    price: 2999,
    sizes: ['M', 'L', 'XL'],
    colours: ['Midnight Navy', 'Ash Heather', 'Pitch Black'],
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'Modular Tactical Relaxed Cargo Pants',
    slug: 'modular-tactical-relaxed-cargo-pants',
    description: 'Ripstop cotton utility trousers with bellows cargo pockets, ergonomic articulated knee darting, and toggle-cinched ankle hems.',
    category: 'Men',
    price: 3299,
    sizes: ['30', '32', '34', '36'],
    colours: ['Military Olive', 'Obsidian Black'],
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'Architectural Wide-Leg Pleated Trousers',
    slug: 'architectural-wide-leg-pleated-trousers',
    description: 'Contemporary drape in crease-resistant wool blend with deep front double pleats, slanted pockets, and clean blind hems.',
    category: 'Men',
    price: 3499,
    sizes: ['30', '32', '34', '36'],
    colours: ['Deep Charcoal', 'Espresso Brown'],
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Structured Pinpoint Oxford Button-Down',
    slug: 'structured-pinpoint-oxford-button-down',
    description: 'Premium tailored Oxford weave shirt with neat mother-of-pearl buttons, curved hem, and relaxed contemporary fit.',
    category: 'Men',
    price: 2299,
    sizes: ['S', 'M', 'L', 'XL'],
    colours: ['Sky Blue', 'Crisp White', 'Pale Gray'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Matte Nylon Reversible MA-1 Flight Bomber',
    slug: 'matte-nylon-reversible-ma-1-flight-bomber',
    description: 'Water-repellent technical nylon shell insulated with recycled polyester loft. Brass heavy-duty front zipper and ribbed collar.',
    category: 'Men',
    price: 4999,
    sizes: ['M', 'L', 'XL'],
    colours: ['Sage Green', 'Carbon Black'],
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'Vintage Wash 14oz Denim Trucker Jacket',
    slug: 'vintage-wash-14oz-denim-trucker-jacket',
    description: '100% rigid cotton selvedge denim jacket with custom shank hardware, dual chest flap pockets, and waist adjusters.',
    category: 'Men',
    price: 3899,
    sizes: ['S', 'M', 'L', 'XL'],
    colours: ['Faded Indigo', 'Washed Charcoal'],
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Chunky Ribbed Mock-Neck Knit Pullover',
    slug: 'chunky-ribbed-mock-neck-knit-pullover',
    description: 'Heavyweight lambswool blend knitted in an architectural fisherman rib. Provides superior natural thermal insulation.',
    category: 'Men',
    price: 3699,
    sizes: ['M', 'L', 'XL'],
    colours: ['Sand Taupe', 'Navy Blue'],
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Relaxed Tailored Bermuda Chino Shorts',
    slug: 'relaxed-tailored-bermuda-chino-shorts',
    description: 'Breathable cotton stretch twill knee-length shorts with clean trouser waistline, back welt pockets, and deep front pockets.',
    category: 'Men',
    price: 1899,
    sizes: ['30', '32', '34'],
    colours: ['Khaki Tan', 'Midnight Navy'],
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Minimalist Storm-Proof Technical Mac Coat',
    slug: 'minimalist-storm-proof-technical-mac-coat',
    description: 'Sleek waterproof 3-layer bonded shell coat with concealed button placket, taped seams, and interior zippered passport pocket.',
    category: 'Men',
    price: 6499,
    sizes: ['M', 'L', 'XL'],
    colours: ['Jet Black', 'Slate Khaki'],
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },

  // ==========================================
  // WOMEN COLLECTION (10+ Garments)
  // ==========================================
  {
    name: 'Pure Flax Linen Flowing Midi Slip Dress',
    slug: 'pure-flax-linen-flowing-midi-slip-dress',
    description: '100% natural European flax linen. Soft A-line cut with side leg slits, seam pockets, and an elegant square neckline.',
    category: 'Women',
    price: 3499,
    sizes: ['XS', 'S', 'M', 'L'],
    colours: ['Terracotta', 'Natural Oat', 'Olive Sage'],
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'CloudSoft Australian Merino Ribbed Knit',
    slug: 'cloudsoft-australian-merino-ribbed-knit',
    description: 'Spun from ultra-fine Australian merino wool. Mock-neck silhouette with dropped sleeves and deep ribbed trims.',
    category: 'Women',
    price: 3999,
    sizes: ['XS', 'S', 'M', 'L'],
    colours: ['Cream White', 'Soft Heather Gray', 'Camel'],
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'High-Rise Rigid Wide-Leg 90s Denim',
    slug: 'high-rise-rigid-wide-leg-90s-denim',
    description: '13.5 oz authentic organic cotton denim. High waist fit with full-length roomy legs and vintage washed finish.',
    category: 'Women',
    price: 2999,
    sizes: ['26', '28', '30', '32'],
    colours: ['Vintage Light Indigo', 'Washed Black'],
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'Fluid Mulberry Silk Touch Camisole',
    slug: 'fluid-mulberry-silk-touch-camisole',
    description: 'Delicate luster woven with a gentle fluid drape. Adjustable delicate straps and double-lined chest panel.',
    category: 'Women',
    price: 1799,
    sizes: ['XS', 'S', 'M', 'L'],
    colours: ['Ivory Pearl', 'Midnight Black', 'Blush Champagne'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Relaxed Double-Breasted Wool Blend Blazer',
    slug: 'relaxed-double-breasted-wool-blend-blazer',
    description: 'Effortless structured tailoring with peak lapels, padded shoulders, welt pockets, and interior satin lining.',
    category: 'Women',
    price: 5499,
    sizes: ['S', 'M', 'L'],
    colours: ['Espresso Brown', 'Oatmeal Tweed'],
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'Organic Cotton Everyday Tiered Day Dress',
    slug: 'organic-cotton-everyday-tiered-day-dress',
    description: 'Soft mid-weight jersey cotton with tiered skirt cut and hidden deep side seam pockets for casual weekend ease.',
    category: 'Women',
    price: 2499,
    sizes: ['S', 'M', 'L', 'XL'],
    colours: ['Sage Mist', 'Navy Blue'],
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'High-Waist Tailored Pleated Wide Palazzo',
    slug: 'high-waist-tailored-pleated-wide-palazzo',
    description: 'Flowing drape with front double tuck pleats, clean hook closure, and wide airy trouser silhouette.',
    category: 'Women',
    price: 2899,
    sizes: ['26', '28', '30'],
    colours: ['Sand Taupe', 'Black'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Minimalist Boxy Heavyweight Cropped Tee',
    slug: 'minimalist-boxy-heavyweight-cropped-tee',
    description: '240 GSM organic cotton with boxy silhouette that sits right at the natural waistline. Bound crew neck.',
    category: 'Women',
    price: 1299,
    sizes: ['XS', 'S', 'M', 'L'],
    colours: ['Chalk White', 'Pitch Black', 'Lilac'],
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Brushed Cashmere Touch Wrap Cardigan',
    slug: 'brushed-cashmere-touch-wrap-cardigan',
    description: 'Soft cloud-knit wrap sweater with elongated self-tie belt, raglan sleeves, and deep ribbed cuffs.',
    category: 'Women',
    price: 3699,
    sizes: ['S', 'M', 'L'],
    colours: ['Dusty Rose', 'Charcoal Gray'],
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Double-Layered Classic Cotton Trench Coat',
    slug: 'double-layered-classic-cotton-trench-coat',
    description: 'Water-resistant gabardine cotton classic coat with storm flap, buckled wrist tabs, and removable waist belt.',
    category: 'Women',
    price: 6999,
    sizes: ['S', 'M', 'L'],
    colours: ['Honey Beige', 'Navy'],
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },

  // ==========================================
  // KIDS COLLECTION (10+ Garments)
  // ==========================================
  {
    name: 'Organic Cotton Kids Dinosaur Print Tee',
    slug: 'organic-cotton-kids-dinosaur-print-tee',
    description: 'GOTS certified organic cotton shirt with tagless neck label and durable double stitched flatlock seams.',
    category: 'Kids',
    price: 899,
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    colours: ['Sky Blue', 'Sunny Yellow'],
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'Cozy Plush Fleece Zip-Up Hoodie for Kids',
    slug: 'cozy-plush-fleece-zip-up-hoodie-for-kids',
    description: 'Plush brushed fleece interior with smooth zipper guard to prevent chafing. Easy-pull rubber zipper tab.',
    category: 'Kids',
    price: 1499,
    sizes: ['4Y', '6Y', '8Y', '10Y', '12Y'],
    colours: ['Heather Gray', 'Forest Green', 'Dusty Rose'],
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'Kids Everyday Stretch Comfort Joggers',
    slug: 'kids-everyday-stretch-comfort-joggers',
    description: 'Reinforced knee patches for playground durability, flexible elastic drawstring waistband, and deep front pockets.',
    category: 'Kids',
    price: 1199,
    sizes: ['4Y', '6Y', '8Y', '10Y'],
    colours: ['Navy Blue', 'Charcoal'],
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Kids Puffer Waterproof Hooded Winter Parka',
    slug: 'kids-puffer-waterproof-hooded-winter-parka',
    description: 'Thermal down-alternative loft insulation with reflective safety piping and fleece-lined handwarmer pockets.',
    category: 'Kids',
    price: 2599,
    sizes: ['5-6Y', '7-8Y', '9-10Y', '11-12Y'],
    colours: ['Mustard Gold', 'Deep Navy'],
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'Kids Breathable Active Mesh Sports Shorts',
    slug: 'kids-breathable-active-mesh-sports-shorts',
    description: 'Dual layer moisture-wicking athletic shorts built for sports, outdoor activities, and warm summer days.',
    category: 'Kids',
    price: 799,
    sizes: ['4Y', '6Y', '8Y', '10Y'],
    colours: ['Royal Blue', 'Black'],
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Kids Twill Button-Front Utility Overalls',
    slug: 'kids-twill-button-front-utility-overalls',
    description: 'Charming vintage-inspired woven cotton twill dungarees with adjustable shoulder buckles and contrast stitching.',
    category: 'Kids',
    price: 1699,
    sizes: ['3Y', '4Y', '5Y', '6Y'],
    colours: ['Caramel Tan', 'Denim Wash'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Kids Breton Striped Long-Sleeve Cotton Shirt',
    slug: 'kids-breton-striped-long-sleeve-cotton-shirt',
    description: 'Heavy 200 GSM nautical striped combed cotton with drop-needle neck rib and flat seams.',
    category: 'Kids',
    price: 999,
    sizes: ['4Y', '6Y', '8Y', '10Y'],
    colours: ['Navy / White', 'Red / White'],
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Kids Soft Ribbed Lounge 2-Piece Pajama Set',
    slug: 'kids-soft-ribbed-lounge-2-piece-pajama-set',
    description: 'Ultra-gentle modal rib sleep set including long sleeve crew and tapered matching bottoms with soft waistband.',
    category: 'Kids',
    price: 1399,
    sizes: ['3Y', '5Y', '7Y', '9Y'],
    colours: ['Oatmeal', 'Sage Green'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Kids Sherpa-Lined Denim Trucker Jacket',
    slug: 'kids-sherpa-lined-denim-trucker-jacket',
    description: 'Warm faux-shearling fleece body lining with easy snap button closures for little hands.',
    category: 'Kids',
    price: 2199,
    sizes: ['4Y', '6Y', '8Y', '10Y'],
    colours: ['Medium Denim Blue'],
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Kids Chunky Knit Pom-Pom Beanie & Mittens',
    slug: 'kids-chunky-knit-pom-pom-beanie-mittens',
    description: 'Soft itch-free acrylic cable knit set with fluffy faux fur pom and fleece-lined mittens.',
    category: 'Kids',
    price: 899,
    sizes: ['One Size (Kids)'],
    colours: ['Cream', 'Dusty Blue'],
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },

  // ==========================================
  // ACCESSORIES COLLECTION (10+ Items)
  // ==========================================
  {
    name: 'Water-Resistant 500D Cordura Crossbody Bag',
    slug: 'water-resistant-500d-cordura-crossbody-bag',
    description: 'Constructed with genuine 500D ballistic Cordura nylon. Dual zippered compartments, key clip, and quick-release magnetic buckle strap.',
    category: 'Accessories',
    price: 1899,
    sizes: ['One Size'],
    colours: ['Matte Black', 'Coyote Tan', 'Olive Drab'],
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'Chunky 100% Merino Wool Fisherman Beanie',
    slug: 'chunky-100-merino-wool-fisherman-beanie',
    description: 'Chunky 100% fine merino wool knit. Shallow-cuff fisherman fit that provides warmth without itchiness.',
    category: 'Accessories',
    price: 1199,
    sizes: ['One Size'],
    colours: ['Coal Black', 'Heather Gray', 'Burnt Orange'],
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'Full Grain Vegetable-Tanned Leather Belt',
    slug: 'full-grain-vegetable-tanned-leather-belt',
    description: '3.5cm wide artisanal bridle leather belt with solid brushed stainless steel buckle and beveled hand-painted edges.',
    category: 'Accessories',
    price: 2199,
    sizes: ['32', '34', '36', '38'],
    colours: ['Cognac Brown', 'Pitch Black'],
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Handcrafted Polarized Tortoise Sunglasses',
    slug: 'handcrafted-polarized-tortoise-sunglasses',
    description: 'Handcrafted Italian cellulose acetate frames with UV400 category 3 polarized lenses and 5-barrel hinges.',
    category: 'Accessories',
    price: 2699,
    sizes: ['One Size'],
    colours: ['Amber Tortoise', 'Matte Black'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  },
  {
    name: 'Heavy 16oz Organic Canvas Utility Tote',
    slug: 'heavy-16oz-organic-canvas-utility-tote',
    description: '16 oz rugged cotton duck canvas. Reinforced box-stitch handles, inner zippered valuables pocket, and flat bottom gusset.',
    category: 'Accessories',
    price: 1399,
    sizes: ['One Size'],
    colours: ['Natural Off-White', 'Army Green'],
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Cushioned Combed Cotton Crew Socks (3-Pack)',
    slug: 'cushioned-combed-cotton-crew-socks-3-pack',
    description: 'Anatomical arch support band, reinforced heel, and seamless toe closure. Set contains 3 essential monochromatic pairs.',
    category: 'Accessories',
    price: 899,
    sizes: ['M (6-9)', 'L (9-12)'],
    colours: ['Monochrome Trio (Black, White, Gray)'],
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Minimalist RFID-Blocking Leather Cardholder',
    slug: 'minimalist-rfid-blocking-leather-cardholder',
    description: 'Slim profile top-grain leather sleeve holding up to 8 cards and cash with electromagnetic shielding protection.',
    category: 'Accessories',
    price: 1299,
    sizes: ['One Size'],
    colours: ['Obsidian Black', 'Tan'],
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Vacuum-Insulated Matte Stainless Flask 750ml',
    slug: 'vacuum-insulated-matte-stainless-flask-750ml',
    description: 'Double-wall food grade 18/8 stainless steel keeps liquids chilled 24h or hot 12h. Leak-proof loop cap.',
    category: 'Accessories',
    price: 1599,
    sizes: ['750ml'],
    colours: ['Matte Black', 'Brushed Steel'],
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Pure Mulberry Silk Bandana / Neck Scarf',
    slug: 'pure-mulberry-silk-bandana-neck-scarf',
    description: '16 momme pure silk twill featuring hand-rolled edges and subtle tonal geometric border motifs.',
    category: 'Accessories',
    price: 1799,
    sizes: ['55cm x 55cm'],
    colours: ['Navy Monogram', 'Ivory'],
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
    ],
    featured: false
  },
  {
    name: 'Oversized Brushed Cashmere Fringe Scarf',
    slug: 'oversized-brushed-cashmere-fringe-scarf',
    description: 'Generously proportioned 200cm x 70cm brushed cashmere scarf finished with twisted artisanal fringe.',
    category: 'Accessories',
    price: 2999,
    sizes: ['One Size'],
    colours: ['Charcoal Gray', 'Oatmeal', 'Midnight Navy'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flexi_store';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected to MongoDB.');

    // Clear existing collections safely
    console.log('[Seed] Clearing existing collections...');
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await User.deleteMany({});

    // 1. Create Admin Account from environment variables
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@flexi.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';

    console.log(`[Seed] Creating Administrator account: ${adminEmail}`);
    const adminUser = await User.create({
      name: 'THRUST Administrator',
      email: adminEmail,
      passwordHash: adminPassword,
      role: 'admin',
      phone: '+91 98765 43210',
      addresses: [
        {
          fullName: 'THRUST HQ',
          phone: '+91 98765 43210',
          street: 'Block 4, Fashion District',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          isDefault: true
        }
      ]
    });

    // 2. Create Demo Customer Account
    console.log('[Seed] Creating Demo Customer account: customer@flexi.com');
    const customerUser = await User.create({
      name: 'Rishabh Raut',
      email: 'customer@flexi.com',
      passwordHash: 'CustomerPass123!',
      role: 'customer',
      phone: '+91 91234 56789',
      addresses: [
        {
          fullName: 'Rishabh Raut',
          phone: '+91 91234 56789',
          street: 'Flat 402, Skyline Towers',
          city: 'Pune',
          state: 'Maharashtra',
          postalCode: '411001',
          isDefault: true
        }
      ]
    });

    // 3. Insert 40 Sample Clothing Products (10 Men, 10 Women, 10 Kids, 10 Accessories)
    console.log(`[Seed] Inserting ${sampleProducts.length} clothing products in Rs...`);
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`[Seed] Successfully inserted ${createdProducts.length} products.`);

    // 4. Create sample initial order for Demo Customer
    const p1 = createdProducts[0];
    const p2 = createdProducts[10];

    await Order.create({
      user: customerUser._id,
      items: [
        {
          product: p1._id,
          name: p1.name,
          price: p1.price,
          size: 'L',
          colour: 'Prussian Black',
          quantity: 2,
          image: p1.images[0]
        },
        {
          product: p2._id,
          name: p2.name,
          price: p2.price,
          size: 'M',
          colour: 'Natural Oat',
          quantity: 1,
          image: p2.images[0]
        }
      ],
      shippingAddress: {
        fullName: 'Rishabh Raut',
        phone: '+91 91234 56789',
        street: 'Flat 402, Skyline Towers',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411001'
      },
      paymentMethod: 'Cash on Delivery',
      totalAmount: p1.price * 2 + p2.price,
      status: 'Processing'
    });

    console.log('\n============================================================');
    console.log(' [SEED COMPLETED SUCCESSFULLY!]');
    console.log(` Brand:                 THRUST`);
    console.log(` Total Products Seeded: ${createdProducts.length} (At least 10 in every collection)`);
    console.log(` Currency:              Rs (₹ / INR)`);
    console.log(` Admin Account:         ${adminEmail}`);
    console.log(` Customer Account:      customer@flexi.com`);
    console.log('============================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n[Seed Error] Failed to seed database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
