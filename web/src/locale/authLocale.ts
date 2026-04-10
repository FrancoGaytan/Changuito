export const authLocale = {
  brand: 'Changuito',
  login: {
    title: 'Iniciar Sesión',
    subtitle: 'Bienvenido de vuelta.',
    email: {
      label: 'Email',
      placeholder: 'tu@ejemplo.com',
      errors: {
        required: 'El email es obligatorio',
        pattern: 'Email inválido',
      },
    },
    password: {
      label: 'Contraseña',
      placeholder: '••••••••',
      forgot: 'Olvidé mi contraseña',
      errors: {
        required: 'La contraseña es obligatoria',
        minLength: 'Mínimo 6 caracteres',
      },
    },
    serverError: 'Email o contraseña incorrectos.',
    submit: {
      default: 'Entrar',
      pending: 'Entrando...',
    },
    noAccount: '¿No tenés cuenta?',
    createAccount: 'Crear cuenta',
  },
  register: {
    title: 'Crear Cuenta',
    subtitle: 'Empezá a organizar tus compras.',
    sidePanel: {
      tagline: 'Tu despensa digital, con alma de barrio.',
      description: 'Organizá tus compras, gestioná tu inventario y compartí listas con tu familia de la manera más sencilla y cálida.',
      badge1: 'Listas Inteligentes',
      badge2: 'Inventario Vivo',
      footer: 'Abrazado por el consumo consciente — 2026',
      mobileSubtitle: 'Organización Digital',
    },
    name: {
      label: 'Nombre',
      placeholder: 'Tu nombre completo',
      error: 'El nombre es obligatorio',
    },
    email: {
      label: 'Email',
      placeholder: 'ejemplo@correo.com',
      errors: {
        required: 'El email es obligatorio',
        pattern: 'Email inválido',
      },
    },
    password: {
      label: 'Contraseña',
      placeholder: '••••••••',
      errors: {
        required: 'La contraseña es obligatoria',
        minLength: 'Mínimo 6 caracteres',
      },
    },
    confirm: {
      label: 'Confirmar contraseña',
      placeholder: '••••••••',
      errors: {
        required: 'Confirmá tu contraseña',
        match: 'Las contraseñas no coinciden',
      },
    },
    terms: {
      termsLink: 'Términos de Servicio',
      privacyLink: 'Privacidad',
      error: 'Necesario',
    },
    serverError: 'Algo salió mal. Intentá de nuevo.',
    submit: {
      default: 'Registrarme ahora →',
      pending: 'Procesando...',
    },
    hasAccount: '¿Ya tenes cuenta?',
    loginLink: 'Iniciá sesión',
  },
  forgot: {
    title: '¿Olvidaste tu contraseña?',
    description: 'Ingresá tu email y te daremos un código de recuperación.',
    email: {
      label: 'Email',
      placeholder: 'ejemplo@correo.com',
      errors: {
        required: 'El email es obligatorio',
        pattern: 'Email inválido',
      },
    },
    serverError: 'Algo salió mal. Intentá de nuevo.',
    submit: {
      default: 'Obtener código →',
      pending: 'Enviando...',
    },
    backToLogin: '← Volver al login',
    success: {
      title: '¡Revisá tu correo!',
      description: 'Si el email existe en nuestra base de datos, recibiste un enlace para restablecer tu contraseña.',
      backLink: '← Volver al login',
    },
  },
  reset: {
    title: 'Restablecer contraseña',
    description: 'Ingresá el código que recibiste y tu nueva contraseña.',
    code: {
      label: 'Código de recuperación',
      errors: { required: 'El código es obligatorio' },
    },
    newPassword: {
      label: 'Nueva contraseña',
      placeholder: 'Mínimo 6 caracteres',
      errors: {
        required: 'La contraseña es obligatoria',
        minLength: 'Mínimo 6 caracteres',
      },
    },
    confirmPassword: {
      label: 'Confirmar contraseña',
      placeholder: 'Repetí la contraseña',
      errors: {
        required: 'Confirmá la contraseña',
        match: 'Las contraseñas no coinciden',
      },
    },
    serverError: 'Código inválido o expirado. Intentá de nuevo.',
    submit: {
      default: 'Restablecer contraseña →',
      pending: 'Guardando...',
    },
    backToLogin: '← Volver al login',
    successTitle: '¡Contraseña actualizada!',
  },
};
