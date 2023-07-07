
/**
 * Method to covert Deg, Min & Sec to Decimal Degrees for GPS location - Longitude and Latitude 
 * @param latOrLong 
 * @param ref 
 * @returns 
 */
export  function degMinSecToDeg(latOrLong: Array<number>, ref?: string): string {
  
  const direction = ref? ref : 'N'

  let dd = latOrLong[0] + (latOrLong[1]/60) + (latOrLong[2]/3600)
  dd = (direction=='N' || direction =='E') ? dd : dd * -1

  return  String(dd.toFixed(4))
}