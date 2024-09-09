import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import QRCode from 'qrcode';

export async function createQRCodeHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';

    return { body: `Hello, ${name}!` };
};

app.http('createQRCodeHttp', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: createQRCodeHttp
});
