export type Validator<T> = (input: T) => string | undefined

export function isValid<T>(input: T, validators: Array<Validator<T>>): boolean {
    return validate<T>(input, validators).length === 0
}

export function validate<T>(
    input: T,
    validators: Array<Validator<T>>,
): Array<string> {
    return validators
        .map(validator => {
            return validator(input)
        })
        .filter(result => {
            return result !== undefined
        })
}
