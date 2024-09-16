import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as QRCode from 'qrcode';
import { QRCodeSchema } from "../schemas/qr-code";

export async function createQRCodeHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const payload = await request.json();

        // Validate the payload
        const parsedPayload = QRCodeSchema.safeParse(payload);

        if (!parsedPayload.success) {
            context.log("Validation Error", parsedPayload.error.errors);
            throw new Error("Payload is invalid");
        }

        const svg = await QRCode.toString(`${request.headers.get("origin")}/${parsedPayload.data.path}`, { type: 'svg', color: { light: '#0000' } }); // Transparent background
        context.log(`QR Code created for path "${parsedPayload.data.path}"`);

        return {
            jsonBody: {
                message: `QR Code created`,
                data: { svg }
            },
            status: 200
        };
    } catch (error) {
        return {
            jsonBody: {
                message: `Failed to create QR Code`,
                error: error.message || "An unexpected error occurred"
            },
            status: 500
        };
    }
};

app.http('createQRCodeHttp', {
    methods: ['POST'],
    authLevel: 'function',
    handler: createQRCodeHttp
});
