import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Import the DateInputWrapper component
import DateInputWrapper from '../../components/date_input_wrapper';
import { pathToId } from '../../utilities/paths_utils';

jest.mock('../../components/store', () => ({
  StoreContext: {
    Consumer: ({ children }) => children({ data: {}, upsertData: jest.fn() }), // Mock context values
  },
}));

describe('DateInputWrapper', () => {
  it('renders with correct props and handles value change', () => {
    // Arrange
    const label = 'Test Label';
    const path = 'test.path';

    // Render the DateInputWrapper component
    const { getByLabelText } = render(<DateInputWrapper label={label} path={path} />);

    const inputElement = getByLabelText(label);

    expect(inputElement).toHaveAttribute('id', 'input-test-path');
    expect(inputElement).toHaveValue('');

    fireEvent.change(inputElement, { target: { value: '2020-05-24' } });

    expect(inputElement).toHaveValue('2020-05-24');
  });
});
