// Code snippet from https://dev.to/ankittanna/how-to-create-a-type-for-complex-json-object-in-typescript-d81
type JSONValue =
    | string
    | number
    | boolean
    | { [x: string]: JSONValue }
    | Array<JSONValue>

export default JSONValue
