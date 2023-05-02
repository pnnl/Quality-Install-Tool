
import DegMinSecCRef from "./deg_min_sec_cref.type"
import JSONValue from './json_value.type'

interface PhotoMetadata  {
  geolocation: {
    altitude?: string | null,
    latitude: DegMinSecCRef | null,
    longitude: DegMinSecCRef | null,
  },
  // TODO: replace string with more precise type
  timestamp: string | null,
}

export default PhotoMetadata