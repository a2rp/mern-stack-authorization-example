exports.getPrivateData = (req, res) => {
    return res.json({
        success: true,
        data: "Private Profile Page",
        user: {
            id: req.user._id.toString(),
            username: req.user.username,
            email: req.user.email,
        },
    });
};
