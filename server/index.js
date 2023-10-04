import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; //mw //for file handling //uploads//via POST requests.....
import helmet from "helmet"; //mw // for security
import morgan from "morgan"; //mw //logging HTTP request
import path from "path";
import { fileURLToPath } from "url";

import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";

/*configurations bcz in package.json type:"module" => so we can use import */
const __filename = fileURLToPath(import.meta.url); //url of current module
const __dirname = path.dirname(__filename);

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { verifyToken } from "./middleware/auth.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

//middleware for routes : '/assets/....'=> to serve static files like img stored in public/assets //storing locally
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/*FILE STORAGE*/ //SAVING FILES using multer in "public/assets" file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    syncBuiltinESMExports(null, file.originalname);
  },
});
const upload = multer({ storage });

/*  ROUTES with files */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

//above routes is mentioned directly bcz of 'upload'
/*ROUTES*/
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/*MONGOOSE SETUP*/
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port : ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect `));
