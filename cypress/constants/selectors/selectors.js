export const sigupSelectors =  {
  email : '[data-cy=signup-email-text-field]',
  submitEmail : '[data-cy=signup-email-submit-button]',
};

export const infoDetailsSelectors = {
  firstName: '[data-cy=signup-profile-first-name-text-field]',
  lastName: '[data-cy=signup-profile-last-name-text-field]',
  country: '[data-cy=select-country-select-container-wrapper]',
  timezone: '[data-cy=select-time-zone-select-container-wrapper]',
  DDMMYYYY: ':nth-child(2) > [data-cy=signup-profile-date-format-radio]',
  submitProfile: '[data-cy=signup-profile-submit-button]',
  signupProfileForm: '[data-cy=signup-profile-form]',
};

export const OTPSelectors = {
  OTP: '[data-cy=signup-otp-otp-number]',
  submitOTP: '[data-cy=signup-otp-submit-button]'
};

export const passwordSelector = {
  password: '[data-cy=signup-password-password-text-field]',
  submitPassword: '[data-cy=signup-password-submit-button]'
};

export const organisationSelector = {
  organisation: '[data-cy=signup-organization-name-text-field]',
  subdomain: '[data-cy=signup-organization-subdomain-text-field]',
  googleEnable: '[data-cy=signup-organization-enable-google-login-checkbox]',
  signupBtn: '[data-cy=signup-organization-submit-button]'
};

export const cancelSelectors = {
  cancelSignup: '[data-cy=signup-cancel-link]',
  cancelSubmit: '[data-cy=modal-submit-button]',
  cancelModal: '[data-cy=modal-cancel-button]'
};

export const profileDashboard = {
  header : '[data-cy=heading]'
};

export const messageSelector = {
  suggestion: '#error_1',
  messageBox: '[data-cy=toastr-message-container]'
};