const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Shopping cart is empty!" });
    }

    const result = await prisma.$transaction(async (prisma) => {
      let totalPrice = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product '${product.name}'. Remaining: ${product.stock}`);
        }

        totalPrice += product.price * item.quantity;

        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity }
        });

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price
        });
      }

      const newOrder = await prisma.order.create({
        data: {
          userId: userId,
          totalPrice: totalPrice,
          status: "PAID",
          items: {
            create: orderItemsData
          }
        },
        include: { items: true }
      });

      return newOrder;
    });

    res.status(201).json({ 
      message: "Transaction successful!", 
      data: result 
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || "Transaction failed." });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { userId: userId },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ data: orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve orders." });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const order = await prisma.order.findFirst({
      where: { id: parseInt(id), userId: userId },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    if (order.status !== 'PENDING' && order.status !== 'PAID') {
      return res.status(400).json({ error: "Cannot cancel an order that has been processed." });
    }

    await prisma.$transaction(async (prisma) => {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity }
          }
        });
      }

      await prisma.order.update({
        where: { id: parseInt(id) },
        data: { status: 'CANCELLED' }
      });
    });

    res.json({ message: "Order cancelled and stock restored." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to cancel order." });
  }
};

module.exports = { createOrder, getMyOrders, cancelOrder };