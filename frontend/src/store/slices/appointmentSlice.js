import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export const fetchAppointments = createAsyncThunk('appointments/fetchAll', async (params, { rejectWithValue }) => {
    try { const { data } = await api.get('/appointments', { params }); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const fetchQueue = createAsyncThunk('appointments/queue', async (params, { rejectWithValue }) => {
    try { const { data } = await api.get('/appointments/queue', { params }); return data.data || []; }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const bookAppointment = createAsyncThunk('appointments/book', async (payload, { rejectWithValue }) => {
    try { const { data } = await api.post('/appointments', payload); return data.data; }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const updateStatusThunk = createAsyncThunk('appointments/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try { const { data } = await api.put(`/appointments/${id}/status`, { status }); return data.data; }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const appointmentSlice = createSlice({
    name: 'appointments',
    initialState: {
        list: [],
        queue: [],
        total: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearError(s) { s.error = null; },
    },
    extraReducers: (b) => {
        b
            .addCase(fetchAppointments.pending, (s) => { s.loading = true; })
            .addCase(fetchAppointments.fulfilled, (s, a) => {
                s.loading = false;

                const payload = a.payload;

                // handle multiple backend formats
                s.list = payload.data || payload || [];
                s.total =
                    payload.total ||
                    payload.data?.length ||
                    payload.length ||
                    0;
            }).addCase(fetchAppointments.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
            .addCase(fetchQueue.fulfilled, (s, a) => { s.queue = a.payload; })
            .addCase(bookAppointment.fulfilled, (s, a) => { s.list.unshift(a.payload); })
            .addCase(updateStatusThunk.fulfilled, (s, a) => {
                const i = s.list.findIndex((x) => x._id === a.payload._id);
                if (i !== -1) s.list[i] = a.payload;
                const j = s.queue.findIndex((x) => x._id === a.payload._id);
                if (j !== -1) s.queue[j] = a.payload;
            });
    },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
