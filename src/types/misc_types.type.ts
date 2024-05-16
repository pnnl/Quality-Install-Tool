'use strict'

import JSONValue from './json_value.type'

export type Objectish = AnyObject | AnyArray | JSONValue
export type AnyObject = { [key: string]: any }
export type AnyArray = Array<any>
export type NonEmptyArray<T> = [T, ...Array<T>]
