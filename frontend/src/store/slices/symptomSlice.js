import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export const analyzeSymptoms = createAsyncThunk('symptoms/analyze', async (symptoms, { rejectWithValue }) => {
    try { const { data } = await api.post('/symptoms/analyze', { symptoms }); return data.data; }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const fetchCommonSymptoms = createAsyncThunk('symptoms/common', async (_, { rejectWithValue }) => {
    try { const { data } = await api.get('/symptoms/common/list'); return data.data; }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const fetchHistory = createAsyncThunk('symptoms/history', async (patientId, { rejectWithValue }) => {
    try {
        const url = patientId ? `/symptoms/history/${patientId}` : '/symptoms/history';
        const { data } = await api.get(url);
        return data.data;
    } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const symptomSlice = createSlice({
    name: 'symptoms',
    initialState: {
        commonList: [],
        selected: [],
        result: null,
        history: [],
        loading: false,
        analyzing: false,
        error: null,
    },
    reducers: {
        toggleSymptom(s, a) {
            const exists = s.selected.includes(a.payload);
            s.selected = exists ? s.selected.filter((x) => x !== a.payload) : [...s.selected, a.payload];
        },
        clearResult(s) { s.result = null; s.selected = []; },
        clearError(s) { s.error = null; },
    },
    extraReducers: (b) => {
        b
            .addCase(analyzeSymptoms.pending, (s) => { s.analyzing = true; s.result = null; })
            .addCase(analyzeSymptoms.fulfilled, (s, a) => { s.analyzing = false; s.result = a.payload; })
            .addCase(analyzeSymptoms.rejected, (s, a) => { s.analyzing = false; s.error = a.payload; })
            .addCase(fetchCommonSymptoms.fulfilled, (s, a) => { s.commonList = a.payload; })
            .addCase(fetchHistory.pending, (s) => { s.loading = true; })
            .addCase(fetchHistory.fulfilled, (s, a) => { s.loading = false; s.history = a.payload; })
            .addCase(fetchHistory.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    },
});

export const { toggleSymptom, clearResult, clearError } = symptomSlice.actions;
export default symptomSlice.reducer;
