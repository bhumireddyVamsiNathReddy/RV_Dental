import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER; // Format: whatsapp:+14155238886

let twilioClient: ReturnType<typeof twilio> | null = null;

// Only initialize if credentials are present
if (accountSid && authToken) {
    twilioClient = twilio(accountSid, authToken);
}

export async function sendWhatsAppConfirmation(
    patientMobile: string,
    appointmentDetails: {
        patientName: string;
        date: string;
        time: string;
    }
) {
    // If Twilio is not configured, log and return
    if (!twilioClient || !whatsappFrom) {
        console.log('WhatsApp notification skipped - Twilio not configured');
        console.log('Appointment details:', appointmentDetails);
        return { success: false, error: 'WhatsApp not configured' };
    }

    try {
        // Format phone number to E.164 format (e.g., +919876543210)
        const formattedNumber = patientMobile.startsWith('+')
            ? patientMobile
            : `+91${patientMobile}`; // Default to India code, adjust as needed

        const message = `
✅ *Appointment Confirmed - RV Dental*

Hello ${appointmentDetails.patientName}! 👋

Your dental appointment has been successfully booked.

📅 *Date:* ${appointmentDetails.date}
🕒 *Time:* ${appointmentDetails.time}
📍 *Location:* 123 Wellness Avenue, Serenity District

📞 For any changes or queries, please call us at +1 (555) 123-4567

We look forward to seeing you!

_RV Dental - Your Smile, Our Priority_ 🦷
        `.trim();

        const response = await twilioClient.messages.create({
            from: whatsappFrom,
            to: `whatsapp:${formattedNumber}`,
            body: message,
        });

        console.log('WhatsApp message sent successfully:', response.sid);
        return { success: true, messageId: response.sid };
    } catch (error: any) {
        console.error('Failed to send WhatsApp message:', error);
        return { success: false, error: error.message };
    }
}
