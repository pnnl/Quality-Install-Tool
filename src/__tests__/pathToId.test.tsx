import { pathToId } from "../utilities/paths_utils";

describe('pathToId', () => {
    test('converts path to id with default prefix and separator', () => {
        const result = pathToId('location[1].state');
        expect(result).toBe('path-location-1-state');
      });
      
      test('converts path to id with custom prefix and separator', () => {
        const result = pathToId('location[1].state', 'custom', '_');
        expect(result).toBe('custom_location_1_state');
      });

      test('handles nested properties in JSON path', () => {
        const result = pathToId('user.profile.address.city');
        expect(result).toBe('path-user-profile-address-city');
      });

      test('handles special characters in JSON path', () => {
        const result = pathToId('user["first-name"].state[_CA_].city');
        expect(result).toBe('path-user-first-name-state-_CA_-city');
      });
  });