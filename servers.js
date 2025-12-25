
// Script to export WebRTC ICE servers configuration
// This configuration is used for establishing peer-to-peer connections in WebRTC applications.
export const rtcPeerConnectionIceServersConfigration = {
    iceServers: [
        {
            urls: [
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302'
            ]
        }
    ]
};
