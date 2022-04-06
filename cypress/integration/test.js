/// <reference types="cypress" />

describe('first', () => {
	before(() => {
		cy.visit('http://localhost:4173/')
	})

	it('changes accuracy settings', () => {
		cy.get('main').trigger('mousemove', { clientX: 100, clientY: 100 })
		cy.get(
			'body > main > div > div.fixed.h-full.z-2.overflow-x-hidden.overflow-y-scroll.scrollbar-thin.scrollbar-thumb-current.scrollbar-thumb-rounded.scrollbar-track-transparent.w-128 > div > div > div:nth-child(28) > div.bg-\\[var\\(--sub-color\\)\\].w-\\[1rem\\].h-\\[1rem\\].rounded-full.undefined.flex.justify-center.items-center.cursor-pointer'
		).click()
		cy.get('#infobar > div:nth-child(2)')
	})

	it('refreshes cache', () => {
		cy.get(
			'body > main > div > div.fixed.h-full.z-2.overflow-x-hidden.overflow-y-scroll.scrollbar-thin.scrollbar-thumb-current.scrollbar-thumb-rounded.scrollbar-track-transparent.w-128 > div > div > button:nth-child(58)'
		).click()
	})

	it('saves a theme', () => {
		cy.get(
			'body > main > div > div.fixed.h-full.z-2.overflow-x-hidden.overflow-y-scroll.scrollbar-thin.scrollbar-thumb-current.scrollbar-thumb-rounded.scrollbar-track-transparent.w-128 > div > div > input:nth-child(42)'
		).type('some epic name')
		cy.get(
			'body > main > div > div.fixed.h-full.z-2.overflow-x-hidden.overflow-y-scroll.scrollbar-thin.scrollbar-thumb-current.scrollbar-thumb-rounded.scrollbar-track-transparent.w-128 > div > div > button:nth-child(43)'
		).click()
	})
})
