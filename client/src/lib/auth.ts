import { User } from "@shared/schema";
import { useState, useEffect } from "react";

interface AuthState {
  user: User | null;
  token: string | null;
}

class AuthManager {
  private state: AuthState = {
    user: null,
    token: null,
  };

  private listeners: Array<(state: AuthState) => void> = [];

  constructor() {
    // Load from localStorage on initialization
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const token = localStorage.getItem('vinimai_token');
    const userJson = localStorage.getItem('vinimai_user');
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.state = { token, user };
      } catch (error) {
        this.logout();
      }
    }
  }

  private saveToStorage() {
    if (this.state.token && this.state.user) {
      localStorage.setItem('vinimai_token', this.state.token);
      localStorage.setItem('vinimai_user', JSON.stringify(this.state.user));
    } else {
      localStorage.removeItem('vinimai_token');
      localStorage.removeItem('vinimai_user');
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  login(token: string, user: User) {
    this.state = { token, user };
    this.saveToStorage();
    this.notifyListeners();
  }

  logout() {
    this.state = { token: null, user: null };
    this.saveToStorage();
    this.notifyListeners();
  }

  getState() {
    return this.state;
  }

  isAuthenticated() {
    return !!this.state.token && !!this.state.user;
  }

  getToken() {
    return this.state.token;
  }

  getUser() {
    return this.state.user;
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export const authManager = new AuthManager();

export function useAuth() {
  const [state, setState] = useState(authManager.getState());

  useEffect(() => {
    return authManager.subscribe(setState);
  }, []);

  return {
    ...state,
    isAuthenticated: authManager.isAuthenticated(),
    login: authManager.login.bind(authManager),
    logout: authManager.logout.bind(authManager),
  };
}

// Add auth header to requests
export function getAuthHeaders() {
  const token = authManager.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
