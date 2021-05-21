 /// <reference types="cypress" />

import { sigupSelectors,  infoDetailsSelectors, OTPSelectors, passwordSelector, organisationSelector, cancelSelectors, profileDashboard, messageSelector } from '../../constants/selectors/selectors'
import { texts } from '../../constants/texts/texts'
import { routes } from '../../constants/routes/routes'

describe("NeetoAuth Signup Test Suite",() => {
  let credentials; 
  beforeEach(() => {
  cy.fixture('metaData').then( info => {
        credentials = info;
        cy.visit(routes.signupRoute);
        cy.get(sigupSelectors.email).type(credentials.signupEmail);
        cy.get(sigupSelectors.submitEmail).click();
        
        cy.get(infoDetailsSelectors.firstName).clear().type(credentials.firstName);
        cy.get(infoDetailsSelectors.lastName).clear().type(credentials.lastName);
        cy.get(infoDetailsSelectors.country).type('India{downarrow}{enter}')
        cy.get(infoDetailsSelectors.timezone).type('Asia/Kolkata - UTC +5:30')
        cy.get(infoDetailsSelectors.DDMMYYYY).click();
  })
  });

  it("Should be able to signup",() => {
    cy.get(infoDetailsSelectors.submitProfile).click(); 

    cy.OTPAuth();
    cy.get(OTPSelectors.submitOTP).click();

    cy.get(passwordSelector.password).type(credentials.password);
    cy.get(passwordSelector.submitPassword).click();

    cy.get(organisationSelector.organisation).type(credentials.organisation);
    cy.get(organisationSelector.subdomain).should('not.have.value', '');
    cy.get(organisationSelector.googleEnable).click();
    cy.get(organisationSelector.signupBtn).click();

    cy.get(profileDashboard.header).should('have.text',texts.profileDashboardTitle);

  });

  it("Should suggest new subdomain, if subdomain is not available",() => {
    cy.get(infoDetailsSelectors.submitProfile).click();

    cy.OTPAuth();
    cy.get(OTPSelectors.submitOTP).click();

    cy.get(passwordSelector.password).type(credentials.password);
    cy.get(passwordSelector.submitPassword).click();

    cy.get(organisationSelector.organisation).type("BigBinary");
    cy.get(organisationSelector.subdomain).should('not.have.value', '');

    cy.contains(texts.suggestionSubdomainNotAvaliable).should("be.visible");

  });

  it("Should be able to cancel the Signup process",() => {
    cy.get(cancelSelectors.cancelSignup).click();
    cy.get(cancelSelectors.cancelSubmit).click();
    cy.location().should(loc => {
          expect(loc.toString()).to.eq(routes.loginRoute);
      });

  });

  it("Should be able to abort the cancellation step",() => {
    cy.get(cancelSelectors.cancelSignup).click();
    cy.get(cancelSelectors.cancelModal).click();
    cy.get(infoDetailsSelectors.signupProfileForm).should('be.visible');

  });

  it("Should give an error 'Something went wrong' when invalid 6 digit OTP is passed",() => {
    cy.get(infoDetailsSelectors.submitProfile).click(); 

    cy.get(OTPSelectors.OTP).type("123756");
    cy.get(OTPSelectors.submitOTP).click();
    cy.get(messagesSelector.messageBox).should('have.text',texts.wentWrong);

  });

  it("Setting up the password less than 5 character",() => {
    cy.get(infoDetailsSelectors.submitProfile).click(); 

    cy.OTPAuth();
    cy.get(OTPSelectors.submitOTP).click();

    cy.get(passwordSelector.password).type('meow');
    cy.get(passwordSelector.submitPassword).click();

  });

  it("Should give an suggestive warning when organisation name less than 2 characters is passed",() => {
    cy.get(infoDetailsSelectors.submitProfile).click(); 

    cy.OTPAuth();
    cy.get(OTPSelectors.submitOTP).click();

    cy.get(passwordSelector.password).type(credentials.password);
    cy.get(passwordSelector.submitPassword).click();

    cy.get(organisationSelector.organisation).type("a");
    cy.get(organisationSelector.subdomain).type('a')
    cy.get(organisationSelector.googleEnable).click();
    cy.get(organisationSelector.signupBtn).click();

    cy.get(messageSelector.suggestion).should('have.text',texts.orgMinimumCharacterSuggestion);

  });
});