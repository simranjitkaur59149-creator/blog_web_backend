import mongoose from "mongoose";
const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug:{
        type:String,
        required:true,
        index:true,
        unique:true

    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "User",
    },

    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }]
  },
  {
    timestamps: true,
  },
);
//add text index for search
// blogSchema.index({ title: text, content: text });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
