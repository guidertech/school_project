import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      schoolName,
      designation,
      email,
      phone,
      numberOfTeachers,
      numberOfStudents,
      message,
    } = body;

    if (!name || !schoolName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Please fill all required fields." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const recipientEmail = process.env.DEMO_RECEIVER_EMAIL || smtpUser || "guidertech@gmail.com";

    const formattedHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #006783 0%, #096145 100%); padding: 30px 25px; color: #ffffff; text-align: center; }
            .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
            .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
            .content { padding: 30px 25px; }
            .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .info-table td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
            .info-label { font-weight: 700; color: #64748b; text-transform: uppercase; width: 35%; font-size: 11px; }
            .info-value { font-weight: 600; color: #0f172a; }
            .message-box { background: #f8fafc; border-left: 4px solid #006783; padding: 16px; border-radius: 8px; font-size: 13px; color: #334155; line-height: 1.6; margin-top: 10px; }
            .footer { background: #f1f5f9; padding: 16px 25px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
            .badge { display: inline-block; background: #e0f2fe; color: #0369a1; font-weight: 700; font-size: 11px; padding: 4px 10px; border-radius: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 New School Demo Request</h1>
              <p>Requested via School Platform Portal</p>
            </div>
            <div class="content">
              <table class="info-table">
                <tr>
                  <td class="info-label">Full Name</td>
                  <td class="info-value">${name}</td>
                </tr>
                <tr>
                  <td class="info-label">School Name</td>
                  <td class="info-value">${schoolName}</td>
                </tr>
                <tr>
                  <td class="info-label">Designation</td>
                  <td class="info-value"><span class="badge">${designation}</span></td>
                </tr>
                <tr>
                  <td class="info-label">Official Email</td>
                  <td class="info-value"><a href="mailto:${email}" style="color: #006783; text-decoration: none; font-weight: 700;">${email}</a></td>
                </tr>
                <tr>
                  <td class="info-label">Phone Number</td>
                  <td class="info-value"><a href="tel:${phone}" style="color: #096145; text-decoration: none; font-weight: 700;">${phone}</a></td>
                </tr>
                <tr>
                  <td class="info-label">No. of Teachers</td>
                  <td class="info-value">${numberOfTeachers}</td>
                </tr>
                <tr>
                  <td class="info-label">No. of Students</td>
                  <td class="info-value">${numberOfStudents}</td>
                </tr>
              </table>

              <div style="font-weight: 700; font-size: 12px; color: #475569; margin-top: 12px; text-transform: uppercase;">Message / Specific Requirements:</div>
              <div class="message-box">
                ${message ? message.replace(/\n/g, "<br/>") : "<i>No additional notes provided.</i>"}
              </div>
            </div>
            <div class="footer">
              This email was automatically generated from your <strong>Book A Demo</strong> form.
            </div>
          </div>
        </body>
      </html>
    `;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${name}" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: `"${name}" <${email}>`,
        subject: `🏫 Demo Request from ${name} (${schoolName})`,
        html: formattedHtml,
      });

      console.log(`Demo email sent successfully to ${recipientEmail}`);
    } else {
      console.log("--------------------------------------------------");
      console.log("SMTP User/Pass not set in .env.local yet. Form data:");
      console.log(JSON.stringify(body, null, 2));
      console.log("--------------------------------------------------");
    }

    return NextResponse.json({
      success: true,
      message: "Demo request submitted successfully!",
    });
  } catch (error: any) {
    console.error("Error in send-demo route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit demo request." },
      { status: 500 }
    );
  }
}
