import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear un producto
const createProduct = async (req, res) => {
    const { name, quantity, price } = req.body;

    try {
        if (!name || quantity == null || price == null) {
            return res.status(400).json({ error: "Name, quantity, and price are required" });
        }

        const createdProduct = await prisma.product.create({
            data: {
                name: name,
                quantity: parseInt(quantity),
                price: parseFloat(price),
            },
        });

        return res.status(201).json({ message: "Producto creado exitosamente", product: createdProduct });
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        await prisma.$disconnect();
    }
};

// Leer todos los productos
const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        await prisma.$disconnect();
    }
};

// Leer un producto por ID
const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await prisma.product.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        await prisma.$disconnect();
    }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, quantity, price } = req.body;

    try {
        const updatedProduct = await prisma.product.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name: name,
                quantity: quantity != null ? parseInt(quantity) : undefined,
                price: price != null ? parseFloat(price) : undefined,
            },
        });

        return res.status(200).json({ message: "Producto actualizado correctamente", product: updatedProduct });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        return res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        await prisma.$disconnect();
    }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await prisma.product.delete({
            where: {
                id: parseInt(id),
            },
        });

        return res.status(200).json({ message: "Producto eliminado correctamente", product: deletedProduct });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        return res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        await prisma.$disconnect();
    }
};

export default {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
