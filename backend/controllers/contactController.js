// backend/controllers/contactController.js
import { saveContactMessage, sendContactNotification } from "../services/contactService.js"

// @desc Submit contact form
// @route POST /api/contact
// @access Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      })
    }

    // Save to database
    const contactId = await saveContactMessage({ name, email, subject, message })

    // Send notification email (simulated)
    await sendContactNotification({ name, email, subject, message })

    res.status(200).json({
      success: true,
      message: "Thank you for contacting us! We will get back to you soon.",
      contactId,
    })
  } catch (error) {
    console.error("Contact form error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form. Please try again later.",
    })
  }
}
