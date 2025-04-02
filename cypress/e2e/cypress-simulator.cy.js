describe("cypress simulator", () => {
  beforeEach(() => {
    cy.login()

    cy.visit("./src/index.html?skipCaptcha=true", {
      onBeforeLoad(win) {
        win.localStorage.setItem("cookieConsent", "accepted")
      }
    })
  })

  it("executar um comando válido faltando parênteses", () => {
    cy.run("cy.visit")

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Error:")
      .and("contain", "Missing parentheses on `cy.visit` command")
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
    cy.run("cy.get('button')")

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
    cy.login()
    cy.visit("./src/index.html?skipCaptcha=true")
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