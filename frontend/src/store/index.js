import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';
import appointmentReducer from './slices/appointmentSlice';
import chatbotReducer from './slices/chatbotSlice';
import symptomReducer from './slices/symptomSlice';
import emergencyReducer from './slices/emergencySlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        patients: patientReducer,
        appointments: appointmentReducer,
        chatbot: chatbotReducer,
        symptoms: symptomReducer,
        emergency: emergencyReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
