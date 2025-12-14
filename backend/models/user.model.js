const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const userschema=new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:[6,'Email must be at least 6 character long'],
        maxLength:[50,'Email must not be longer than 50 characters']
    },
    password:{
        type:String,
        select:false
    }
},{timestamps:true})


userschema.statics.hashPassword=async function (password){
    return await bcrypt.hash(password,10)  
}

userschema.methods.isValidPassword=async function (password){
    return await bcrypt.compare(password,this.password)  
}

userschema.methods.generateJwt= function (){
    return jwt.sign({_id: this._id,email:this.email},process.env.JWT_SECRET,{expiresIn:'24h'})
}

module.exports=mongoose.model("User",userschema)