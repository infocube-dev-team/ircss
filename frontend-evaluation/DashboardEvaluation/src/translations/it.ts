/* eslint-disable import/no-anonymous-default-export */
export default {
  app: {
    name: 'STI dashboard',
  },
  common: {
    not_found: 'Pagina non trovata',
    confirm: 'Conferma',
    cancel: 'Annulla',
    save: 'Salva',
    reset: 'Azzera',
    search: 'Cerca',
    table: {
        total: 'Totale {{total}} risultati',
        export: 'Export',
        changeMe: 'Cambiami',
        key: 'Chiave',
        value: 'Valore',
        attributes: 'Attributi',
        addRow: 'Aggiungi Riga',
        keyDescription: 'Descrizione Chiave',
        valueDescription: 'Descrizione Valore'
    },
    add: 'Aggiungi',
    edit: 'Modifica',
    details: 'Dettagli',
    addRow: 'Aggiungi Riga',
    delete: 'Elimina',
    success: 'Successo',
    successfulOperation: 'Operazione effettuata con successo!',
    fieldRequired: 'Campo Obbligatorio',
    api: 'API',
    email: 'Email',
    goBack: 'Indietro',
    goAhead: ' Avanti',
    description: 'Descrizione',
    import_success: 'File caricato correttamente',
    click_upload: 'Premi per caricare un file',
    delete_confirm: 'Sicuro di voler cancellare l\'elemento selezionato?',
    welcome: 'Benvenuto',
    noMoreData: 'Nessun altro dato presente',
    emailErrorMsg: 'Inserisci un formato email valido (ad esempio test@test.com)'
  },
  login: {
    username: 'Username',
    password: 'Password',
    confirm_password: 'Conferma password',
    sign_in: 'Accedi',
    mandatory_username: 'Per favore inserisci il tuo username!',
    mandatory_password: 'Per favore inserisci la tua password!',
    mandatory_confirm_password: 'Per favore conferma la tua password!',
    mandatory_email: 'Per favore inserisci la tua email!',
    mandatory_key: 'Per favore inserisci la tua chiave!',
    forgot_password: 'Dimenticata la password?',
    remember_me: 'Ricordami',
    failed: 'Autenticazione fallita',
    recover_password_title: 'Compila il form in basso per reimpostare la tua password',
    recover_password_subtitle: 'Riceverai una mail contenente una chiave per reimpostare la password',
    new_password_form_title: 'Inserisci la chiave ricevuta via mail e la nuova password',
    activation_user_title: 'Configura la tua password di accesso',
    activation_user_subtitle: 'Questa operazione sarà necessaria solo al primo accesso',
    fields: {
        username: 'Username',
        email: 'Email',
        key: 'Chiave',
        send: 'Invia'
    },
    placeholder: {
        input_password: 'Inserisci password',
        input_confirm_password: 'Inserisci di nuovo la password'
    },
    recover_init_success: 'Email inviata con successo!',
    recover_finish_success: 'Password aggiornata con successo!'
  },
  loginSSO: {
    label: 'Accedi con il tuo Account',
    sso_button: 'Accesso SSO',
    with_credentials : 'Accedi con le tue credenziali'
  },
  users: {
    fields: {
      email: 'Email',
      firstName: 'Nome',
      lastName: 'Cognome',
      currentPassword: 'Password Attuale',
      newPassword: 'Nuova Password',
      role: 'Ruolo',
      createdBy: 'Creato da',
      createdDate: 'Data di creazione',
      lastModifiedBy: 'Ultima modifica da',
      lastModifiedDate: 'Data ultima modifica',
      imageUrl: 'Url immagine',
      errors: {
        login: 'Email Obbligatoria',
        firstName: 'Nome Obbligatorio',
        lastName: 'Cognome Obbligatorio',
        role: 'Ruolo Obbligatorio'
      }
    },
    module_name: 'Utenti'
  },
  me: {
    module_name: 'Modifica Profilo'
  },
  'me/change-password': {
    module_name: 'Cambia Password'
  },
  menu: {
    dashboard: 'Dashboard',
    profile: {
      title: 'Profilo',
      editProfile: 'Modifica Profilo',
      changePassword: 'Cambia Password'
    },
    logout: 'Logout',
    users: 'Utenti',
    roles: 'Ruoli'
  },
  module: {
    listing: {
      title: 'Lista'
    },
    add: {
      title: 'Aggiungi'
    },
    details: {
      title: 'Dettagli'
    },
    edit: {
      title: 'Modifica'
    }
  },
  authorities: {
    module_name: 'Ruoli',
    fields: {
      name: 'Nome',
      capabilities: 'Capacità',
      errors: {
        name: 'Nome Obbligatorio',
        capabilities: 'Capacità Obbligatorio'
      }
    }
  }
}