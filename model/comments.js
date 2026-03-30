import mongoose from "mongoose"
const commentSchema=mongoose.Schema([
    {
        content:{type:String},
        author:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"User"},
        blog:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"Blog"},
    },
    {
        timestamps:true
    }
])