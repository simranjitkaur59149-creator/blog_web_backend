import express from "express";
import {
  blogLike,
  createBlog,
  deleteBlog,
  getAllBlogsById,
  getBlogs,
  getBlogsById,
  getBlogsBySlug,
  updateBlog,
} from "../controllers/blogController.js";
import protectedRoutes from "../authMiddleware/protectedRoutes.js";
const blogRoutes = express.Router();
blogRoutes.route("/").get(getBlogs).post(protectedRoutes, createBlog);
blogRoutes.get("/allblogbyid",protectedRoutes, getAllBlogsById);
blogRoutes.get("/blogbyid",protectedRoutes ,getBlogsById);
blogRoutes.get("/:slug",getBlogsBySlug)
blogRoutes.route("/:id").put(protectedRoutes,updateBlog).delete(protectedRoutes,deleteBlog);
blogRoutes.post("/:id/like", protectedRoutes, blogLike);

export default blogRoutes;
