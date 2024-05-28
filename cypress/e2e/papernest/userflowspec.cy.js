describe('Full flow happy path', () => {

  let date = new Date();
  let today = date.getDate();

  it('passes', () => {
    cy.visit('https://app.papernest.com/onboarding?anonymous&anonymousId=test&id_text=1&destination=newspaper')
    cy.get('button').contains('span', 'Commencer').click()
    cy.get("[id='poste-subscription.begin_date']").click()
    cy.get('button').contains('span', today).click() 
  })
})

