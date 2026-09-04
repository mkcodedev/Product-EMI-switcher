import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: products });
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving products' });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug: slug.toLowerCase().trim() });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ data: product });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching product details' });
  }
};

export const getFieldSuggestions = async (req, res) => {
  try {
    const products = await Product.find().lean();
    const brands = new Set();
    const tags = new Set();
    const storages = new Set();
    const rams = new Set();
    const colorNames = new Set();
    const colorHexes = new Set();

    products.forEach((p) => {
      if (p.brand) brands.add(p.brand);
      if (p.tag) tags.add(p.tag);
      p.variants?.forEach((v) => {
        if (v.storage) storages.add(v.storage);
        if (v.ram) rams.add(v.ram);
        if (v.colorName) colorNames.add(v.colorName);
        if (v.colorHex) colorHexes.add(v.colorHex);
      });
    });

    return res.status(200).json({
      brands: Array.from(brands),
      tags: Array.from(tags),
      storages: Array.from(storages),
      rams: Array.from(rams),
      colorNames: Array.from(colorNames),
      colorHexes: Array.from(colorHexes)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving suggestions' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, slug, brand, tag, sellerName, shippingDays, description, specifications, variants } = req.body;

    if (!name || !slug || !brand || !description) {
      return res.status(400).json({ message: 'Required details missing' });
    }

    if (!variants || variants.length < 2) {
      return res.status(400).json({ message: 'A minimum of 2 variants is required' });
    }

    for (let i = 0; i < variants.length; i++) {
      if (!variants[i].emiPlans || variants[i].emiPlans.length === 0) {
        return res.status(400).json({ message: `Variant #${i + 1} must include at least 1 EMI plan` });
      }
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const existing = await Product.findOne({ slug: cleanSlug });
    if (existing) {
      return res.status(409).json({ message: 'Product with this slug already exists' });
    }

    const product = await Product.create({
      name,
      slug: cleanSlug,
      brand,
      tag: tag || 'NEW',
      sellerName: sellerName || 'Balaji Infocom',
      shippingDays: shippingDays || 'Dispatch in less than 48 hours and delivery in 3-7 working days after dispatch',
      description,
      specifications,
      variants
    });

    return res.status(201).json({ message: 'Product created successfully', data: product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, brand, tag, sellerName, shippingDays, description, specifications, variants } = req.body;

    if (!variants || variants.length < 2) {
      return res.status(400).json({ message: 'A minimum of 2 variants is strictly required' });
    }

    for (let i = 0; i < variants.length; i++) {
      if (!variants[i].emiPlans || variants[i].emiPlans.length === 0) {
        return res.status(400).json({ message: `Variant #${i + 1} must include at least 1 EMI plan` });
      }
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const existing = await Product.findOne({ slug: cleanSlug, _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ message: 'Another product with this slug already exists' });
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug: cleanSlug,
        brand,
        tag: tag || 'NEW',
        sellerName,
        shippingDays,
        description,
        specifications,
        variants
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product updated successfully', data: updated });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting product' });
  }
};