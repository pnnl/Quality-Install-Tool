import { toPath } from 'lodash'

type NonEmptyArray<T> = [T, ...Array<T>]

function _immutableUpsert<T>(
    path: NonEmptyArray<string>,
    sender: T,
    value: unknown,
): T {
    const [propName, ...nextPath] = path

    const receiver: any =
        typeof sender === 'object'
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

export function immutableUpsert<T>(path: string, sender: T, value: unknown): T {
    return _immutableUpsert<T>(
        toPath(path) as NonEmptyArray<string>,
        sender,
        value,
    )
}
