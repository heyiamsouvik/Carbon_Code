const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendEmail } = require('../services/email.service'); 


exports.register = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const user = await User.create({
        email,
        password: hashedPassword,
        otp,
        otpExpiry: Date.now() + 10 * 60 * 1000, 
        isVerified: false,
      });

      await sendEmail(
        email,
        'Verify Your Email',
        `Your OTP is: ${otp}. It will expire in 10 minutes.`
      );

      res.status(201).json({
        success: true,
        message: 'User registered. Please verify your email with the OTP sent.',
        userId: user._id,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error registering user', error: err.message });
    }
  },
];

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'User already verified' });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error verifying OTP', error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ success: true, message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error logging in', error: err.message });
  }
};

// RESEND OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'User already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    await user.save();

    await sendEmail(
      email,
      'Verify Your Email - Resend OTP',
      `Your new OTP is: ${otp}. It will expire in 10 minutes.`
    );

    res.status(200).json({ success: true, message: 'OTP resent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error resending OTP', error: err.message });
  }
};

// FORGOT PASSWORD 
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`[forgotPassword] Received reset request for email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[forgotPassword] No user found with email: ${email}`);
      return res.status(404).json({ success: false, message: 'User with given email not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    await user.save();

    console.log(`[forgotPassword] OTP generated and saved for user ${email}`);

    await sendEmail(
      email,
      'Password Reset OTP',
      `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`
    );
    console.log(`[forgotPassword] OTP email sent to ${email}`);

    res.json({ success: true, message: 'Password reset OTP sent to your email' });
  } catch (error) {
    console.error('[forgotPassword] Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

// RESET PASSWORD 
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log(`[resetPassword] Reset request for email: ${email} with OTP: ${otp}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[resetPassword] No user found with email: ${email}`);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('Received:', { email, otp });
    console.log('Stored OTP:', user.resetOtp);
    console.log('Expiry:', user.resetOtpExpiry, 'Now:', Date.now());

    if (user.resetOtp !== otp || user.resetOtpExpiry < Date.now()) {
      console.log('[resetPassword] Invalid or expired OTP');
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpiry = null;

    await user.save();
    console.log(`[resetPassword] Password reset successful for ${email}`);

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('[resetPassword] Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};