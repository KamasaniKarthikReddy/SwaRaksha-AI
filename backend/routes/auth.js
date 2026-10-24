const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../database/user");
const OTP = require("../database/otp");
const { v4: uuid } = require("uuid");
const router = express.Router();
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "swaraksha_super_secret_jwt_key_2025";

// In-memory OTP storage map for high resilience & instant access
const inMemoryOtpStore = new Map();

// Periodic cleanup of expired in-memory OTPs
setInterval(() => {
  const now = Date.now();
  for (const [phone, item] of inMemoryOtpStore.entries()) {
    if (now > item.expiresAt) {
      inMemoryOtpStore.delete(phone);
    }
  }
}, 60000);

// Helper to normalize phone number to standard digits
const sanitizePhoneNumber = (rawPhone) => {
  if (!rawPhone) return "";
  let digits = rawPhone.toString().replace(/\D/g, "");
  // If user entered +91 or 91 with 12 digits, strip country code for consistent 10-digit format
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }
  return digits;
};

router.get("/", (req, res) => {
  res.json({ message: "Auth API up and running :)" });
});

router.post("/verify", async (req, res) => {
  try {
    if (!req.body.token) {
      return res.status(200).json({ role: "noRole" });
    }
    const data = jwt.verify(req.body.token, JWT_SECRET);
    return res.status(200).json({
      role: data.role || "noRole",
      email: data.email || null,
      phone: data.phone || null,
      name: data.name || null
    });
  } catch (e) {
    return res.status(200).json({
      role: "noRole",
    });
  }
});

// Helper to extract user identity from either Google token or direct payload
const extractIdentity = (body) => {
  if (body.token) {
    try {
      const decoded = jwt.decode(body.token);
      if (decoded && decoded.email) {
        return {
          email: decoded.email,
          name: decoded.name || decoded.email.split('@')[0],
          picture: decoded.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
        };
      }
    } catch (e) {
      // not a valid JWT, continue to direct fields
    }
  }

  if (body.email) {
    return {
      email: body.email,
      name: body.name || body.email.split('@')[0],
      picture: body.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    };
  }

  return null;
};

router.post("/generateTokenP", async (req, res) => {
  const data = extractIdentity(req.body) || {
    email: "patient.demo@swaraksha.org",
    name: "Demo Patient",
    picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
  };

  const token = jwt.sign(
    {
      role: "patient",
      email: data.email,
      name: data.name,
      picture: data.picture,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    },
    JWT_SECRET
  );

  try {
    const existingUser = await User.findOne({ email: data.email });
    if (!existingUser) {
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
      const newUser = new User({
        role: "patient",
        email: data.email,
        name: data.name,
        uuid: uuid(),
        picture: data.picture,
        ip: clientIP,
      });
      await newUser.save();
      return res.status(200).json({ token, role: "patient", email: data.email, name: data.name });
    }

    if (existingUser.role === "patient") {
      return res.status(200).json({ token, role: "patient", email: data.email, name: existingUser.name || data.name });
    }

    return res.status(200).json({
      token: "tokenNotGranted",
      message: "An account with this email already exists under a different role."
    });
  } catch (err) {
    console.error("Error in generateTokenP:", err);
    return res.status(500).json({ error: "Failed to generate token" });
  }
});

router.post("/generateTokenD", async (req, res) => {
  const data = extractIdentity(req.body) || {
    email: "dr.ananya.sharma@swaraksha.org",
    name: "Dr. Ananya Sharma",
    picture: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
  };

  const token = jwt.sign(
    {
      role: "doctor",
      email: data.email,
      name: data.name,
      picture: data.picture,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    },
    JWT_SECRET
  );

  try {
    const existingDoctor = await User.findOne({ email: data.email });
    if (!existingDoctor) {
      const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
      const newDoctor = new User({
        role: "doctor",
        email: data.email,
        name: data.name,
        specialty: req.body.specialty || "General Physician",
        uuid: uuid(),
        picture: data.picture,
        ip: clientIP,
      });
      await newDoctor.save();
      return res.status(200).json({ token, role: "doctor", email: data.email, name: data.name });
    }

    if (existingDoctor.role === "doctor") {
      return res.status(200).json({ token, role: "doctor", email: data.email, name: existingDoctor.name || data.name });
    }

    return res.status(200).json({
      token: "tokenNotGranted",
      message: "An account with this email already exists under a different role."
    });
  } catch (err) {
    console.error("Error in generateTokenD:", err);
    return res.status(500).json({ error: "Failed to generate token" });
  }
});

// Helper to save OTP to store
const saveOtp = async (phone, otp) => {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  inMemoryOtpStore.set(phone, { otp, expiresAt, attempts: 0 });
  try {
    await OTP.deleteMany({ phone });
    await OTP.create({ phone, otp });
  } catch (err) {
    console.warn("[OTP] MongoDB store fallback to memory:", err.message);
  }
};

