export const caesarCipher = (text, isEncrypt = false, key = 3) => {
    const alphabet = new Array(26).fill(1).map((_, i) => String.fromCharCode(97 + i));
    const validatedText = text.trim().toLowerCase()
    return isEncrypt ? encrypt(validatedText, alphabet, key) : decrypt(validatedText, alphabet, key)
}

const encrypt = (plaintext, alph, key) => {
    return [...plaintext].map(char => alph.includes(char) ? alph[(alph.indexOf(char) + key) % 26] : char).join('')
}

const decrypt = (ciphertext, alph, key) => {
    return [...ciphertext].map(char => alph.includes(char) ? alph[(26 + (alph.indexOf(ciphertext) - key) % 26) % 26] : char).join('')
}