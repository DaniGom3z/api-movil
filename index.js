import express from "express";
import cors from "cors";
import loginRoute from './src/routes/loginRoutes.js';
import registroRoute from './src/routes/registroRoutes.js';
import stockRoute from './src/routes/stockRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Use cors middleware
app.use(express.json());

app.use("/login", loginRoute);
app.use("/register", registroRoute);
app.use("/stock", stockRoute);


app.listen(port, () => {
    console.log('Server running on port', port);
});