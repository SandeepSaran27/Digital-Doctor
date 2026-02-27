import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export const startSession = createAsyncThunk('chatbot/start', async (payload, { rejectWithValue }) => {
    try { const { data } = await api.post('/chatbot/session', payload); return data.data; }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const sendMessage = createAsyncThunk('chatbot/message', async ({ sessionId, message }, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/chatbot/session/${sessionId}/message`, { message });
        // data.data is the full updated ChatSession with all messages
        return data.data;
    }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const fetchSessions = createAsyncThunk('chatbot/sessions', async (_, { rejectWithValue }) => {
    try { const { data } = await api.get('/chatbot/sessions'); return data.data; }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const endSession = createAsyncThunk('chatbot/end', async (sessionId, { rejectWithValue }) => {
    try { const { data } = await api.put(`/chatbot/session/${sessionId}/end`); return data.data; }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const chatbotSlice = createSlice({
    name: 'chatbot',
    initialState: {
        sessions: [],
        activeSession: null,
        messages: [],
        loading: false,
        sending: false,
        error: null,
    },
    reducers: {
        clearSession(s) { s.activeSession = null; s.messages = []; },
        clearError(s) { s.error = null; },
        // Optimistically push the user's message before the API call resolves
        addUserMessage(s, a) {
            s.messages.push({ role: 'user', content: a.payload });
        },
    },
    extraReducers: (b) => {
        b
            .addCase(startSession.pending, (s) => { s.loading = true; })
            .addCase(startSession.fulfilled, (s, a) => {
                s.loading = false;
                s.activeSession = a.payload;
                s.messages = a.payload?.messages || [];
            })
            .addCase(startSession.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

            .addCase(sendMessage.pending, (s) => { s.sending = true; })
            .addCase(sendMessage.fulfilled, (s, a) => {
                s.sending = false;
                // Sync the full message list from the server (includes user + assistant messages)
                if (a.payload?.messages) s.messages = a.payload.messages;
            })
            .addCase(sendMessage.rejected, (s, a) => { s.sending = false; s.error = a.payload; })

            .addCase(fetchSessions.fulfilled, (s, a) => { s.sessions = a.payload; })
            .addCase(endSession.fulfilled, (s) => { s.activeSession = null; s.messages = []; });
    },
});

export const { clearSession, clearError, addUserMessage } = chatbotSlice.actions;
export default chatbotSlice.reducer;

