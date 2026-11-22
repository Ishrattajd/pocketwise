import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { BottomNav } from '../BottomNav';

describe('BottomNav component', () => {
  it('renders all 5 navigation tabs', () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('Scholarships')).toBeInTheDocument();
    expect(screen.getByText('Jobs')).toBeInTheDocument();
  });

  it('contains correct href links for each tab', () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>
    );

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Expenses').closest('a')).toHaveAttribute('href', '/expenses');
    expect(screen.getByText('Goals').closest('a')).toHaveAttribute('href', '/goals');
    expect(screen.getByText('Scholarships').closest('a')).toHaveAttribute('href', '/scholarships');
    expect(screen.getByText('Jobs').closest('a')).toHaveAttribute('href', '/jobs');
  });
});