// Helper to verify OTP
const verifyStoredOtp = async (phone, enteredOtp) => {
  const cleanOtp = enteredOtp ? enteredOtp.toString().trim() : "";
  if (!cleanOtp) {
    return { valid: false, message: "OTP is required." };
  }

  // Check in-memory store first
  const mem = inMemoryOtpStore.get(phone);
  if (mem) {
    if (Date.now() > mem.expiresAt) {
      inMemoryOtpStore.delete(phone);
      return { valid: false, message: "OTP has expired. Please request a new one." };
    }
    if (mem.otp !== cleanOtp) {
      mem.attempts = (mem.attempts || 0) + 1;
      if (mem.attempts >= 5) {
        inMemoryOtpStore.delete(phone);
        return { valid: false, message: "Too many failed attempts. Please request a new OTP." };
      }
      return { valid: false, message: "Invalid OTP. Please check the 6-digit code and try again." };
    }
    // Success - invalidate
    inMemoryOtpStore.delete(phone);
    try { await OTP.deleteMany({ phone }); } catch (_) {}
    return { valid: true };
  }

  // Fallback check in MongoDB
  try {
    const record = await OTP.findOne({ phone }).sort({ createdAt: -1 });
    if (!record) {
      return { valid: false, message: "OTP expired or not found. Please request a new one." };
    }
    if (record.otp !== cleanOtp) {
      record.attempts = (record.attempts || 0) + 1;
      await record.save();
      if (record.attempts >= 5) {
        await OTP.deleteMany({ phone });
        return { valid: false, message: "Too many failed attempts. Please request a new OTP." };
      }
      return { valid: false, message: "Invalid OTP. Please check the 6-digit code and try again." };
    }
    await OTP.deleteMany({ phone });
    return { valid: true };
  } catch (dbErr) {
    return { valid: false, message: "Error verifying OTP: " + dbErr.message };
  }
};

/**
 * @route   POST /api/auth/send-otp
 * @desc    Generate and send 6-digit OTP to patient phone number
 * @access  Public
 */
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    const sanitizedPhone = sanitizePhoneNumber(phone);

    if (!sanitizedPhone || sanitizedPhone.length < 10 || sanitizedPhone.length > 15) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid mobile number (at least 10 digits)."
      });
    }

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await saveOtp(sanitizedPhone, generatedOtp);
    console.log(`[AUTH] 📱 Generated OTP for +91-${sanitizedPhone}: ${generatedOtp}`);

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to +91 ${sanitizedPhone}`,
      phone: sanitizedPhone,
      otp: generatedOtp, // returned for quick demo / auto-fill & testing
      expiresInSeconds: 300
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate OTP. Please try again."
    });
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and log patient in (returns JWT token)
 * @access  Public
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp, name } = req.body;
    const sanitizedPhone = sanitizePhoneNumber(phone);

    if (!sanitizedPhone) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required."
      });
    }

    const verification = await verifyStoredOtp(sanitizedPhone, otp);
    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }

    // Check if phone belongs to doctor
    const existingDoctor = await User.findOne({ phone: sanitizedPhone, role: "doctor" });
    if (existingDoctor) {
      return res.status(200).json({
        token: "tokenNotGranted",
        message: "An account with this phone number already exists under a Doctor role."
      });
    }

    const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const syntheticEmail = `patient_${sanitizedPhone}@swaraksha.org`;
    let patientUser = await User.findOne({ phone: sanitizedPhone });

    if (!patientUser) {
      patientUser = await User.findOne({ email: syntheticEmail });
    }

    const displayName = (name && name.trim()) || (patientUser && patientUser.name) || `Patient (${sanitizedPhone.slice(-4)})`;

    if (!patientUser) {
      patientUser = new User({
        role: "patient",
        phone: sanitizedPhone,
        email: syntheticEmail,
        name: displayName,
        uuid: uuid(),
        picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
        ip: clientIP,
      });
      await patientUser.save();
    } else {
      if (!patientUser.phone) patientUser.phone = sanitizedPhone;
      if (name && name.trim()) patientUser.name = name.trim();
      patientUser.ip = clientIP;
      await patientUser.save();
    }

    const token = jwt.sign(
      {
        role: "patient",
        phone: sanitizedPhone,
        email: patientUser.email,
        name: patientUser.name,
        picture: patientUser.picture,
        uuid: patientUser.uuid,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      },
      JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      token,
      role: "patient",
      phone: sanitizedPhone,
      email: patientUser.email,
      name: patientUser.name
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during OTP verification."
    });
  }
});

module.exports = router;

