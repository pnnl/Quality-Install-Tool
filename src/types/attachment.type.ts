
import DegMinSecCRef from "./deg_min_sec_cref.type"
import JSONValue from './json_value.type'

interface Attachment  {
  blob: Blob,
  digest?: string,
  metadata: Record<string, any>,
}

export default Attachment