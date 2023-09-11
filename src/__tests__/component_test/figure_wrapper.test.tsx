import React from 'react';
import { getByRole, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import FigureWrapper from '../../components/figure_wrapper';

describe('FigureWrapper', () => {
  it('renders with children and src', () => {

    const children = 'This is the caption text';
    const src = '';

    const { getByText, getByAltText } = render(
      <FigureWrapper src={src}>{children}</FigureWrapper>
    );

    const captionElement = getByText(children);

    expect(captionElement).toBeInTheDocument();
  });
});