// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to login
 * @param {string} email - User email
 * @param {string} password - User password
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

/**
 * Custom command to logout
 */
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
  cy.reload();
});

/**
 * Custom command to check if user is logged in
 */
Cypress.Commands.add('checkLoggedIn', () => {
  cy.window().its('localStorage').should('exist');
});
