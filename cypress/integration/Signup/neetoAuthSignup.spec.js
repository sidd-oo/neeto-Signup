 /// <reference types="cypress" />

 describe("NeetoAuth Signup Test Suite",() => {
    let credentials;
    beforeEach(() => {
        cy.fixture('metaData').then(info => {
            credentials = info;
    })
    });
     it("SignUp using a new email",() => {
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

        cy.get('[data-cy=signup-organization-name-text-field]').type(credentials.organisation);
        cy.get('[data-cy=signup-organization-subdomain-text-field]').type(credentials.subdomain);
        cy.get('[data-cy=signup-organization-enable-google-login-checkbox]').click();
        cy.get('[data-cy=signup-organization-submit-button]').click();

        cy.get('[data-cy=heading]').should('have.text',"Organization Settings");
     })
 })