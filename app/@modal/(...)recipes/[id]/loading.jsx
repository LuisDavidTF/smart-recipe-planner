'use client'

import { Modal } from '@components/ui/Modal';

export default function Loading() {
  return (
    <Modal
      isOpen={true}
      title="Cargando receta..."
      overlayClassName="backdrop-blur-sm bg-black/30"
    >
      <div className="animate-pulse space-y-4">
        {/* Imagen */}
        <div className="w-full h-64 bg-gray-200 rounded-lg mb-4"></div>

        {/* Título y descripción */}
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>

        {/* Ingredientes */}
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6 mb-2"></div>
      </div>
    </Modal>
  );
}
