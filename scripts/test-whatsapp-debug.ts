
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testWhatsApp() {
    console.log('Testing WhatsApp Configuration...');
    const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN;
    const apiVersion = process.env.META_WHATSAPP_API_VERSION || 'v21.0';

    console.log('Phone Number ID:', phoneNumberId);
    console.log('Access Token exists:', !!accessToken);

    if (!phoneNumberId || !accessToken) {
        console.error('Missing configuration!');
        return;
    }

    // Using a dummy Indian number for testing structure
    // If you have a real number you want to test, replace it here.
    // For now, we just want to see if the API accepts the request or rejects it with an auth error.
    const testNumber = '919876543210';

    console.log(`Attempting to send test message to ${testNumber}...`);

    const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

    const messageData = {
        messaging_product: "whatsapp",
        to: testNumber,
        type: "text",
        text: {
            body: "Hello from Dental RV Debugger"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });

        const data = await response.json();

        console.log('Response Status:', response.status);
        console.log('Response Body:', JSON.stringify(data, null, 2));

        if (!response.ok) {
            console.log('\n--- DIAGNOSIS ---');
            if (data.error) {
                if (data.error.code === 190) {
                    console.log('Error: Access Token Expired or Invalid. Please refresh your token.');
                } else if (data.error.code === 131030) {
                    console.log('Error: Recipient phone number not in allowed list (Sandbox mode).');
                } else if (data.error.code === 100) {
                    console.log('Error: Invalid Parameter. Check Phone Number ID.');
                } else if (data.error.message.includes('payment')) {
                    console.log('Error: Payment method issue on Meta account.');
                } else {
                    console.log('Error: ' + data.error.message);
                }
            }
        } else {
            console.log('Success! The API accepted the message.');
        }

    } catch (error: any) {
        console.error('Network or Script Error:', error);
    }
}

testWhatsApp().catch(console.error);
