import emailjs from "@emailjs/nodejs";

interface EmailProps {
    to: string;
    name: string;
    configMessage: string;
}

export async function sendConfirmationEmail({ to, name, configMessage }: EmailProps) {
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
        console.warn("[Email] EmailJS environment variables are missing. Skipping email send.");
        return { success: false, error: "Missing API Keys" };
    }

    try {
        // Send email via EmailJS NodeJS SDK
        const response = await emailjs.send(
            serviceId,
            templateId,
            {
                to_email: to,
                // Name 'Prime5Coders' should be configured in the EmailJS Template 'From Name'
                subject: "We received your project brief! 🚀",
                message: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <div style="text-align: center; padding: 20px 0;">
        <h1 style="color: #1a1a1a; margin: 0;">Prime5Coders</h1>
        <p style="color: #666; margin-top: 5px;">Your digital product engineers</p>
    </div>
    
    <div style="background-color: #f9f9f9; padding: 30px; border-radius: 12px; border: 1px solid #eee;">
        <h2 style="margin-top: 0;">Hi ${name},</h2>
        <p>Thank you for submitting your project configuration! We're excited to learn more about what you're building.</p>
        
        <p>Our team is reviewing your requirements right now, and we'll be in touch within 24 hours to discuss the next steps.</p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: white; border-radius: 8px; border-left: 4px solid #000;">
            <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #666;">Your Submission Details</h3>
            <pre style="white-space: pre-wrap; font-family: inherit; font-size: 14px; line-height: 1.5; margin: 0;">${configMessage}</pre>
        </div>
        
        <p>If you have any immediate questions, feel free to reply directly to this email or chat with us on WhatsApp.</p>
        
        <p style="margin-bottom: 0;">Best regards,<br><strong>The Prime5Coders Team</strong></p>
    </div>
    
    <div style="text-align: center; padding: 20px 0; color: #999; font-size: 12px;">
        &copy; ${new Date().getFullYear()} Prime5Coders. All rights reserved.
    </div>
</div>`
            },
            {
                publicKey,
                privateKey,
            }
        );

        console.log("[Email] Confirmation sent via EmailJS to:", to);
        return { success: true, data: response };
    } catch (err) {
        console.error("[Email] Unexpected EmailJS error:", err);
        return { success: false, error: err };
    }
}
