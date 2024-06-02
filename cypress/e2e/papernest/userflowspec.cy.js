require('cypress-xpath');


function generateRandomEmail() {
  
  function generateRandomString(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  }

  
  const username = generateRandomString(10); 
  const domain = '-test@papernest.com';

  
  const email = `sergio.soto_${username}${domain}`;
  
  return email;
}


function getMonthNameInFrench(monthIndex) {
  
  if (monthIndex < 0 || monthIndex > 11) {
      throw new Error('El índice del mes debe estar entre 0 y 11');
  }

  
  const date = new Date(2021, monthIndex); 

  
  const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(date);

  return monthName;
}

function getDayNameInFrench(dateString) {
 
  const date = new Date(dateString);

  const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(date);

  return dayName;
}

function capitalizeFirstLetter(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}




let date = new Date();
let today = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();
let currentDay = (today+" "+ getMonthNameInFrench(month) + " " + year);

let nameDay = getDayNameInFrench(date);
nameDay = capitalizeFirstLetter(nameDay);



describe('Full flow happy path', () => { 

  const randomEmail = generateRandomEmail();

  let userEmail = randomEmail
  let oldHousingAdress = '1 Paris 83170 Brignoles'
  let housingAddress = '1 Paris 41100 Rocé'
  let countryCode = 'Spain (España)'
  let phoneNumber = '640123123'
  let firstName = 'Sergio'
  let lastName = 'Soto'

  it('passes', () => {
    cy.visit('https://app.papernest.com/onboarding?anonymous&anonymousId=test&id_text=1&destination=newspaper')
    cy.get('button').contains('span', 'Commencer').click()
    cy.get("[id='poste-subscription.begin_date']").click()
    cy.xpath("//button[@aria-label='"+currentDay+"']").click() 
    cy.get("[id='old_housing.address']").type(oldHousingAdress)
    cy.get('.ng-star-inserted').contains('p', oldHousingAdress).click()
    cy.get("[id='housing.address']").type(housingAddress)
    cy.get('.ng-star-inserted').contains('p', housingAddress).click()
    cy.xpath('//button[@id="button_next"]').click()


    cy.xpath('//button[@id="offer_poste_12"]').click()

    cy.get("[id='user.email']").should('have.attr', 'type', 'email').type(userEmail,'{tab}')
  
    cy.get('.selected-flag').click()

    cy.get('.country-list').
      find('li')
      .contains('p', countryCode)
      .click()

    cy.get("[id='user.phone_number']").type(phoneNumber,'{tab}')    
    cy.get("[id='user.civility-mister']").click()
    cy.get("[id='user.first_name']").type(firstName,'{tab}')
    cy.get("[id='user.last_name']").type(lastName,'{tab}')
    cy.wait(3000);
    cy.get("[id='button_next']").should('be.enabled').click();
    cy.get("[id='poste-subscription.confirmation_code_destination-home']").click()
    cy.wait(3000);
    cy.get("[id='button_next']").should('be.enabled').click();


    cy.xpath('//div[@id="{poste-subscription.begin_date|dateTimeFormat:fr:dddd D MMMM YYYY}"]/div/div[contains(@class, "summary__line__value") and contains(text(), "' + nameDay + " " + currentDay + '")]')
            .should('be.visible')
            .and('have.text',nameDay + " " + currentDay)
    cy.xpath('//div[@id="{poste-subscription.offer_name}"]/div/div[contains(@class, "summary__line__value") and contains(text(), "LA POSTE Redirection contrat 12 mois")]').should('have.text','LA POSTE Redirection contrat 12 mois')
    cy.xpath('//div[@id="{old_housing.address}"]/div/div[contains(@class, "summary__line__value") and contains(text(), "1 Paris 83170 Brignoles")]').should('have.text',oldHousingAdress)
    cy.xpath('//div[@id="{housing.address}"]/div/div[contains(@class, "summary__line__value") and contains(text(), "1 Paris 41100 Rocé")]').should('have.text',housingAddress)
    cy.xpath('//div[@id="{user.civility} {user.first_name} {user.last_name}"]/div/div[contains(@class, "summary__line__value") and contains(text(), "M. Sergio Soto")]').should('have.text','M. '+ firstName + " " + lastName+'')
    cy.xpath('//div[@id="{user.email}"]/div/div[contains(@class, "summary__line__value") and contains(text(), "'+userEmail+'")]').should('have.text',userEmail)
    cy.xpath('//div[@id="{user.phone_number}"]/div/div[contains(@class, "summary__line__value") and contains(text(), "+34640123123")]').should('have.text','+34640123123')
    cy.xpath('//div[@id="{poste-subscription.confirmation_code_destination}"]/div/div[contains(@class, "summary__line__value") and contains(text(), "À la maison")]').should('have.text','À la maison')


    cy.get("[id='poste-subscription.comments']").type('Test automated Cypress Sergio Soto using the email ' +userEmail+'')

    cy.get("[id='button_next_summary']").should('be.enabled').click();

  })
})

