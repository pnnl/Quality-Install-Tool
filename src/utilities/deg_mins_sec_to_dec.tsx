/**
 * Method to covert Deg, Min & Sec to Decimal Degrees for GPS location - Longitude and Latitude
 * @param latOrLong
 * @param ref
 * @returns
 */
export function degMinSecToDeg(latOrLong: Array<number>, ref?: string): string {
    let dd = latOrLong[0] + latOrLong[1] / 60 + latOrLong[2] / 3600
    dd = ref == 'S' || ref == 'W' ? dd * -1 : dd

    return String(dd.toFixed(4))
}
