import { create } from 'zustand';
import Cookies from 'js-cookie';

export const useAuthStore = create((set) => ({
  user: Cookies.get('user') || null,
  login: (username) => {
    Cookies.set('user', username, { expires: 365 }); // Expiration not strictly required as per prompt, but good practice
    set({ user: username });
  },
  logout: () => {
    Cookies.remove('user');
    set({ user: null });
  },
}));
