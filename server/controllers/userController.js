import User from "../models/User.js";

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) return res.status(404).json({ message: "User not found" });

    if (userToFollow._id.equals(currentUser._id)) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: "Already following" });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Unfollow a user
// @route   POST /api/users/:id/unfollow
// @access  Private
export const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) return res.status(404).json({ message: "User not found" });

    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => !id.equals(userToUnfollow._id)
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => !id.equals(currentUser._id)
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get followers / following
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};