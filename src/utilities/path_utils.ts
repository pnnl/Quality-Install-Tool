import { isObject, toPath } from 'lodash'

type NonEmptyArray<T> = [T, ...Array<T>]

function _immutableUpsert<T>(
    path: NonEmptyArray<string>,
    sender: T,
    value: any,
): T {
    const [propName, ...nextPath] = path

    const receiver: any = isObject(sender)
        ? Array.isArray(sender)
            ? [...sender]
            : { ...sender }
        : isNaN(parseInt(propName))
          ? {}
          : []

    receiver[propName] =
        nextPath.length === 0
            ? value
            : _immutableUpsert(
                  nextPath as NonEmptyArray<string>,
                  receiver[propName],
                  value,
              )

    return receiver
}

export function immutableUpsert<T>(path: string, sender: T, value: any): T {
    return _immutableUpsert(
        toPath(path) as NonEmptyArray<string>,
        sender,
        value,
    )
}
