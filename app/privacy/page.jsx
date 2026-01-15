import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Política de Privacidad | Culina Smart',
    description: 'Política de privacidad y protección de datos de Culina Smart.',
};

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6 sm:px-8">
            <div className="bg-card shadow-sm rounded-xl p-8 border border-border">
                <h1 className="text-3xl font-bold text-foreground mb-2">Política de Privacidad</h1>
                <p className="text-muted-foreground text-sm mb-8">
                    Última actualización: 14 de enero de 2026
                </p>

                <div className="space-y-8 text-foreground leading-relaxed">

                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Responsable del Tratamiento</h2>
                        <p>
                            Culina Smart es responsable del tratamiento de los datos personales recabados a través de esta aplicación web.
                            Actualmente no existe una empresa legalmente constituida detrás del servicio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Datos Personales Recopilados</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Correo electrónico</li>
                            <li>Credenciales de acceso (en forma cifrada)</li>
                            <li>Datos técnicos de navegación (IP anonimizada, navegador, dispositivo)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Finalidades del Tratamiento</h2>
                        <p className="mb-2">Los datos se utilizan para:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Crear y administrar cuentas de usuario</li>
                            <li>Autenticación y seguridad</li>
                            <li>Proveer funcionalidades de la aplicación</li>
                            <li>Mejorar la experiencia del usuario</li>
                            <li>Analítica de uso mediante Google Analytics</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Google Analytics</h2>
                        <p>
                            Se utilizan herramientas de Google Analytics para recopilar información anónima y agregada sobre el uso del sitio.
                            Google puede procesar estos datos conforme a sus propias políticas de privacidad.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Protección de la Información</h2>
                        <p>
                            Se aplican medidas técnicas y organizativas razonables para proteger la información personal frente a accesos no autorizados, pérdida o alteración.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Compartición de Datos</h2>
                        <p>
                            Culina Smart no vende ni cede datos personales a terceros, salvo obligación legal o requerimiento de autoridad competente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Derechos del Usuario (ARCO)</h2>
                        <p className="mb-2">El usuario puede solicitar:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Acceso</li>
                            <li>Rectificación</li>
                            <li>Cancelación</li>
                            <li>Oposición</li>
                        </ul>
                        <p className="mt-2">respecto a sus datos personales, contactando a través de los medios indicados en la plataforma.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Conservación de Datos</h2>
                        <p>
                            Los datos se conservan mientras la cuenta esté activa o sea necesario para cumplir con las finalidades descritas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">9. Cambios a esta Política</h2>
                        <p>
                            Esta política puede modificarse en cualquier momento.
                            Los cambios se reflejarán en la fecha de actualización.
                        </p>
                    </section>

                </div>

                <div className="pt-8 border-t border-border mt-10">
                    <Link href="/" className="text-primary hover:underline font-medium">
                        &larr; Volver al Inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
