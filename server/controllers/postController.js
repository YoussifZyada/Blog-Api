import Post from "../models/Post.js";

// ----------------- CREATE POST -----------------
export const createPost = async (req, res) => {
  const { content, image } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Post content is required" });
  }

  try {
    const post = await Post.create({
      user: req.user._id,
      content,
      image: image || "",
      likes: [],
      shares: [],
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- GET ALL POSTS -----------------
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- UPDATE POST -----------------
export const updatePost = async (req, res) => {
  const { content, image } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    post.content = content || post.content;
    post.image = image || post.image;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- DELETE POST -----------------
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await post.remove();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- LIKE / UNLIKE POST -----------------
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
      await post.save();
      return res.status(200).json({ message: "Post unliked" });
    }

    post.likes.push(userId);
    await post.save();
    res.status(200).json({ message: "Post liked" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- SHARE POST -----------------
export const sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;

    if (post.shares.includes(userId)) {
      return res.status(400).json({ message: "You already shared this post" });
    }

    post.shares.push(userId);
    await post.save();

    res.status(200).json({ message: "Post shared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};