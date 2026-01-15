import React from 'react';
import Link from 'next/link';
import { useSettings } from '@context/SettingsContext';

export const metadata = {
    title: 'Términos y Condiciones | Culina Smart',
    description: 'Términos y condiciones de uso de la plataforma Culina Smart.',
};

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6 sm:px-8">
            <div className="bg-card shadow-sm rounded-xl p-8 border border-border">
                <h1 className="text-3xl font-bold text-foreground mb-2">Términos y Condiciones de Uso</h1>
                <p className="text-muted-foreground text-sm mb-8">
                    Última actualización: 14 de enero de 2026
                </p>

                <div className="space-y-8 text-foreground leading-relaxed">

                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Introducción</h2>
                        <p>
                            Bienvenido a Culina Smart. Al acceder o utilizar esta aplicación web, aceptas quedar legalmente vinculado por los presentes Términos y Condiciones.
                            Si no estás de acuerdo con alguno de ellos, debes abstenerte de utilizar el servicio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Descripción del Servicio</h2>
                        <p className="mb-2">Culina Smart es una plataforma digital que permite a los usuarios:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Registrarse e iniciar sesión</li>
                            <li>Crear, publicar y compartir recetas</li>
                            <li>Consultar recetas públicas</li>
                            <li>Generar recetas mediante herramientas de inteligencia artificial</li>
                            <li>Interactuar con funcionalidades relacionadas con la planificación y organización culinaria</li>
                        </ul>
                        <p className="mt-2">Actualmente, la plataforma no maneja pagos ni suscripciones.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Registro y Uso de la Cuenta</h2>
                        <p className="mb-2">El usuario es responsable de:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Proporcionar información veraz y actualizada</li>
                            <li>Mantener la confidencialidad de sus credenciales</li>
                            <li>Todas las actividades realizadas desde su cuenta</li>
                        </ul>
                        <p className="mt-2">Culina Smart no se hace responsable por accesos no autorizados derivados del uso indebido de credenciales por parte del usuario.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Contenido Generado por Usuarios</h2>
                        <p className="mb-2">Los usuarios son los únicos responsables del contenido que publican, incluyendo textos, recetas, enlaces e imágenes.</p>
                        <div className="bg-muted/30 p-4 rounded-lg border border-border">
                            <p className="font-semibold text-destructive/80 mb-1">Advertencia sobre información sensible</p>
                            <p className="text-sm">
                                Culina Smart no se hace responsable si un usuario publica datos personales, sensibles o confidenciales dentro del contenido público.
                                Se recomienda revisar cuidadosamente el contenido antes de publicarlo.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Uso de Inteligencia Artificial</h2>
                        <p>
                            Las funciones de IA generan contenido de forma automática y no garantizan exactitud, seguridad alimentaria, valores nutricionales correctos o resultados reales.
                            El contenido generado por IA es meramente informativo y debe ser verificado por el usuario.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Propiedad Intelectual e Imágenes</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Culina Smart no aloja imágenes directamente.</li>
                            <li>Las imágenes se muestran mediante URLs externas proporcionadas por los usuarios.</li>
                            <li>Culina Smart no reclama derechos sobre dichas imágenes.</li>
                            <li>El usuario garantiza que tiene derecho a usar y compartir los recursos enlazados.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Moderación y Eliminación de Contenido</h2>
                        <p className="mb-2">Culina Smart se reserva el derecho, sin obligación, de:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Editar</li>
                            <li>Ocultar</li>
                            <li>Eliminar</li>
                            <li>Bloquear contenido o cuentas</li>
                        </ul>
                        <p className="mt-2">cuando considere que violan estos términos, la ley o resulten inapropiados, sin previo aviso.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Limitación de Responsabilidad</h2>
                        <p className="mb-2">El servicio se proporciona “tal como está”, sin garantías de ningún tipo. Culina Smart no garantiza:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Disponibilidad continua</li>
                            <li>Ausencia de errores</li>
                            <li>Seguridad absoluta</li>
                            <li>Exactitud del contenido</li>
                        </ul>
                        <p className="mt-2">En ningún caso Culina Smart será responsable por daños directos o indirectos derivados del uso del servicio.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">9. Terminación del Servicio</h2>
                        <p>
                            Culina Smart puede suspender o cancelar cuentas que incumplan estos términos, de forma temporal o permanente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">10. Modificaciones</h2>
                        <p>
                            Los términos pueden actualizarse en cualquier momento.
                            La fecha de actualización reflejará el último cambio y el uso continuado del servicio implica aceptación de los nuevos términos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">11. Ley Aplicable y Jurisdicción</h2>
                        <p>
                            Estos términos se rigen por las leyes aplicables de México, y cualquier controversia se someterá a los tribunales competentes del país.
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
