import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Verifica si el nombre de usuario ya existe
        const existingUser = await prisma.login.findFirst({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // Hashea la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea el nuevo usuario
        const newUser = await prisma.login.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        return res.status(201).json({
            message: "User registered",
            user: { id: newUser.id, email: newUser.email }
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export default register;
