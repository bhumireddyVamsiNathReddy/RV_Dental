// Meta WhatsApp Cloud API Configuration
const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN;
const apiVersion = process.env.META_WHATSAPP_API_VERSION || 'v21.0';

export async function sendWhatsAppConfirmation(
    patientMobile: string,
    appointmentDetails: {
        patientName: string;
        date: string;
        time: string;
    }
) {
    // If Meta WhatsApp is not configured, log and return
    if (!phoneNumberId || !accessToken) {
        console.log('WhatsApp notification skipped - Meta WhatsApp not configured');
        console.log('Appointment details:', appointmentDetails);
        return { success: false, error: 'WhatsApp not configured' };
    }

    try {
        // Format phone number to international format without '+' (e.g., 919876543210)
        const formattedNumber = patientMobile.startsWith('+')
            ? patientMobile.substring(1)
            : patientMobile.startsWith('91')
                ? patientMobile
                : `91${patientMobile}`; // Default to India code

        // Meta WhatsApp Cloud API endpoint
        const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

        // Using template message (once approved by Meta)
        const messageData = {
            messaging_product: "whatsapp",
            to: formattedNumber,
            type: "template",
            template: {
                name: "booking_confirmation", // Must match your approved template name
                language: {
                    code: "en_US" // Changed to match Meta template language
                },
                components: [
                    {
                        type: "body",
                        parameters: [
                            {
                                type: "text",
                                text: appointmentDetails.patientName
                            },
                            {
                                type: "text",
                                text: appointmentDetails.date
                            },
                            {
                                type: "text",
                                text: appointmentDetails.time
                            }
                        ]
                    }
                ]
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Failed to send WhatsApp message:', data);
            return {
                success: false,
                error: data.error?.message || 'Failed to send message'
            };
        }

        console.log('WhatsApp message sent successfully:', data.messages?.[0]?.id);
        return { success: true, messageId: data.messages?.[0]?.id };
    } catch (error: any) {
        console.error('Failed to send WhatsApp message:', error);
        return { success: false, error: error.message };
    }
}

// Alternative function for sending without template (for testing only)
// Note: This won't work in production without an approved template
export async function sendWhatsAppTestMessage(
    patientMobile: string,
    message: string
) {
    if (!phoneNumberId || !accessToken) {
        console.log('WhatsApp notification skipped - Meta WhatsApp not configured');
        return { success: false, error: 'WhatsApp not configured' };
    }

    try {
        const formattedNumber = patientMobile.startsWith('+')
            ? patientMobile.substring(1)
            : patientMobile.startsWith('91')
                ? patientMobile
                : `91${patientMobile}`;

        const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

        const messageData = {
            messaging_product: "whatsapp",
            to: formattedNumber,
            type: "text",
            text: {
                body: message
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Failed to send WhatsApp test message:', data);
            return {
                success: false,
                error: data.error?.message || 'Failed to send message'
            };
        }

        console.log('WhatsApp test message sent:', data.messages?.[0]?.id);
        return { success: true, messageId: data.messages?.[0]?.id };
    } catch (error: any) {
        console.error('Failed to send WhatsApp test message:', error);
        return { success: false, error: error.message };
    }
}
