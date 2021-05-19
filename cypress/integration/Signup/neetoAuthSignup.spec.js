 /// <reference types="cypress" />

import selector from '../../support/selectors'

describe("NeetoAuth Signup Test Suite",() => {
  let credentials;
  beforeEach(() => {
    cy.fixture('metaData').then(info => {
        credentials = info;
    })
  });

  it.only("SignUp using a new email",() => {
    cy.visit('/signups/new');

    cy.get(selector.email).type(credentials.signupEmail);
    cy.get(selector.submitEmail).click();

    cy.get(selector.firstName).clear().type(credentials.firstName);
    cy.get(selector.lastName).clear().type(credentials.lastName);
    cy.get(selector.country).type('India{downarrow}{enter}')
    cy.get(selector.timezone).type('Asia/Kolkata - UTC +5:30')
    cy.get(selector.DDMMYYYY).click();
    cy.get(selector.submitProfile).click();  

    cy.get('[name="csrf-token"]').then( val => {
        let csrfTokenMeta = val;
        cy.request({ 
            method: 'POST',
            url: '/api/v1/signups/otp_generation',
            failOnStatusCode: false, 
            form: true, 
            body: {
                authenticity_token: csrfTokenMeta.attr("content"),
            },
        }).then(res => {
            expect(res.status).to.eq(200);
            cy.get(selector.OTP).type(res.body.otp);
        })
        })
        cy.get(selector.submitOTP).click();

        cy.get(selector.password).type(credentials.password);
        cy.get(selector.submitPassword).click();

        cy.get(selector.organisation).type(credentials.organisation);
        cy.get(selector.subdomain).should('not.have.value', '');
        cy.get(selector.googleEnable).click();
        cy.get(selector.signupBtn).click();

        cy.get('[data-cy=heading]').should('have.text',"Organization Settings");
     });

  it("If Subdomain already exist and it suggest new subdomain",() => {
    cy.visit('/signups/new');

    cy.get('[data-cy=signup-email-text-field]').type(credentials.signupEmail);
    cy.get('[data-cy=signup-email-submit-button]').click();

    cy.get('[data-cy=signup-profile-first-name-text-field]').clear().type(credentials.firstName);
    cy.get('[data-cy=signup-profile-last-name-text-field]').clear().type(credentials.lastName);
    cy.get('[data-cy=select-country-select-container-wrapper]').type('India{downarrow}{enter}')
    cy.get('[data-cy=select-time-zone-select-container-wrapper]').type('Asia/Kolkata - UTC +5:30')
    cy.get(':nth-child(2) > [data-cy=signup-profile-date-format-radio]').click();
    cy.get('[data-cy=signup-profile-submit-button]').click();  

    cy.get('[name="csrf-token"]').then( val => {
        let csrfTokenMeta = val;
        cy.request({ 
            method: 'POST',
            url: '/api/v1/signups/otp_generation',
            failOnStatusCode: false, 
            form: true, 
            body: {
                authenticity_token: csrfTokenMeta.attr("content"),
            },
        }).then(res => {
            expect(res.status).to.eq(200);
            cy.get('[data-cy=signup-otp-otp-number]').type(res.body.otp);
        })
        })
        cy.get('[data-cy=signup-otp-submit-button]').click();

        cy.get('[data-cy=signup-password-password-text-field]').type(credentials.password);
        cy.get('[data-cy=signup-password-submit-button]').click();

        cy.get('[data-cy=signup-organization-name-text-field]').type("BigBinary");
        cy.get('[data-cy=signup-organization-subdomain-text-field]').should('not.have.value', '');

        cy.contains("Subdomain 'bigbinary' is not available").should("be.visible");
     });

  it("Cancelling the SignUp process",() => {
    cy.visit('/signups/new');

    cy.get('[data-cy=signup-email-text-field]').type(credentials.signupEmail);
    cy.get('[data-cy=signup-email-submit-button]').click();

    cy.get('[data-cy=signup-profile-first-name-text-field]').clear().type(credentials.firstName);
    cy.get('[data-cy=signup-profile-last-name-text-field]').clear().type(credentials.lastName);
    cy.get('[data-cy=select-country-select-container-wrapper]').type('India{downarrow}{enter}')
    cy.get('[data-cy=select-time-zone-select-container-wrapper]').type('Asia/Kolkata - UTC +5:30')
    cy.get(':nth-child(2) > [data-cy=signup-profile-date-format-radio]').click();

    cy.get('[data-cy=signup-cancel-link]').click();
    cy.get('[data-cy=modal-submit-button]').click();
    cy.location().should(loc => {
          expect(loc.toString()).to.eq('https://app.neetoauth.com/login');
      });
    
  });

  it("Abotting the cancellation of SignUp process",() => {
    cy.visit('/signups/new');

    cy.get('[data-cy=signup-email-text-field]').type(credentials.signupEmail);
    cy.get('[data-cy=signup-email-submit-button]').click();

    cy.get('[data-cy=signup-profile-first-name-text-field]').clear().type(credentials.firstName);
    cy.get('[data-cy=signup-profile-last-name-text-field]').clear().type(credentials.lastName);
    cy.get('[data-cy=select-country-select-container-wrapper]').type('India{downarrow}{enter}')
    cy.get('[data-cy=select-time-zone-select-container-wrapper]').type('Asia/Kolkata - UTC +5:30')
    cy.get(':nth-child(2) > [data-cy=signup-profile-date-format-radio]').click();

    cy.get('[data-cy=signup-cancel-link]').click();
    cy.get('[data-cy=modal-cancel-button]').click();
    cy.get('[data-cy=signup-profile-form]').should('be.visible');
    
  });
});