/* eslint-disable import/no-anonymous-default-export */
export default {
  app: {
    name: 'STI dashboard',
  },
  common: {
    not_found: 'Page not found',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    reset: 'Reset',
    search: 'Search',
    table: {
        total: 'Total {{total}} items',
        export: 'Export',
        changeMe: 'Change Me',
        key: 'Key',
        value: 'Value',
        attributes: 'Attributes',
        addRow: 'Add Row',
        keyDescription: 'Key Description',
        valueDescription: 'Value Description'
    },
    add: 'Add',
    edit: 'Edit',
    details: 'Details',
    addRow: 'Add Row',
    delete: 'Delete',
    success: 'Success',
    successfulOperation: 'Successful Operation!',
    fieldRequired: 'Required Field',
    api: 'API',
    email: 'Email',
    goBack: 'Back',
    goAhead: 'Forward',
    description: 'Description',
    import_success: 'File uploaded successfully',
    click_upload: 'Click to upload a file',
    delete_confirm: 'Are you sure you want to delete the selected item?',
    welcome: 'Welcome',
    noMoreData: 'No more data',
    emailErrorMsg: 'Please enter a valid email format (e.g. test@test.com)'
  },
  login: {
    username: 'Username',
    password: 'Password',
    confirm_password: 'Confirm password',
    sign_in: 'Sign In',
    mandatory_username: 'Please input your username!',
    mandatory_password: 'Please input your password!',
    mandatory_confirm_password: 'Please confirm yout password!',
    mandatory_email: 'Please input your email!',
    mandatory_key: 'Pleas input your key!',
    forgot_password: 'Forgot your password?',
    remember_me: 'Remember me',
    failed: 'Login failed',
    recover_password_title: 'Fill out the form below to reset your password',
    recover_password_subtitle: 'You will receive an email containing a key to reset your password',
    new_password_form_title: 'Enter the key received by mail and the new password',
    activation_user_title: 'Configure your access password',
    activation_user_subtitle: 'This operation will necessary only for the first access',
    fields: {
        username: 'Username',
        email: 'Email',
        key: 'Key',
        send: 'Send'
    },
    placeholder: {
        input_password: 'Input password',
        input_confirm_password: 'Input again the password'
    },
    recover_init_success: 'Email successfully sent!',
    recover_finish_success: 'Password updated successfully!'
  },
  loginSSO: {
    label: 'Login to your Account',
    sso_button: 'SSO Login',
    with_credentials : 'Login with Credentials'
  },
  users: {
    fields: {
      email: 'Email',
      firstName: 'Name',
      lastName: 'Surname',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      edit: 'Edit',
      role: 'Role',
      createdBy: 'Created by',
      createdDate: 'Creation date',
      lastModifiedBy: 'Last modified by',
      lastModifiedDate: 'Last modified date',
      imageUrl: 'Image url',
      errors: {
        login: 'Email Required',
        firstName: 'First Name Required',
        lastName: 'Last Name Required',
        role: 'Role Required'
      }
    },
    module_name: 'Users'
  },
  me: {
    module_name: 'Edit Profile'
  },
  'me/change-password': {
    module_name: 'Change Password'
  },
  menu: {
    dashboard: 'Dashboard',
    profile: {
      title: 'Profile',
      editProfile: 'Edit Profile',
      changePassword: 'Change Password'
    },
    logout: 'Logout',
    users: 'Users',
    roles: 'Roles'
  },
  module: {
    listing: {
      title: 'List'
    },
    add: {
      title: 'Add'
    },
    details: {
      title: 'Details'
    },
    edit: {
      title: 'Edit'
    }
  },
  authorities: {
    module_name: 'Roles',
    fields: {
      name: 'Name',
      capabilities: 'Capabilities',
      errors: {
        name: 'Nome Obbligatorio',
        capabilities: 'Capacità Obbligatorio'
      }
    }
  }
}