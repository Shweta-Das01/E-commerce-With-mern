//cd "C:\Users\Lenovo\OneDrive\Desktop\Node_js Ecommerce API"
import  http from 'http';
import dotenv from "dotenv";
import app from './app/app.js';

dotenv.config();
//create the server
const PORT=process.env.PORT || 7000;
const server=http.createServer(app)
server.listen(PORT,console.log(`Server is up and running on port ${PORT}`));

//AKIA2ZIONFWNFEIP2Z7R->apikey
//ld31V2LkU0X+9iuGs/JaAfSIyWd/WS+bFiXadPdE->secretkey