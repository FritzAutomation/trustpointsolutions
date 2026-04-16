import { Resend } from "resend";

interface SendContactEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendContactEmail({
  to,
  firstName,
  lastName,
  email,
  phone,
  message,
}: SendContactEmailParams) {
  const resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const timestamp = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return resend.emails.send({
    from: "Trust Point IT Solutions <noreply@trustpointitsolutions.com>",
    to,
    replyTo: email,
    subject: "New Contact Form Submission — Trust Point IT Solutions",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1B1464;">New Contact Form Submission</h2>
        <hr style="border: 1px solid #eee;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #1B1464;">Name</td>
            <td style="padding: 8px 0;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #1B1464;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${phone ? `<tr>
            <td style="padding: 8px 0; font-weight: bold; color: #1B1464;">Phone</td>
            <td style="padding: 8px 0;">${phone}</td>
          </tr>` : ""}
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #1B1464;">Message</td>
            <td style="padding: 8px 0;">${message}</td>
          </tr>
        </table>
        <hr style="border: 1px solid #eee;" />
        <p style="color: #999; font-size: 12px;">Submitted on ${timestamp}</p>
      </div>
    `,
  });
}
