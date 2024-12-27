import React, { useState, useEffect } from 'react';
import { AlertTriangle, HelpCircle, X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

const MobileWarningModal = ({ isOpen }) => (
  <div className={`fixed inset-0 z-[100] bg-gray-900 ${isOpen ? 'block' : 'hidden'}`}>
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-semibold">Visualización no optimizada</h2>
          </div>
          <p className="text-gray-600">
            Esta aplicación está diseñada para ser utilizada en dispositivos de escritorio. 
            Para una mejor experiencia, te recomendamos acceder desde una computadora.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const InstructionsModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
      <X className="h-6 w-6" />
    </button>
    
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Cómo usar esta aplicación</h2>
      </div>

      <p className="text-sm text-gray-600">
        Para visualizar tus contribuciones de GitHub en 3D, necesitarás:
      </p>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-1">1. Tu nombre de usuario de GitHub</h3>
          <p className="text-sm text-gray-600">
            Simplemente ingresa tu nombre de usuario de GitHub en el campo correspondiente.
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-1">2. Un token de acceso personal (PAT)</h3>
          <p className="text-sm text-gray-600">Sigue estos pasos para obtener tu token:</p>
          <ol className="list-decimal ml-5 space-y-2 text-sm text-gray-600 mt-2">
            <li>Inicia sesión en GitHub</li>
            <li>Ve a Configuración (Settings) desde tu foto de perfil</li>
            <li>Desplázate hasta Developer settings</li>
            <li>Selecciona Personal access tokens → Tokens (classic)</li>
            <li>Haz clic en Generate new token (classic)</li>
            <li>Dale un nombre descriptivo</li>
            <li>En permisos, marca solo read:user o repo</li>
            <li>Haz clic en Generate token y cópialo</li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            Importante: Actualmente, esta es la única forma disponible para acceder a 
            los datos de contribuciones debido a las restricciones de la API de GitHub.
          </p>
        </div>
      </div>
    </div>
  </Modal>
);

const ContributionsForm = ({ onSubmit }) => {
  const [login, setLogin] = useState("");
  const [token, setToken] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setShowInstructions(false);
    }
  }, [isMobile]);

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Contribuciones GitHub</h2>
          <button 
            onClick={() => setShowInstructions(true)}
            className="text-blue-600 hover:text-blue-700"
          >
            <HelpCircle className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario de GitHub
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Ej: torvalds"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token de Acceso
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Token personal de GitHub"
            />
          </div>
          
          <button
            onClick={() => onSubmit(login, token)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!login || !token}
          >
            Visualizar Contribuciones
          </button>
        </div>
      </div>

      <MobileWarningModal 
        isOpen={isMobile} 
      />

      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
      />
    </>
  );
};

export default ContributionsForm;