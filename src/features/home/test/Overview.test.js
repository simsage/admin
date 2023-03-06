// import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {renderWithProviders} from "../../../utilities/test-utils";
import KnowledgeBaseHome from "../../knowledge_bases/KnowledgeBaseHome";
import Home from "../Home";

const organization_id = '01866e90-94c4-34bc-4fdd-56c20770b2d7'
const url = '/knowledgebase/' + encodeURIComponent(organization_id);

export const handlers = [
    rest.get(url, (req, res, ctx) => {
        return res(ctx.json('John Smith'), ctx.delay(150))
    })
]

const server = setupServer(...handlers)

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())


// Disable API mocking after the tests are done.
afterAll(() => server.close())

test('fetches & receives a user after clicking the fetch user button', async () => {
    renderWithProviders(<Home />)
    expect(screen.getByText(/Home/i)).toBeInTheDocument()
    // expect(screen.getByTestId(/no user/i)).toBeInTheDocument()
    // expect(1).toBe(1)
})