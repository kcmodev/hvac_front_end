import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('renders the spray button', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: 'Spray' })).toBeInTheDocument();
});
