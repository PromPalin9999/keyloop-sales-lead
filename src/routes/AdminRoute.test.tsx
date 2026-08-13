import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminRoute } from './AdminRoute';
import { useGetMe } from '@/apis';
import { Role, ROUTES } from '@/constants';
import { useAuthStore } from '@/store';

vi.mock('@/lib', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(),
    },
  },
}));

vi.mock('@/apis', () => ({ useGetMe: vi.fn() }));

function renderAdminRoute() {
  return render(
    <MemoryRouter initialEntries={['/admin-only']}>
      <Routes>
        <Route element={<AdminRoute />}>
          <Route path='/admin-only' element={<div>Admin Only Page</div>} />
        </Route>
        <Route path={ROUTES.DASHBOARD} element={<div>Dashboard Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

const baseProfile = {
  id: 'user-1',
  full_name: 'Test User',
  email: 'test@keyloop.test',
  created_at: '',
  updated_at: '',
};

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.mocked(useGetMe).mockReturnValue({ isError: false } as never);
  });

  it('shows a loading state while the session is still resolving', () => {
    useAuthStore.setState({
      isSessionLoading: true,
      isLoggedIn: false,
      isAdmin: false,
      profile: null,
    });

    renderAdminRoute();

    expect(screen.getByText('Keyloop Loading')).toBeInTheDocument();
    expect(screen.queryByText('Admin Only Page')).not.toBeInTheDocument();
  });

  it('redirects a logged-in salesperson away from the admin-only route', () => {
    useAuthStore.setState({
      isSessionLoading: false,
      isLoggedIn: true,
      isAdmin: false,
      profile: { ...baseProfile, role: Role.Salesperson },
    });

    renderAdminRoute();

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Only Page')).not.toBeInTheDocument();
  });

  it('renders the admin-only route for an admin', () => {
    useAuthStore.setState({
      isSessionLoading: false,
      isLoggedIn: true,
      isAdmin: true,
      profile: { ...baseProfile, role: Role.Admin },
    });

    renderAdminRoute();

    expect(screen.getByText('Admin Only Page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Page')).not.toBeInTheDocument();
  });
});
