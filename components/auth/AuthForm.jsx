
'use client' 

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { FormInput } from '@components/ui/FormInput';
import { Button } from '@components/ui/Button';
import { EyeIcon, EyeOffIcon } from '@components/ui/Icons';

const validateEmail = (email) => {
  if (!email) return "El email es requerido.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Por favor, ingresa un email válido.";
  }
  return "";
};
const validatePasswordStrength = (password) => {
  if (!password) return { strength: 'none', message: 'La contraseña es requerida.' };
  if (password.length < 8) return { strength: 'weak', message: 'Débil: Mínimo 8 caracteres.' };
  
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (hasUpper && hasLower && hasNumber) return { strength: 'strong', message: 'Fuerte' };
  if ((hasUpper || hasLower) && hasNumber) return { strength: 'medium', message: 'Media' };
  
  return { strength: 'weak', message: 'Débil: Combina mayúsculas, minúsculas y números.' };
};
const PasswordStrengthMeter = ({ password }) => {
  const { strength, message } = validatePasswordStrength(password);
  if (strength === 'none' || !password) return null;

  const colorMap = { weak: 'bg-red-500', medium: 'bg-yellow-500', strong: 'bg-emerald-500' };
  const widthMap = { weak: 'w-1/3', medium: 'w-2/3', strong: 'w-full' };

  return (
    <div>
      <div className="h-1 w-full bg-gray-200 rounded-full mt-1">
        <div className={`h-1 rounded-full ${colorMap[strength]} ${widthMap[strength]} transition-all`}></div>
      </div>
      <p className={`text-xs mt-1 ${strength === 'weak' ? 'text-red-600' : 'text-gray-500'}`}>
        {message}
      </p>
    </div>
  );
};

export function AuthForm({ isRegister = false }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', passwordConfirmation: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, register } = useAuth();
  const router = useRouter(); 
  const { showToast } = useToast();

 const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (apiError) setApiError(null);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'email') error = validateEmail(value);
    if (name === 'name' && isRegister && !value) error = 'El nombre es requerido.';
    if (name === 'password' && isRegister) {
      const { message, strength } = validatePasswordStrength(value);
      if (strength === 'weak' || strength === 'none') error = message;
    }
    if (name === 'passwordConfirmation' && isRegister && value !== formData.password) error = 'Las contraseñas no coinciden.';
    
    if (error) setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (isRegister) {
      if (!formData.name) newErrors.name = 'El nombre es requerido.';
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
      const passStrength = validatePasswordStrength(formData.password);
      if (passStrength.strength === 'weak' || passStrength.strength === 'none') newErrors.password = passStrength.message;
      if (formData.password !== formData.passwordConfirmation) newErrors.passwordConfirmation = 'Las contraseñas no coinciden.';
    } else {
      if (!formData.email) newErrors.email = 'El email es requerido.';
      if (!formData.password) newErrors.password = 'La contraseña es requerida.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      if (isRegister) {
        await register(formData.name, formData.email, formData.password, formData.passwordConfirmation);
        showToast('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
        
        router.push('/login'); 
      } else {
        await login(formData.email, formData.password);
        showToast('¡Bienvenido!', 'success');
        
        router.push('/');
        router.refresh(); 
      }
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
        {isRegister ? 'Crear Cuenta' : 'Acceder'}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {isRegister && (
          <FormInput id="name" label="Nombre" value={formData.name} onChange={handleChange} onBlur={handleBlur} error={errors.name} autoComplete="name" required />
        )}
        <FormInput id="email" label="Email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} autoComplete="email" required />
        <div className="relative">
          <FormInput id="password" label="Contraseña" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} autoComplete={isRegister ? 'new-password' : 'current-password'} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500">
            {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>
        {isRegister && (
          <>
            <PasswordStrengthMeter password={formData.password} />
            <div className="relative">
              <FormInput id="passwordConfirmation" label="Confirmar Contraseña" type={showPassword ? 'text' : 'password'} value={formData.passwordConfirmation} onChange={handleChange} onBlur={handleBlur} error={errors.passwordConfirmation} autoComplete="new-password" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500">
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </>
        )}

        {apiError && <p className="text-sm text-red-600 text-center">{apiError}</p>}
        <div className="pt-2">
          <Button type="submit" isLoading={isLoading} className="w-full">
            {isRegister ? 'Registrarse' : 'Acceder'}
          </Button>
        </div>
      </form>
      <p className="text-sm text-center text-gray-600 mt-6">
        {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
        
        <Link 
          href={isRegister ? '/login' : '/register'} 
          className="font-medium text-emerald-600 hover:text-emerald-500 ml-1"
        >
          {isRegister ? 'Accede aquí' : 'Regístrate'}
        </Link>
      </p>
    </div>
  );
}