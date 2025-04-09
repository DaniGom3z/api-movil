import express from "express";
import cors from "cors";
import loginRoute from './src/routes/loginRoutes.js';
import registroRoute from './src/routes/registroRoutes.js';
import mealRoute from './src/routes/mealRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use("/login", loginRoute);
app.use("/register", registroRoute);
app.use("/meals", mealRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log('Server running on port', port);
});
