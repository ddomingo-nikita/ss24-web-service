import {factorial, product} from './calculate';
import {test, describe, expect} from "@jest/globals"; // this is optional, all three are global variables im runner scope

describe('factorial', () => {

    test('5! is 120', () => {
        expect(factorial(5)).toBe(120)
    });

    test('0! is 1', () => {
        expect(factorial(0)).toBe(1)
    });

    test('Factorial of negative int is throwing exception ', () => {
        expect(() => {
            factorial(-5);
        }).toThrow();
    });

})


describe("product", ()=> {
        test('Testing n = 6, initial = 1', () => {
            expect(product(6, (k) => k, 2)).toBe(720)
        });
        test('Testing n = 5, initial = 1', () => {
            expect(product(5, (k) => k, 1)).toBe(120)
        });
        test('Testing n = -1, initial = 2', () => {
            expect(()=>product(-1, (k) => k, 2)).toThrow()
        });
    test('Testing n = 0, initial = 2', () => {
        expect(()=>product(0, (k) => k, 2)).toThrow()
    });
    test('Testing n = 3, term = k => k^2, initial 2', () => {
        expect(product(3, (k) => Math.pow(k, 2), 2)).toBe(36)
    });
    }
)

