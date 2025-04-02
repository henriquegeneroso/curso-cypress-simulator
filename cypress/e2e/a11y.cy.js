describe("cypress simulator - validações de acessibilidade", () => {
    beforeEach(() => {
        cy.login()

        cy.visit("./src/index.html?skipCaptcha=true&chancesOfError=0", {
            onBeforeLoad(win) {
                win.localStorage.setItem("cookieConsent", "accepted")
            }
        })

        cy.injectAxe()
    })

    it("executar um comando válido", () => {
        cy.run("cy.get('button')")

        cy.get("#outputArea", { timeout: 6000 })
            .should("contain", "Success:")
            .and("contain", "cy.get('button') // Got element by selector 'button'")
            .and("be.visible")

        cy.checkA11y(".success")
    })

    it("executar um comando inválido", () => {
        cy.run("cy.run()")

        cy.get("#outputArea", { timeout: 6000 })
            .should("contain", "Error:")
            .and("contain", "Invalid Cypress command: cy.run()")
            .and("be.visible")

        cy.checkA11y(".error")
    })

    it("executar um comando válido pendente de implementação", () => {
        cy.run("cy.contains('Login')")

        cy.get("#outputArea", { timeout: 6000 })
            .should("contain", "Warning:")
            .and("contain", "The `cy.contains` command has not been implemented yet.")
            .and("be.visible")

        cy.checkA11y(".warning")
    })

    it("pedir ajuda", () => {
        cy.run("help")

        cy.get("#outputArea", { timeout: 6000 })
            .should("contain", "Common Cypress commands and examples:")
            .and("contain", "For more commands and details, visit the official Cypress API documentation.")
            .and("be.visible")

        cy.contains("#outputArea a", "official Cypress API documentation")
            .should("have.attr", "href", "https://docs.cypress.io/api/table-of-contents")
            .and("have.attr", "target", "_blank")
            .and("have.attr", "rel", "noopener noreferrer")

        cy.checkA11y("#outputArea")
    })

    it("maximizar e minimizar o output", () => {
        cy.run("cy.get('button')")

        cy.get("#expandIcon")
            .should("be.visible")
            .click()

        cy.get("#outputArea", { timeout: 6000 })
            .should("contain", "Success:")
            .and("contain", "cy.get('button') // Got element by selector 'button'")
            .and("be.visible")

        cy.checkA11y()

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

    it("logout com sucesso", () => {
        cy.get("#sandwich-menu").click()
        cy.get("#logoutButton").click()
        cy.get("#login h2").should("have.text", "Let's get started!")
        cy.contains("button", "Login").should('be.visible')
        cy.checkA11y()
    })

    it("mostra e oculta o botão de logout", () => {
        cy.get("#sandwich-menu").click()
        cy.get("#logoutButton").should("be.visible")
        cy.checkA11y()
        cy.get("#sandwich-menu").click()
        cy.get("#logoutButton").should("not.be.visible")
    })

    it("estado de comando em execução antes de mostrar o resultado final", () => {
        cy.run("cy.get('button')")

        cy.get("#runButton")
            .should('be.disabled')
            .and("contain", "Running...")

        cy.get("#outputArea", { timeout: 6000 })
            .should("contain", "Running... Please wait.")
            .and('be.visible')

        cy.checkA11y()

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
})

describe("cypress simulator - consentimento de cookies - validações de acessibilidade", () => {
    beforeEach(() => {
        cy.login()
        cy.visit("./src/index.html?skipCaptcha=true")
        cy.injectAxe()
    })

    it("aceitar cookies", () => {
        cy.get("#cookieConsent").should("be.visible")
        cy.checkA11y()
        cy.contains("#cookieConsent button", "Accept").click()
        cy.get("#cookieConsent").should("not.be.visible")

        cy.window()
            .its("localStorage.cookieConsent")
            .should("eq", "accepted")
    })
})

describe("cypress simulator - captcha - validações de acessibilidade", () => {
    beforeEach(() => {
        cy.visit("./src/index.html")
        cy.contains("button", "Login").click()
        cy.injectAxe()
    })

    it("não deve encontrar problemas de acessibilidade em todos os estados do captcha (botão habilitado/desabilitado e erro)", () => {
        cy.get("#verifyCaptcha").should("be.disabled")

        cy.get("#captchaInput").type(1000)

        cy.get("#verifyCaptcha").should("be.enabled")
        cy.checkA11y()

        cy.get("#verifyCaptcha").click()

        cy.get("#captchaError")
            .should("contain", "Incorrect answer, please try again.")
            .and("be.visible")

        cy.get("#captchaInput").should("be.empty")
        cy.get("#verifyCaptcha").should("be.disabled")
        cy.checkA11y()
    })
})