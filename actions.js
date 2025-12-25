export const ACTIONS = {
    // Existing actions
    JOIN: 'join',
    JOINED: 'joined',
    DISCONNECTED: 'disconnected',
    SYNC_CODE: 'sync-code',

    // New audio-related actions
    MESSAGE_SEND: 'message-send',
    MESSAGE_RECEIVE: 'message-receive',
    MESSAGES_HISTORY: 'messages-history',

    // Voice call actions
    VOICE_CALL_OFFER: 'voice-call-offer',
    VOICE_CALL_ANSWER: 'voice-call-answer',
    VOICE_CALL_ICE_CANDIDATE: 'voice-call-ice-candidate',
    VOICE_CALL_END: 'voice-call-end',

    // Audio message actions
    AUDIO_MESSAGE_SEND: 'audio-message-send',
    AUDIO_MESSAGE_RECEIVE: 'audio-message-receive',

    // Sync actions
    REQUEST_SYNC: 'request-sync'
};