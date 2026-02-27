import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export const fetchPatients = createAsyncThunk('patients/fetchAll', async (params, { rejectWithValue }) => {
    try { const { data } = await api.get('/patients', { params }); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const fetchPatientById = createAsyncThunk('patients/fetchById', async (id, { rejectWithValue }) => {
    try { const { data } = await api.get(`/patients/${id}`); return data.data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const createPatient = createAsyncThunk('patients/create', async (payload, { rejectWithValue }) => {
    try { const { data } = await api.post('/patients', payload); return data.data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const updatePatient = createAsyncThunk('patients/update', async ({ id, payload }, { rejectWithValue }) => {
    try { const { data } = await api.put(`/patients/${id}`, payload); return data.data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const deletePatient = createAsyncThunk('patients/delete', async (id, { rejectWithValue }) => {
    try { await api.delete(`/patients/${id}`); return id; }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});

const patientSlice = createSlice({
    name: 'patients',
    initialState: {
        list: [],
        selected: null,
        total: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelected(s) { s.selected = null; },
        clearError(s) { s.error = null; },
    },
    extraReducers: (b) => {
        b
            .addCase(fetchPatients.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchPatients.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.data; s.total = a.payload.total || a.payload.data.length; })
            .addCase(fetchPatients.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
            .addCase(fetchPatientById.pending, (s) => { s.loading = true; })
            .addCase(fetchPatientById.fulfilled, (s, a) => { s.loading = false; s.selected = a.payload; })
            .addCase(fetchPatientById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
            .addCase(createPatient.fulfilled, (s, a) => { s.list.unshift(a.payload); })
            .addCase(updatePatient.fulfilled, (s, a) => {
                const idx = s.list.findIndex((p) => p._id === a.payload._id);
                if (idx !== -1) s.list[idx] = a.payload;
                if (s.selected?._id === a.payload._id) s.selected = a.payload;
            })
            .addCase(deletePatient.fulfilled, (s, a) => { s.list = s.list.filter((p) => p._id !== a.payload); });
    },
});

export const { clearSelected, clearError } = patientSlice.actions;
export default patientSlice.reducer;
