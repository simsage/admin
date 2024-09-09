import {render, screen} from '@testing-library/react';
import {Pagination} from "../pagination";

describe("renders the pagination correctly", () => {
    it('with count 21, rows_per_page 10 and page 1', () => {
        render(<Pagination
            count={21}
            rowsPerPage={10}
            page={0} // page 1
            rowsPerPageOptions={[5, 10, 25]}/>);
        const pElement = screen.getByText(/page 1 of 3/i);
        expect(pElement).toBeInTheDocument();
    });

    it('with count 21, rows_per_page 5 and page 2', () => {
        render(<Pagination
            count={21}
            rowsPerPage={5}
            page={1} // page 2
            rowsPerPageOptions={[5, 10, 25]}/>);
        const pElement = screen.getByText(/page 2 of 5/i);
        expect(pElement).toBeInTheDocument();
    });


    it('with count 1, rows_per_page 10 and page 1', () => {
        render(<Pagination
            count={1}
            rowsPerPage={10}
            page={0} // page 1
            rowsPerPageOptions={[5, 10, 25]}/>);
        const pElement = screen.getByText(/page 1 of 1/i);
        expect(pElement).toBeInTheDocument();
    })


    it('with count 1, rows_per_page 10 and page 1', () => {
        render(<Pagination
            count={0}
            rowsPerPage={10}
            page={0} // page 1
            rowsPerPageOptions={[5, 10, 25]}/>);
        const pElement = screen.getByText(/page 1 of 0/i);
        expect(pElement).toBeInTheDocument();
    })

})

