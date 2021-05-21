import { routes } from '../constants/routes/routes'
import { sigupSelectors , infoDetailsSelectors} from '../constants/selectors/selectors'
const faker = require('faker');

let randomEmail = faker.internet.email(); 
let randomFirstName = faker.name.firstName();
let randomLastName = faker.name.lastName();


export const formFill = () => {
    cy.visit(routes.signupRoute);
    cy.get(sigupSelectors.email).type(randomEmail);
    cy.get(sigupSelectors.submitEmail).click();
        
    cy.get(infoDetailsSelectors.firstName).clear().type(randomFirstName);
    cy.get(infoDetailsSelectors.lastName).clear().type(randomLastName);
    cy.get(infoDetailsSelectors.country).type('India{downarrow}{enter}')
    cy.get(infoDetailsSelectors.timezone).type('Asia/Kolkata - UTC +5:30')
    cy.get(infoDetailsSelectors.DDMMYYYY).click();
}