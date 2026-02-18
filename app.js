require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Server } = require("socket.io");

const { SystemModel } = require('./models/systemModel');
const { System } = require('./controllers/system');
const { db } = require('./configs/db');

const app = express();
app.use(cors());
app.use(express.json());

const server = require("http").createServer(app);

// --- WebSocket ---
const io = new Server(server, {
  cors: { origin: "*" } // accepte toutes les connexions
});

// Tableau pour stocker les sockets connectés (optionnel)
let sockets = [];

io.on("connection", (socket) => {
  console.log("Un appareil s'est connecté :", socket.id);
  sockets.push(socket);

  socket.on("disconnect", () => {
    console.log("Appareil déconnecté :", socket.id);
    sockets = sockets.filter(s => s.id !== socket.id);
  });
});

// --- Controller ---
const systemModel = new SystemModel(db);

// On injecte io dans le controller pour émettre aux sockets
const system = new System(systemModel, io);

// --- Routes HTTP (optionnelles, pour test) ---
app.get("/",(req,res)=>{res.json({"message":"Bienvenue sur API de securax"})});
app.post("/add/arrive", system.addArr.bind(system));
app.post("/add/depart", system.addDep.bind(system));
app.post("/add/depart/intrus", system.addDepIntrus.bind(system));
app.post("/add/arrive/intrus", system.addArrIntrus.bind(system));
app.post("/add/histo", system.getHistorique.bind(system));
app.post("/add/user", system.addUser.bind(system));
app.get("/getAll/user", system.getAllUser.bind(system));

// --- Lancement serveur ---
server.listen(process.env.PORT, () => {
  console.log("Serveur WebSocket/HTTP sur port", process.env.PORT);
});
