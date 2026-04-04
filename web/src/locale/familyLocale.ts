export const familyLocale = {
  noFamily: {
    title: 'Mi Familia',
    subtitle: 'Creá o unite a un grupo familiar para empezar a colaborar.',
    create: {
      title: 'Crear Grupo',
      description: 'Armá tu grupo familiar y sumá integrantes con un código QR.',
    },
    join: {
      title: 'Unirme con Código',
      description: 'Ingresá el código de invitación que te compartieron.',
    },
    scan: {
      title: 'Escanear QR',
      description: 'Abrí la cámara y escaneá el código del grupo para unirte automáticamente.',
    },
  },
  header: {
    memberSingular: 'integrante',
    memberPlural: 'integrantes',
    inviteButton: 'Invitar',
  },
  members: {
    sectionTitle: 'Integrantes',
    you: '(Vos)',
    roles: {
      admin: 'Administrador',
      editor: 'Editor',
      reader: 'Lector',
    },
  },
  invite: {
    title: 'Invitar',
    codeLabel: 'Código de invitación',
    showQrButton: 'Mostrar QR',
    scan: {
      title: 'Escanear QR',
      subtitle: 'Unite a otro grupo',
    },
  },
  qrModal: {
    title: 'Código QR del grupo',
    description: 'Compartí este código o escanealo para unirte.',
    imgAlt: 'QR de invitación',
  },
  createModal: {
    title: 'Crear Grupo Familiar',
    nameLabel: 'Nombre del grupo',
    namePlaceholder: 'Ej: Familia García',
    actions: {
      cancel: 'Cancelar',
      submitDefault: 'Crear',
      submitPending: 'Creando...',
    },
  },
  joinModal: {
    title: 'Unirme con Código',
    codeLabel: 'Código de invitación',
    codePlaceholder: 'Ej: A1B2C3D4',
    errorMessage: 'Código inválido o ya pertenecés a un grupo.',
    actions: {
      cancel: 'Cancelar',
      submitDefault: 'Unirme',
      submitPending: 'Uniéndome...',
    },
  },
};
