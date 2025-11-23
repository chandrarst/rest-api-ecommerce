const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve products." });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, stock, description } = req.body;

    let photoPath = null;
    if (req.file) {
        photoPath = req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`;
    }

    if (!name || !price || !stock) {
      return res.status(400).json({ error: "Name, price, and stock are required." });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        description,
        photo: photoPath
      }
    });

    res.status(201).json({ 
      message: "Product created successfully.", 
      data: newProduct 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product." });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, description } = req.body;
    
    let newPhoto = undefined;
    if (req.file) {
        newPhoto = req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`;
    }

    const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!product) return res.status(404).json({ error: "Product not found." });

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: name || product.name,
        price: price ? parseFloat(price) : product.price,
        stock: stock ? parseInt(stock) : product.stock,
        description: description || product.description,
        photo: newPhoto || product.photo
      }
    });

    res.json({ message: "Product updated successfully.", data: updatedProduct });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product." });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });

    if (!product) return res.status(404).json({ error: "Product not found." });

    await prisma.product.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: "Cannot delete this product because it has transaction history." });
    }
    res.status(500).json({ error: "Failed to delete product." });
  }
};

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct };