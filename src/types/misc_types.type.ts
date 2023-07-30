'use strict';

export type Objectish = AnyObject | AnyArray;
export type AnyObject = {[key: string]: any};
export type AnyArray = Array<any>;
export type NonEmptyArray<T> = [T, ...Array<T>];