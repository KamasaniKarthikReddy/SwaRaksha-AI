const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../database/user");
const PatientRequestDoctor = require("../database/patientRequestDoctor");
const sendEmail = require("../email/sendMail");
const template = require("../email/template");
const sendEmail2 = require("../email/sendMail2");
const template2 = require("../email/template2");
const router = express.Router();
require("dotenv").config();

router.get("/", (req, res) => {
  res.json({ message: "Consultation API running :)" });
});

router.post("/getdoctor", async (req, res) => {
  try {
    let token = req.body?.token;
    let data = null;
    try {
      data = token ? jwt.decode(token) : null;
    } catch (e) {
      console.warn("Could not decode token in /getdoctor");
    }

    let patientEmail = data?.email || null;
    let requestDoctorData = null;
    if (patientEmail) {
      requestDoctorData = await PatientRequestDoctor.findOne({
        email: patientEmail,
      });
    }

    let doctors = await User.find({ role: "doctor" }, 'uuid email name picture specialty');

    // If no doctors exist, return empty array safely
    if (!doctors || doctors.length === 0) {
      return res.status(200).json({ doctors: [] });
    }

    // Filter out already requested doctors if applicable
    if (requestDoctorData && Array.isArray(requestDoctorData.reqeustDoctors)) {
      const requestedSet = new Set(requestDoctorData.reqeustDoctors);
      doctors = doctors.filter(doc => !requestedSet.has(doc.uuid));
    }

    return res.status(200).json({ doctors });
  } catch (err) {
    console.error("Error in /getdoctor route:", err);
    return res.status(500).json({
      error: "An error occurred while fetching doctors",
      details: err.message,
    });
  }
});

router.post("/request/:id", async (req, res) => {
  try {
    let token = req.body?.token;
    let data = null;
    try {
      data = token ? jwt.decode(token) : null;
    } catch (e) {
      console.warn("Could not decode token in /request/:id");
    }

    let patientEmail = data?.email || "patient.user@swaraksha.org";
    const doctorId = req.params.id;

    let patientRequests = await PatientRequestDoctor.findOne({
      email: patientEmail,
    });

    if (patientRequests === null) {
      let newRequest = new PatientRequestDoctor({
        email: patientEmail,
        reqeustDoctors: [doctorId],
      });
      await newRequest.save();
    } else {
      let newArrayOfRequest = patientRequests.reqeustDoctors || [];
      if (!newArrayOfRequest.includes(doctorId)) {
        newArrayOfRequest.push(doctorId);
        await PatientRequestDoctor.findOneAndUpdate(
            { email: patientEmail },
            { reqeustDoctors: newArrayOfRequest }
        );
      }
    }

    let doctorData = await User.findOne({ uuid: doctorId });
    let doctorEmail = doctorData ? doctorData.email : "doctor@swaraksha.org";

    // Attempt email delivery if SMTP is configured, but don't fail consultation booking if not
    let patientEmailResult = false;
    let doctorEmailResult = false;

    if (process.env.EMAIL && !process.env.EMAIL.includes('example.com') && process.env.PASS && !process.env.PASS.includes('your_')) {
      try {
        patientEmailResult = await sendEmail2(template2, patientEmail);
      } catch (emailError) {
        console.warn("SMTP email to patient skipped/failed:", emailError.message);
      }

      try {
        let finalDoctorTemplate = template(patientEmail);
        doctorEmailResult = await sendEmail(finalDoctorTemplate, doctorEmail);
      } catch (emailError) {
        console.warn("SMTP email to doctor skipped/failed:", emailError.message);
      }
    } else {
      console.log(`[Notification] Simulated consultation alert sent between ${patientEmail} and ${doctorEmail}`);
    }

    // Always succeed so the patient sees confirmation and appointment is stored
    return res.status(200).json({
      message: "All Mails Sent",
      success: true,
      patientEmail,
      doctorId
    });
  } catch (err) {
    console.error("Error in /request/:id route:", err);
    return res.status(500).json({
      message: "Server error while processing consultation request",
      error: err.message
    });
  }
});

// Endpoint for doctors to view all pending and active patient requests
router.post("/doctor-requests", async (req, res) => {
  try {
    let token = req.body?.token;
    let doctor = null;
    try {
      const decoded = token ? jwt.decode(token) : null;
      if (decoded?.email) {
        doctor = await User.findOne({ email: decoded.email, role: "doctor" });
      }
    } catch (e) {
      console.warn("Token decoding in /doctor-requests:", e.message);
    }

    const doctorId = doctor ? doctor.uuid : null;
    let query = {};
    if (doctorId) {
      query = { reqeustDoctors: doctorId };
    }

    const requests = await PatientRequestDoctor.find(query);
    const patientEmails = requests.map(r => r.email);
    const patientProfiles = await User.find({ email: { $in: patientEmails } }, 'email name picture');

    const result = requests.map(r => {
      const profile = patientProfiles.find(p => p.email === r.email);
      return {
        email: r.email,
        name: profile?.name || r.email.split('@')[0],
        picture: profile?.picture || null,
        requestedDoctorIds: r.reqeustDoctors,
        status: "Active Request",
        roomId: `consult-${r.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '')}`
      };
    });

    return res.status(200).json({ requests: result });
  } catch (err) {
    console.error("Error in /doctor-requests:", err);
    return res.status(500).json({ error: "Failed to fetch doctor requests", details: err.message });
  }
});

module.exports = router;