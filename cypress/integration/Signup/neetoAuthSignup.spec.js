 /// <reference types="cypress" />

import { sigupSelectors,  infoDetailsSelectors, OTPSelectors, passwordSelector, organisationSelector, cancelSelectors, profileDashboard, messageSelector } from '../../constants/selectors/selectors'
import { texts } from '../../constants/texts/texts'
import { routes } from '../../constants/routes/routes'
import { formFill } from '../../utils/formFill';
const faker = require('faker');

describe("NeetoAuth Signup Test Suite",() => {
  let orgName = "BigBinary";
  let invalidOTP = "123756";
  let invalidPassword = 'meow';
  let randomPassword = faker.internet.password();
  let randomOrgName = faker.random.word();

  beforeEach(() => {
     formFill();
  });

  it("Should be able to signup",() => {
    cy.get(infoDetailsSelectors.submitProfile).click(); 

    cy.OTPAuth(routes.postRequestOTP);
    cy.get(OTPSelectors.submitOTP).click();

    cy.get(passwordSelector.password).type(randomPassword);
    cy.get(passwordSelector.submitPassword).click();

    cy.get(organisationSelector.organisation).type(randomOrgName);
    cy.get(organisationSelector.subdomain).should('not.have.value', '');
    cy.get(organisationSelector.googleEnable).click();
    cy.get(organisationSelector.signupBtn).click();

    cy.get(profileDashboard.header).should('have.text',texts.profileDashboardTitle);

  });

  it("Should suggest new subdomain, if subdomain is not available",() => {
    cy.get(infoDetailsSelectors.submitProfile).click();

    cy.OTPAuth(routes.postRequestOTP);
    cy.get(OTPSelectors.submitOTP).click();

    cy.get(passwordSelector.password).type(randomPassword);
    cy.get(passwordSelector.submitPassword).click();

    cy.get(organisationSelector.organisation).type(orgName);
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

    cy.get(OTPSelectors.OTP).type(invalidOTP);
    cy.get(OTPSelectors.submitOTP).click();
    cy.get(messagesSelector.messageBox).should('have.text',texts.wentWrong);

  });

  it("Setting up the password less than 5 character",() => {
    cy.get(infoDetailsSelectors.submitProfile).click(); 

    cy.OTPAuth(routes.postRequestOTP);
    cy.get(OTPSelectors.submitOTP).click();

    cy.get(passwordSelector.password).type(invalidPassword);
    cy.get(passwordSelector.submitPassword).click();

  });

  it("Should give an suggestive warning when organisation name less than 2 characters is passed",() => {
    cy.get(infoDetailsSelectors.submitProfile).click(); 

    cy.OTPAuth(routes.postRequestOTP);
    cy.get(OTPSelectors.submitOTP).click();

    cy.get(passwordSelector.password).type(randomPassword);
    cy.get(passwordSelector.submitPassword).click();

    cy.get(organisationSelector.organisation).type("a");
    cy.get(organisationSelector.subdomain).type('a')
    cy.get(organisationSelector.googleEnable).click();
    cy.get(organisationSelector.signupBtn).click();

    cy.get(messageSelector.suggestion).should('have.text',texts.orgMinimumCharacterSuggestion);

  });
});