require("dotenv").config();
const http=require("http")


const PORT=process.env.PORT || 3000
const app=require("./app.js")

const server=http.createServer(app)


server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
