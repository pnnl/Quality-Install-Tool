import { type Base } from '../types/database.types'

export type ComparablePropertyName = 'created_at' | 'last_modified_at'

export type Order = 'asc' | 'desc'

export type Comparator<T extends Base> = (a: T, b: T) => number

export function comparator<T extends Base>(
    prop: ComparablePropertyName,
    order: Order,
): Comparator<T> {
    switch (prop) {
        case 'created_at':
            switch (order) {
                case 'asc':
                    return (a, b) => {
                        const aDate = new Date(a.metadata_.created_at)
                        const bDate = new Date(b.metadata_.created_at)

                        return aDate.getTime() - bDate.getTime()
                    }
                case 'desc':
                    return (a, b) => {
                        const aDate = new Date(a.metadata_.created_at)
                        const bDate = new Date(b.metadata_.created_at)

                        return bDate.getTime() - aDate.getTime()
                    }
            }

            break
        case 'last_modified_at':
            switch (order) {
                case 'asc':
                    return (a, b) => {
                        const aDate = new Date(a.metadata_.last_modified_at)
                        const bDate = new Date(b.metadata_.last_modified_at)

                        return aDate.getTime() - bDate.getTime()
                    }
                case 'desc':
                    return (a, b) => {
                        const aDate = new Date(a.metadata_.last_modified_at)
                        const bDate = new Date(b.metadata_.last_modified_at)

                        return bDate.getTime() - aDate.getTime()
                    }
            }

            break
    }
}
