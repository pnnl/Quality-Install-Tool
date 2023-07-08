
import GpsDecDegree from "./gps_decimal_degrees.type"
import JSONValue from './json_value.type'

interface PhotoMetadata  {
  geolocation: {
    altitude?: string | null,
    latitude: GpsDecDegree | null,
    longitude: GpsDecDegree | null,
  },
  // TODO: replace string with more precise type
  timestamp: string | null,
}

export default PhotoMetadata