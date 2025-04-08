import PouchDB from 'pouchdb'
import { type Base } from '../types/database.types'

function _hasErrors(source: Record<string, unknown>): boolean {
    for (const value of Object.values(source)) {
        if (Array.isArray(value)) {
            if (
                value.length > 0 &&
                (value.every(
                    currentValue => typeof currentValue === 'string',
                ) ||
                    value.some(currentValue => _hasErrors(currentValue)))
            ) {
                return true
            }
        } else if (typeof value === 'object') {
            if (_hasErrors(value as Record<string, unknown>)) {
                return true
            }
        }
    }

    return false
}

export function hasErrors(
    doc: PouchDB.Core.Document<Base> & PouchDB.Core.GetMeta,
): boolean {
    if (doc.metadata_.errors) {
        return _hasErrors(doc.metadata_.errors)
    } else {
        return false
    }
}

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
