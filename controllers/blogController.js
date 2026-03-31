import Blog from "../model/blog.js";

const slugify = (text) => {
  return text

    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};
//get all the blogs
export const getBlogs = async (req, res, next) => {
  try {
    const pageSize = 9;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Blog.countDocuments();
    const blog = await Blog.find({})
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize);
    res.json({
      currentPage: page,
      totalBlogs: count,
      blog,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
    next();
  }
};
//get blogs by slug which means a user friendly url read by us easily
export const getBlogsBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate(
      "author",
      "name email",
    );
    if (blog) {
      return res.status(200).json(blog);
    } else {
      return res.status(404).json({ error: "Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};
//get blog by id
export const getBlogsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    res.json(blog);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};
//get all blogs of a specific user
export const getAllBlogsById = async (req, res, next) => {
  try {
    const  userid = req.user._id;
    const blog = await Blog.find({ author: userid });
    res.json({posts:blog});
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};
// create blog
export const createBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;
     console.log("BODY:", req.body);
    console.log("USER:", req.user);
    if (!title || !content) {
      return res.status(400).json({ message: "Fields are missing" });
    }
    //generate slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    //find same topic blog exists
    let blogExists = await Blog.findOne({ slug });
    let counter = 1;
    while (blogExists) {
      slug = `${baseSlug}-${counter}`;
      counter++;
      blogExists = await Blog.findOne({ slug });
    }

    //create a blog
    const blog = new Blog({
      title,
      slug,
      content,
      author: req.user._id,
    });
    const newBlog = await blog.save();
    return res.status(201).json({ success: true, newBlog });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: error.message });
  }
};
//update existing blog
export const updateBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findOne({ _id: req.params.id });
    if (!blog) {
      return res.json({ message: "Blog is not Exists" });
    }
    console.log("Blog Author:", blog.author, "User ID:", req.user?._id)
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update" });
    }
    let newtitle = title || blog.title;
    let newContent = content || blog.content;
    let newSlug = blog.slug;
    if (title && title !== blog.title) {
      const baseSlug = slugify(newtitle);
      let slug = baseSlug;

      let slugExists = await Blog.findOne({
        slug,
        _id: { $ne: blog._id }, // exclude current blog
      });
      let counter = 1;
      while (slugExists) {
        slug = `${baseSlug}-${counter}`;
        counter++;
        slugExists = await Blog.findOne({
          slug,
          _id: { $ne: blog._id }, // exclude current blog
        });
      }
      newSlug = slug;
    }
   
   

    const updateBlog = await Blog.findByIdAndUpdate(req.params.id,{title:newtitle,content:newContent,slug:newSlug},{new:true});
    res.json({ success: true, updateBlog });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const userid=req.user?._id || req.body.userid
    if (blog) {
      if (blog.author.toString() !== userid?.toString()) {
        return res.status(403).json({
          message: "You are not authorized to delete this blog",
        });
      } else {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog Deleted Successfully" });
      }
    } else {
      return res.json({ message: "Blog not found" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const blogLike = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = blog.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      // unlike
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // like
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      message: alreadyLiked ? "unliked" : "liked",
      likes: blog.likes,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};