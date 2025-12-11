import { render, screen } from '@testing-library/react';
import App from './App';

test('renders landing page title', () => {
  render(<App />);
  const titleElements = screen.getAllByText(/IQ-FIT/i);
  expect(titleElements.length).toBeGreaterThan(0);
});
