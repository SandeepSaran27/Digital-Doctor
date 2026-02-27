import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// ─── Thunks ────────────────────────────────────────────────────────────────

/**
 * Login: backend sets an HTTP-only cookie. We just call /auth/me to get the user.
 */
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/login', credentials);
        // data.user is returned directly by the new cookie-based controller
        return data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/register', userData);
        return data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
});

/**
 * getMe: called on app startup. If the cookie is valid, returns the user. 401 = not logged in.
 */
export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/auth/me');
        return data.data; // { success: true, data: user }
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Not authenticated');
    }
});

/**
 * Logout: call backend to clear the cookie, then reset Redux state.
 */
export const logoutUser = createAsyncThunk('auth/logout', async () => {
    try {
        await api.post('/auth/logout');
    } catch {
        // Even if network fails, clear local state
    }
});

export const updatePassword = createAsyncThunk('auth/updatePassword', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.put('/auth/update-password', payload);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update password');
    }
});

// ─── Slice ─────────────────────────────────────────────────────────────────
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: true,   // true on startup so ProtectedRoute waits for getMe()
        error: null,
    },
    reducers: {
        clearError(state) { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            // ── Login ──────────────────────────────────────────────────────
            .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(loginUser.fulfilled, (s, a) => {
                s.loading = false;
                s.user = a.payload;
                s.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

            // ── Register ───────────────────────────────────────────────────
            .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(registerUser.fulfilled, (s, a) => {
                s.loading = false;
                s.user = a.payload;
                s.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

            // ── Get Me (startup auth check) ────────────────────────────────
            .addCase(getMe.pending, (s) => { s.loading = true; })
            .addCase(getMe.fulfilled, (s, a) => {
                s.loading = false;
                s.user = a.payload;
                s.isAuthenticated = true;
            })
            .addCase(getMe.rejected, (s) => {
                s.loading = false;
                s.user = null;
                s.isAuthenticated = false;
            })

            // ── Logout ────────────────────────────────────────────────────
            .addCase(logoutUser.fulfilled, (s) => {
                s.user = null;
                s.isAuthenticated = false;
                s.loading = false;
                s.error = null;
            })
            .addCase(logoutUser.rejected, (s) => {
                // Force logout even on network error
                s.user = null;
                s.isAuthenticated = false;
                s.loading = false;
            });
    },
});

export const { clearError } = authSlice.actions;

// Keep a named `logout` export so existing imports (useAuth, etc.) still work
export const logout = logoutUser;

export default authSlice.reducer;
