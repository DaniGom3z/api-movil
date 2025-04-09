import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createMeal = async (req, res) => {
  try {
    const { title, description, imageUrl, calories, nutritionalRating, userId } = req.body;

    // Validación básica
    if (!title || !calories || nutritionalRating === undefined || !userId) {
      return res.status(400).json({ message: "Title, calories, nutritional rating and userId are required" });
    }

    // Control de duplicados: no permitir dos comidas con el mismo título en el mismo día
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingMeal = await prisma.meal.findFirst({
      where: {
        title,
        userId,
        recordedAt: {
          gte: todayStart,
          lt: todayEnd
        }
      }
    });
    if (existingMeal) {
      return res.status(409).json({ message: "Meal already registered today with this title" });
    }

    const newMeal = await prisma.meal.create({
      data: {
        title,
        description,
        imageUrl,
        calories,
        nutritionalRating,
        user: {
          connect: { id: userId }
        }
      }
    });
    return res.status(201).json([newMeal]);
} catch (error) {
    console.error("Error creating meal:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getMeals = async (req, res) => {
  try {
    // Obtén el userId ya sea como parámetro de query o del body.
    // En este ejemplo lo esperamos en query parameters.
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const meals = await prisma.meal.findMany({
      where: { userId: Number(userId) },
      orderBy: { recordedAt: 'desc' }
    });
    return res.status(200).json({ meals });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, calories, nutritionalRating, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Verificar que la comida existe y pertenece al usuario
    const meal = await prisma.meal.findUnique({
      where: { id: Number(id) }
    });

    if (!meal || meal.userId !== userId) {
      return res.status(404).json({ message: "Meal not found or you don't have permission to update it" });
    }

    const updatedMeal = await prisma.meal.update({
      where: { id: Number(id) },
      data: { title, description, imageUrl, calories, nutritionalRating }
    });
    return res.status(200).json({ message: "Meal updated successfully", meal: updatedMeal });
  } catch (error) {
    console.error("Error updating meal:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Verificar que la comida existe y pertenece al usuario
    const meal = await prisma.meal.findUnique({
      where: { id: Number(id) }
    });

    if (!meal || meal.userId !== userId) {
      return res.status(404).json({ message: "Meal not found or you don't have permission to delete it" });
    }

    await prisma.meal.delete({
      where: { id: Number(id) }
    });
    return res.status(200).json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Error deleting meal:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
