import * as random from './random'
import {randomInt} from "./random";
import {jest, test, expect, beforeEach} from "@jest/globals"; // this is optional, all three are global variables im runner scope

import {randomRGBColor} from './color'

let mockFn = jest.fn();
random.randomInt = mockFn

beforeEach(()=>{
    mockFn = mockFn
        .mockReturnValue(0)
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(150)
        .mockReturnValueOnce(200);
})

test ('Random color generates 3-tuple', () => {

    const color = randomRGBColor();
    const [red, green, blue] = color

    expect(red).toBeGreaterThanOrEqual(100);
    expect(green).toBeGreaterThanOrEqual(150);
    expect(blue).toBeGreaterThanOrEqual(200);

    expect(mockFn).toHaveBeenCalledTimes(3);
});

test ('Mock stable value', ()=>{
    const spyRandomInt = jest.fn(()=>randomInt);

    spyRandomInt.mockReturnValue(100)
        .mockReturnValue(255)
        .mockReturnValue(260)


    random.randomInt = spyRandomInt

    const color = randomRGBColor();

    expect(color).toBeInstanceOf(Array);
    expect(color).toHaveLength(3);
    const [red, green, blue] = color

    expect(red).toBeGreaterThanOrEqual(0);
    expect(red).toBeLessThanOrEqual(255);



})
