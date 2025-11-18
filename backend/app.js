const express=require("express")
const morgan=require("morgan")
const connectDB=require("./config/db")
connectDB()

const app=express();

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}));


app.get("/",(req,res)=>{
    res.send("Hello world")
})

module.exports=app;