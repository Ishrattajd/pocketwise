import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExpenseForm } from '../ExpenseForm';

describe('ExpenseForm component', () => {
  it('renders all visible form labels and inputs', () => {
    const handleSubmit = vi.fn();
    const handleCancel = vi.fn();

    render(
      <ExpenseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        currencySymbol="₹"
      />
    );

    // Verify all four visible labels exist
    expect(screen.getByLabelText(/amount \(₹\) \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/note \(max 200 chars\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date \*/i)).toBeInTheDocument();

    // Verify action buttons exist
    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^save$/i })).toBeInTheDocument();
  });

  it('shows validation error when amount is zero or negative', async () => {
    const handleSubmit = vi.fn();
    const handleCancel = vi.fn();

    render(
      <ExpenseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialValues={{ amount: 0, category: 'Food', note: 'Test item' }}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /^save$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert.textContent).toMatch(/greater than 0/i);
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when note exceeds 200 characters', async () => {
    const handleSubmit = vi.fn();
    const handleCancel = vi.fn();

    const { container } = render(
      <ExpenseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialValues={{ amount: 100, category: 'Food' }}
      />
    );

    const noteInput = container.querySelector('#expense-note-input') as HTMLInputElement;
    // Bypassing max-length in DOM simulation to test schema validation directly
    fireEvent.change(noteInput, { target: { value: 'A'.repeat(205) } });

    const submitBtn = screen.getByRole('button', { name: /^save$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert.textContent).toMatch(/exceed 200 characters/i);
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid data upon successful submission', async () => {
    const handleSubmit = vi.fn();
    const handleCancel = vi.fn();

    render(
      <ExpenseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        currencySymbol="₹"
        initialValues={{
          amount: 60,
          category: 'Food',
          note: 'Canteen meal',
          date: '2026-11-22',
        }}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /^save$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({
        amount: 60,
        category: 'Food',
        note: 'Canteen meal',
        date: '2026-11-22',
      });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    const handleSubmit = vi.fn();
    const handleCancel = vi.fn();

    render(
      <ExpenseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: /^cancel$/i });
    fireEvent.click(cancelBtn);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
