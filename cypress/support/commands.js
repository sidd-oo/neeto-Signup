// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('OTPAuth', () => {
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
})