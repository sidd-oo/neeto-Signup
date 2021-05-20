 /// <reference types="cypress" />

import selector from '../../support/selectors'

describe("NeetoAuth Signup Test Suite",() => {
  let credentials;
  beforeEach(() => {
    cy.fixture('metaData').then(info => {
        credentials = info;
        cy.visit('/signups/new');
        cy.get(selector.email).type(credentials.signupEmail);
        cy.get(selector.submitEmail).click();
        
        cy.get(selector.firstName).clear().type(credentials.firstName);
        cy.get(selector.lastName).clear().type(credentials.lastName);
        cy.get(selector.country).type('India{downarrow}{enter}')
        cy.get(selector.timezone).type('Asia/Kolkata - UTC +5:30')
        cy.get(selector.DDMMYYYY).click();
      })
  });

  it("SignUp using a new email",() => {
    cy.get(selector.submitProfile).click(); 

    cy.OTPAuth();
    cy.get(selector.submitOTP).click();

    cy.get(selector.password).type(credentials.password);
    cy.get(selector.submitPassword).click();

    cy.get(selector.organisation).type(credentials.organisation);
    cy.get(selector.subdomain).should('not.have.value', '');
    cy.get(selector.googleEnable).click();
    cy.get(selector.signupBtn).click();

    cy.get('[data-cy=heading]').should('have.text',"Organization Settings");

  });

  it("Should suggest new subdomain, if subdomain is not available",() => {
    cy.get(selector.submitProfile).click();

    cy.OTPAuth();
    cy.get(selector.submitOTP).click();

    cy.get(selector.password).type(credentials.password);
    cy.get(selector.submitPassword).click();

    cy.get(selector.organisation).type("BigBinary");
    cy.get('[data-cy=signup-organization-subdomain-text-field]').should('not.have.value', '');

    cy.contains("Subdomain 'bigbinary' is not available").should("be.visible");

  });

  it("Cancelling the SignUp process",() => {
    cy.get(selector.cancelSignup).click();
    cy.get(selector.cancelSubmit).click();
    cy.location().should(loc => {
          expect(loc.toString()).to.eq('https://app.neetoauth.com/login');
      });

  });

  it("Abotting the cancellation of SignUp process",() => {
    cy.get(selector.cancelSignup).click();
    cy.get(selector.cancelModal).click();
    cy.get(selector.signupProfileForm).should('be.visible');

  });

    it.only("Entering invalid 6 digit OTP",() => {
    cy.get(selector.submitProfile).click(); 

    cy.get('[data-cy=signup-otp-otp-number]').type("123756");
    cy.get(selector.submitOTP).click();
    cy.get('[data-cy=toastr-message-container]').should('have.text',"Something went wrong.");

  });

  it("Setting up the password less than 5 character",() => {
    cy.get(selector.submitProfile).click(); 

    cy.OTPAuth();
    cy.get(selector.submitOTP).click();

    cy.get(selector.password).type('meow');
    cy.get(selector.submitPassword).click();

  });

  it("Entering organisation name less than 2 characters",() => {
    cy.get(selector.submitProfile).click(); 

    cy.OTPAuth();
    cy.get(selector.submitOTP).click();

    cy.get(selector.password).type(credentials.password);
    cy.get(selector.submitPassword).click();

    cy.get(selector.organisation).type("a");
    cy.get(selector.subdomain).type('a')
    cy.get(selector.googleEnable).click();
    cy.get(selector.signupBtn).click();

    cy.get('#error_1').should('have.text','Please enter minimum 2 characters');

  });
});