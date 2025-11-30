const express=require("express")
const morgan=require("morgan")
const connectDB=require("./config/db")
const userRoute=require("./routes/user.route")
const cookieParser=require("cookie-parser")
const cors=require("cors")
connectDB()

const app=express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.use('/users', userRoute);
app.get("/",(req,res)=>{
    res.send("Hello world")
})

module.exports=app;