import { isUndefined, toPath } from 'lodash'

const pathRegex = /^(?![-])(?!.*[-]$)[a-z0-9-]{1,64}$/
const prefixRegex = /^[a-z0-9]{1,64}$/

/**
 * Utility function used to convert a string path into a string 
 * suitable as an html id value
 * 
 * @param path A string representing a path into a JSON-like object
 * (e.g. ""location[1].state"")
 * @param prefix (OPTIONAL) A string used as a first path component (default: "path")
 * @returns 
 */
export function pathToId(path: string, prefix?: string): string {
  if (!prefix){
    prefix = "path";
  }
  const separator = "-"
  
  const wholePath = [prefix, ...toPath(path)].join(separator);
  if(!pathRegex.test(wholePath)){
    throw new Error("result path name " + wholePath +" is not allowed"); //TODO: decide what to do when not pass
  } else if(!prefixRegex.test(prefix)){
    throw new Error("prefix name " + prefix +" is not allowed"); //TODO: decide what to do when not pass
  }
  else {
    return wholePath
  }
}