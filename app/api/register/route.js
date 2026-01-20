import { NextResponse } from 'next/server';
export const runtime = 'edge';
import { AuthService } from '@/lib/services/auth';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Call the external API via AuthService (server-side)
        const data = await AuthService.register({ name, email, password });

        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        if (error.status) {
            return NextResponse.json(
                { message: error.message || 'Error en el registro' },
                { status: error.status }
            );
        }
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: 'Error interno del servidor durante el registro', error: error.toString() },
            { status: 500 }
        );
    }
}
