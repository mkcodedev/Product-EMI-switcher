import mongoose from 'mongoose';

const emiPlanSchema = new mongoose.Schema({
  monthlyAmount: { type: Number, required: true, min: 1 },
  tenureMonths: { type: Number, required: true, min: 1 },
  interestRate: { type: Number, required: true, min: 0 },
  cashback: { type: Number, default: 0, min: 0 }
});

const variantSchema = new mongoose.Schema({
  storage: { type: String, required: true, trim: true },
  ram: { type: String, default: '', trim: true },
  colorName: { type: String, required: true, trim: true },
  colorHex: { type: String, required: true, trim: true },
  mrp: { type: Number, required: true, min: 1 },
  sellingPrice: { type: Number, required: true, min: 1 },
  images: {
    type: [String],
    validate: [val => val.length >= 1, 'Each variant requires at least one image']
  },
  stock: { type: Number, default: 10, min: 0 },
  emiPlans: {
    type: [emiPlanSchema],
    validate: [val => val.length >= 1, 'Each variant must contain at least 1 EMI plan']
  }
});

const reviewSchema = new mongoose.Schema({
  author: { type: String, default: 'Verified Buyer' },
  city: { type: String, default: 'Mumbai' },
  rating: { type: Number, default: 5 },
  comment: { type: String, required: true },
  verified: { type: Boolean, default: true },
  date: { type: String, default: '1 month ago' }
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    brand: { type: String, required: true, trim: true },
    tag: { type: String, default: 'NEW', trim: true },
    sellerName: { type: String, default: 'Balaji Infocom' },
    shippingDays: { type: String, default: 'Dispatch in less than 48 hours and delivery in 3-7 working days after dispatch' },
    ratingAverage: { type: Number, default: 4.8 },
    ratingCount: { type: Number, default: 704 },
    description: { type: String, required: true, trim: true },
    specifications: {
      storageDetails: { type: String, default: '' },
      screenSize: { type: String, default: '' },
      frontCamera: { type: String, default: '' },
      rearCamera: { type: String, default: '' },
      processor: { type: String, default: '' },
      battery: { type: String, default: '' }
    },
    reviews: {
      type: [reviewSchema],
      default: [
        {
          author: 'Anuradha Doshi',
          city: 'Mumbai',
          rating: 5,
          comment: 'This is a great support by team for this product is fantastic thanks',
          verified: true,
          date: '4 months ago'
        },
        {
          author: 'Jayalaxmi Arigela',
          city: 'Tenkasi',
          rating: 5,
          comment: 'Good smartphone experience. Timely delivery and zero hassle EMI verification.',
          verified: true,
          date: '6 months ago'
        }
      ]
    },
    variants: {
      type: [variantSchema],
      validate: [val => val.length >= 2, 'Product must contain at least 2 variants']
    }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);