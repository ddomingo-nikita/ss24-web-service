import {describe, expect, test} from "@jest/globals";
import {caesarCipher} from "./cryptography.js";

describe("Cesar Cypher tests",  ()=>{
    test("Encrypt Nikita with default key", ()=>{
        const result = caesarCipher("Nikita", true)
        expect(result).toEqual("qlnlwd")
    })

    test("Encrypt Nikita with 5 key", ()=>{
        const result = caesarCipher("Nikita", true, 5)
        expect(result).toEqual("snpnyf")
    })

    test("Decrypt Nikita with 5 key", ()=>{
        const result = caesarCipher("Nikita", true, 5)
        expect(caesarCipher(result, false, 5)).toEqual("nikita")
    })

    test("Decrypt ABCDEFGH with 27 key", ()=>{
        const result = caesarCipher("Y", true, 50)
        expect(caesarCipher(result, false, 50)).toEqual("y")
    })



})