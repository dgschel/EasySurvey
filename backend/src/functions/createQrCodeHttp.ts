import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as QRCode from 'qrcode';

export async function createQRCodeHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const svg = await QRCode.toString('Test', { type: 'svg', color: { light: '#0000' } }); // Transparent background
        context.log(`QR Code created`);

        return {
            jsonBody: {
                message: `QR Code created`,
                data: svg
            },
            status: 200
        };
    } catch (error) {
        return {
            jsonBody: {
                message: `Failed to create QR Code`,
                error: error.message
            },
            status: 500
        };
    }
};

app.http('createQRCodeHttp', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: createQRCodeHttp
});
