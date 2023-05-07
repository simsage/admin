import React from 'react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Fetch from '../fetch'

const server = setupServer(
    rest.get('/greeting', (req, res, ctx) => {
        return res(ctx.json({greeting: 'hello there'}))
    }),
)