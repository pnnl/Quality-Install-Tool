/**
 * Converts a string into a number. Returns null if the string cannot be converted to a valid number.
 * @param input - The input string to be converted.
 * @returns - The converted number, or null if the conversion fails.
 */
function parseNumberOrNull(input: string): number | null {
    const parsedNumber = Number(input)
    return isNaN(parsedNumber) ? null : parsedNumber
}

export default parseNumberOrNull
