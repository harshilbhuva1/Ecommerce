const userModel = require('../../models/userModel');
const crypto = require('crypto');
const sendMail = require('../../helpers/sendMail');

const forgotPasswordController = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'Account does not exist' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiry;
    await user.save();

    // Send email with reset link
    // const resetLink = `http://localhost:3000/reset-password/${token}`;
    const resetLink = `${process.env.REACT_APP_FRONTEND_URL}/reset-password/${token}`;
    await sendMail({
        to: email,
        subject: 'Password Reset',
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`
    });

    res.json({ message: 'Password reset link sent to your email.' });
};

module.exports = forgotPasswordController; 