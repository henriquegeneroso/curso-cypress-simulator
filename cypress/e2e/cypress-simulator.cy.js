describe("cypress simulator", () => {
  beforeEach(() => {
    cy.visit("./src/index.html?skipCaptcha=true", {
      onBeforeLoad(win) {
        win.localStorage.setItem("cookieConsent", "accepted")
      }
    })
    cy.contains("button", "Login").click()
  })

  it("executar um comando válido", () => {
    cy.get("#codeInput").type("cy.get('button')")
    cy.get("#runButton").click()

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Success:")
      .and("contain", "cy.get('button') // Got element by selector 'button'")
      .and("be.visible")
  })

  it("executar um comando inválido", () => {
    cy.get("#codeInput").type("cy.run()")
    cy.get("#runButton").click()

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Error:")
      .and("contain", "Invalid Cypress command: cy.run()")
      .and("be.visible")
  })

  it("executar um comando válido pendente de implementação", () => {
    cy.get("#codeInput").type("cy.contains('Login')")
    cy.get("#runButton").click()

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Warning:")
      .and("contain", "The `cy.contains` command has not been implemented yet.")
      .and("be.visible")
  })

  it("executar um comando válido faltando parênteses", () => {
    cy.get("#codeInput").type("cy.visit")
    cy.get("#runButton").click()

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Error:")
      .and("contain", "Missing parentheses on `cy.visit` command")
      .and("be.visible")
  })

  it("pedir ajuda", () => {
    cy.get("#codeInput").type("help")
    cy.get("#runButton").click()

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Common Cypress commands and examples:")
      .and("contain", "For more commands and details, visit the official Cypress API documentation.")
      .and("be.visible")

    cy.contains("#outputArea a", "official Cypress API documentation")
      .should("have.attr", "href", "https://docs.cypress.io/api/table-of-contents")
      .and("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer")
  })

  it("maximizar e minimizar o output", () => {
    cy.get("#codeInput").type("cy.get('button')")
    cy.get("#runButton").click()

    cy.get("#expandIcon")
      .should("be.visible")
      .click()

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Success:")
      .and("contain", "cy.get('button') // Got element by selector 'button'")
      .and("be.visible")

    cy.get("#expandIcon").should("not.be.visible")

    cy.get("#collapseIcon")
      .should("be.visible")
      .click()

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Success:")
      .and("contain", "cy.get('button') // Got element by selector 'button'")
      .and("be.visible")

    cy.get("#collapseIcon").should("not.be.visible")
  })

  it("logout", () => {
    cy.get("#sandwich-menu").click()
    cy.get("#logoutButton").click()
    cy.get("#login h2").should("have.text", "Let's get started!")
    cy.contains("button", "Login").should('be.visible')
  })

  it("mostra e oculta o botão de logout", () => {
    cy.get("#sandwich-menu").click()
    cy.get("#logoutButton").should("be.visible")
    cy.get("#sandwich-menu").click()
    cy.get("#logoutButton").should("not.be.visible")
  })

  it("estado de comando em execução", () => {
    cy.get("#codeInput").type("cy.get('button')")

    cy.get("#runButton")
      .click()

    cy.get("#runButton")
      .should('be.disabled')
      .and("contain", "Running...")

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Running... Please wait.")
      .and('be.visible')

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Success:")
      .and("contain", "cy.get('button') // Got element by selector 'button'")
      .and("be.visible")

    cy.get("#runButton")
      .should('be.enabled')
      .and("not.contain", "Running...")
      .and("contain", "Run")
      .and("be.visible")
  })

  it("estados habilitado/desabilitado botão de executar", () => {
    cy.get("#runButton").should("be.disabled")
    cy.get("#codeInput").type("cy.get('button')")
    cy.get("#runButton").should("be.enabled")
    cy.get("#codeInput").clear()
    cy.get("#runButton").should("be.disabled")
  })

  it("resetar campo de texto e botão de executar ao deslogar e logar", () => {
    cy.get("#codeInput").type("cy.get('button')")
    cy.get("#sandwich-menu").click()
    cy.get("#logoutButton").click()
    cy.contains("button", "Login").click()
    cy.get("#codeInput").should("be.empty")
    cy.get("#runButton").should("be.disabled")
  })

  it("resetar output ao deslogar e logar", () => {
    cy.get("#codeInput").type("cy.get('button')")
    cy.get("#runButton").click()

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Success:")
      .and("contain", "cy.get('button') // Got element by selector 'button'")
      .and("be.visible")

    cy.get("#sandwich-menu").click()
    cy.get("#logoutButton").click()
    cy.contains("button", "Login").click()
    cy.get("#codeInput").should("be.empty")
    cy.get("#runButton").should("be.disabled")
    cy.get("#outputArea").should("be.empty")
  })

  it("não mostrar banner de cookies ao deslogar", () => {
    cy.clearAllLocalStorage()
    cy.reload()
    cy.get("#cookieConsent").should("not.be.visible")
  })
})

describe("cypress simulator - consentimento de cookies", () => {
  beforeEach(() => {
    cy.visit("./src/index.html?skipCaptcha=true")
    cy.contains("button", "Login").click()
  })

  it("aceitar cookies", () => {
    cy.get("#cookieConsent").should("be.visible")
    cy.contains("#cookieConsent button", "Accept").click()
    cy.get("#cookieConsent").should("not.be.visible")

    cy.window()
      .its("localStorage.cookieConsent")
      .should("eq", "accepted")
  })

  it("rejeitar cookies", () => {
    cy.get("#cookieConsent").should("be.visible")
    cy.contains("#cookieConsent button", "Decline").click()
    cy.get("#cookieConsent").should("not.be.visible")

    cy.window()
      .its("localStorage.cookieConsent")
      .should("eq", "declined")
  })
})

describe("cypress simulator - captcha", () => {
  beforeEach(() => {
    cy.visit("./src/index.html")
    cy.contains("button", "Login").click()
  })

  it("estados do botão de verificar captcha", () => {
    cy.get("#verifyCaptcha").should("be.disabled")
    cy.get("#captchaInput").type(1000)
    cy.get("#verifyCaptcha").should("be.enabled")
    cy.get("#captchaInput").clear()
    cy.get("#verifyCaptcha").should("be.disabled")
  })

  it("erros de captcha", () => {
    cy.get("#captchaInput").type(1000)
    cy.get("#verifyCaptcha").click()

    cy.get("#captchaError")
      .should("contain", "Incorrect answer, please try again.")
      .and("be.visible")

    cy.get("#verifyCaptcha").should("be.disabled")
    cy.get("#captchaInput").should("be.empty")
  })
})