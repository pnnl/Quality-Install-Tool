import { toPath } from 'lodash'

type NonEmptyArray<T> = [T, ...Array<T>]

function _immutableUpsert<T extends Array<unknown> | Record<string, unknown>>(
    path: NonEmptyArray<string>,
    sender: T,
    value: unknown,
): T {
    const [propName, ...nextPath] = path

    if (Array.isArray(sender)) {
        const receiver = [...sender]

        const index = parseInt(propName)

        receiver[index] =
            nextPath.length === 0
                ? value
                : _immutableUpsert(
                      nextPath as NonEmptyArray<string>,
                      sender[index] as Array<unknown> | Record<string, unknown>,
                      value,
                  )

        return receiver as T
    } else {
        return {
            ...sender,
            [propName]:
                nextPath.length === 0
                    ? value
                    : sender[propName] !== undefined
                      ? _immutableUpsert(
                            nextPath as NonEmptyArray<string>,
                            sender[propName] as
                                | Array<unknown>
                                | Record<string, unknown>,
                            value,
                        )
                      : sender[propName],
        }
    }
}

export function immutableUpsert<
    T extends Array<unknown> | Record<string, unknown>,
>(path: string, sender: T, value: unknown): T {
    return _immutableUpsert<T>(
        toPath(path) as NonEmptyArray<string>,
        sender,
        value,
    )
}
