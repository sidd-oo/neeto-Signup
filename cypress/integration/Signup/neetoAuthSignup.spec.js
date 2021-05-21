 /// <reference types="cypress" />

import { sigupSelectors,  infoDetailsSelectors, OTPSelectors, passwordSelector, organisationSelector, cancelSelectors, profileDashboard, messageSelector } from '../../constants/selectors/selectors'

describe("NeetoAuth Signup Test Suite",() => {
  let credentials; 
  beforeEach(() => {
    cy.fixture('metaData').then( info => {
        credentials = info;
        cy.visit('/signups/new');
        cy.get(sigupSelectors.email).type(credentials.signupEmail);
        cy.get(sigupSelectors.submitEmail).click();
        
        cy.get(infoDetailsSelectors.firstName).clear().type(credentials.firstName);
        cy.get(infoDetailsSelectors.lastName).clear().type(credentials.lastName);
        cy.get(infoDetailsSelectors.country).type('India{downarrow}{enter}')
        cy.get(infoDetailsSelectors.timezone).type('Asia/Kolkata - UTC +5:30')
        cy.get(infoDetailsSelectors.DDMMYYYY).click();
      })
  });

  it("SignUp using a new email",() => {
    cy.get(infoDetailsSelectors.submitProfile).click(); 

    cy.OTPAuth();
    cy.get(OTPSelectors.submitOTP).click();

    cy.get(passwordSelector.password).type(credentials.password);
    cy.get(passwordSelector.submitPassword).click();

    cy.get(organisationSelector.organisation).type(credentials.organisation);
    cy.get(organisationSelector.subdomain).should('not.have.value', '');
    cy.get(organisationSelector.googleEnable).click();
    cy.get(organisationSelector.signupBtn).click();

    cy.get(profileDashboard.header).should('have.text',"Organization Settings");

  });

  it("Should suggest new subdomain, if subdomain is not available",() => {
    cy.get(infoDetailsSelectors.submitProfile).click();

    cy.OTPAuth();
    cy.get(OTPSelectors.submitOTP).click();

    cy.get(passwordSelector.password).type(credentials.password);
    cy.get(passwordSelector.submitPassword).click();

    cy.get(organisationSelector.organisation).type("BigBinary");
    cy.get(organisationSelector.subdomain).should('not.have.value', '');

    cy.contains("Subdomain 'bigbinary' is not available").should("be.visible");

  });

  it("Cancelling the SignUp process",() => {
    cy.get(cancelSelectors.cancelSignup).click();
    cy.get(cancelSelectors.cancelSubmit).click();
    cy.location().should(loc => {
          expect(loc.toString()).to.eq('https://app.neetoauth.com/login');
      });

  });

  it("Abotting the cancellation of SignUp process",() => {
    cy.get(cancelSelectors.cancelSignup).click();
    cy.get(cancelSelectors.cancelModal).click();
    cy.get(infoDetailsSelectors.signupProfileForm).should('be.visible');

  });

  it("Entering invalid 6 digit OTP",() => {
    cy.get(infoDetailsSelectors.submitProfile).click(); 

    cy.get(OTPSelectors.OTP).type("123756");
    cy.get(OTPSelectors.submitOTP).click();
    cy.get(messagesSelector.messageBox).should('have.text',"Something went wrong.");

  });

  it("Setting up the password less than 5 character",() => {
    cy.get(infoDetailsSelectors.submitProfile).click(); 

    cy.OTPAuth();
    cy.get(OTPSelectors.submitOTP).click();

    cy.get(passwordSelector.password).type('meow');
    cy.get(passwordSelector.submitPassword).click();

  });

  it.only("Entering organisation name less than 2 characters",() => {
    cy.get(infoDetailsSelectors.submitProfile).click(); 

    cy.OTPAuth();
    cy.get(OTPSelectors.submitOTP).click();

    cy.get(passwordSelector.password).type(credentials.password);
    cy.get(passwordSelector.submitPassword).click();

    cy.get(organisationSelector.organisation).type("a");
    cy.get(organisationSelector.subdomain).type('a')
    cy.get(organisationSelector.googleEnable).click();
    cy.get(organisationSelector.signupBtn).click();

    cy.get(messageSelector.suggestion).should('have.text','Please enter minimum 2 characters');

  });
});