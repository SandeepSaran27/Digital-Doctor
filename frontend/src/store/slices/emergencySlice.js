import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export const triggerEmergency = createAsyncThunk('emergency/trigger', async (payload, { rejectWithValue }) => {
    try { const { data } = await api.post('/emergency/trigger', payload); return data.data; }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const fetchEmergencyLogs = createAsyncThunk('emergency/logs', async (_, { rejectWithValue }) => {
    try { const { data } = await api.get('/emergency'); return data.data; }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const resolveEmergency = createAsyncThunk('emergency/resolve', async (id, { rejectWithValue }) => {
    try { const { data } = await api.put(`/emergency/${id}/resolve`); return data.data; }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const emergencySlice = createSlice({
    name: 'emergency',
    initialState: {
        logs: [],
        triggering: false,
        triggered: false,
        loading: false,
        error: null,
    },
    reducers: {
        resetTrigger(s) { s.triggered = false; s.error = null; },
    },
    extraReducers: (b) => {
        b
            .addCase(triggerEmergency.pending, (s) => { s.triggering = true; s.triggered = false; })
            .addCase(triggerEmergency.fulfilled, (s) => { s.triggering = false; s.triggered = true; })
            .addCase(triggerEmergency.rejected, (s, a) => { s.triggering = false; s.error = a.payload; })
            .addCase(fetchEmergencyLogs.pending, (s) => { s.loading = true; })
            .addCase(fetchEmergencyLogs.fulfilled, (s, a) => { s.loading = false; s.logs = a.payload; })
            .addCase(fetchEmergencyLogs.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
            .addCase(resolveEmergency.fulfilled, (s, a) => {
                const i = s.logs.findIndex((l) => l._id === a.payload._id);
                if (i !== -1) s.logs[i] = a.payload;
            });
    },
});

export const { resetTrigger } = emergencySlice.actions;
export default emergencySlice.reducer;
