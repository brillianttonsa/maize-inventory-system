// backend/services/contactService.js
import pool from "../config/db.js"

/**
 * Save contact message to database
 */
export const saveContactMessage = async ({ name, email, subject, message }) => {
  try {
    // Create contacts table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert contact message
    const result = await pool.query(
      "INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, subject, message],
    )

    console.log(`[Contact] New message saved from ${name} (${email})`)

    return result.rows[0].id
  } catch (error) {
    console.error("Error saving contact message:", error)
    throw error
  }
}

/**
 * Send email notification (simulated)
 * In production, integrate with email service like SendGrid, Nodemailer, etc.
 */
export const sendContactNotification = async ({ name, email, subject, message }) => {
  try {
    // SIMULATED EMAIL NOTIFICATION
    console.log("\n========== NEW CONTACT MESSAGE ==========")
    console.log(`From: ${name} <${email}>`)
    console.log(`Subject: ${subject}`)
    console.log(`Message:\n${message}`)
    console.log("=========================================\n")

    // In production, replace with actual email sending:
    /*
    import nodemailer from 'nodemailer';
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });
    */

    return true
  } catch (error) {
    console.error("Error sending notification:", error)
    // Don't throw - we still want to save the message even if notification fails
    return false
  }
}
