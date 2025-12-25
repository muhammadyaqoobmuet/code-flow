<div align="center">
  <img src="https://res.cloudinary.com/dmzpa98np/image/upload/v1751115713/og_xq8vrd.png">

  # 🚀 CodeFlow

  **The Ultimate Real-Time Collaborative Coding Platform**

  *Code together, talk together. CodeFlow brings your team closer with a shared code editor and built-in voice chat, no matter where you are.*

  [![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-LTS-green.svg)](https://nodejs.org/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-black.svg)](https://socket.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.10-blue.svg)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

  [🎮 Live ](https://code-flow-a7559b152722.herokuapp.com/) · [🐛 Report Bug](issues/) · [💡 Request Feature](issues/)

</div>

---

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center" width="300">
        <br>
        <b>🎨 Real-Time Code Editor</b><br>
        Collaborate seamlessly with Monaco Editor integration, syntax highlighting, and live code synchronization
      </td>
      <td align="center" width="300">
       <br>
        <b>🎙️ Voice Chat Integration</b><br>
        Crystal-clear voice communication with WebRTC, audio messages, and noise cancellation
      </td>
      <td align="center" width="300">
        <br>
        <b>🤖 AI Code Assistant</b><br>
        Intelligent suggestions, automated reviews, and smart refactoring recommendations
      </td>
    </tr>
  </table>
</div>

### 🔥 Core Features

- **🔄 Real-Time Collaboration**: Multiple developers can edit code simultaneously with instant synchronization
- **🎯 Multi-Language Support**: JavaScript, TypeScript, Python, C++, and more
- **💬 Live Chat**: Text and voice messages with message history
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🌙 Dark/Light Mode**: Toggle between beautiful dark and light themes
- **⚡ Code Execution**: Run code directly in the browser with instant output
- **🏠 Room Management**: Create and join coding rooms with unique IDs
- **👥 User Presence**: See who's online and track participant activity
- **🔐 Secure Connections**: All communications are encrypted and secure

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- Modern web browser with WebRTC support

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/muhammadyaqoobmuet/code-flow
   cd codeflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:

   ```env
   VITE_REACT_APP_BACKEND_URL=http://localhost:3000
   ```

4. **Start the development servers**

   **Frontend** (Terminal 1):

   ```bash
   npm run dev
   ```

   **Backend** (Terminal 2):

   ```bash
   npm run server
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173` and start coding together! 🎉

---

## 🏗️ Project Structure

```
codeflow/
├── 📁 public/                    # Static assets
│   ├── image.png                 # App logo and images
│   └── vite.svg
├── 📁 src/                       # Source code
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 ui/               # Base UI components (buttons, cards, etc.)
│   │   └── background-gradient-animation.jsx
│   ├── 📁 lib/                   # Utility functions
│   │   └── utils.js             # Class name utilities
│   ├── 📁 pages/                 # Application pages
│   │   ├── 📁 CreateRoom/       # Room creation page
│   │   ├── 📁 Home/             # Landing page
│   │   ├── 📁 JoinRoom/         # Room joining page
│   │   └── 📁 Room/             # Main collaboration room
│   │       ├── 📁 components/   # Room-specific components
│   │       │   ├── ChatComponent.jsx
│   │       │   ├── SharedCodeEditor.jsx
│   │       │   ├── CollabPanel.jsx
│   │       │   └── Header.jsx
│   │       └── page.jsx         # Room main component
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # App entry point
│   ├── socket.js                 # Socket.io client configuration
│   └── index.css                 # Global styles
├── 📄 server.js                  # Express + Socket.io server
├── 📄 actions.js                 # Socket event constants
├── 📄 servers.js                 # WebRTC configuration
├── 📄 package.json               # Dependencies and scripts
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 vite.config.js            # Vite configuration
└── 📄 README.md                  # You are here!
```

---

## 🎯 Usage

### Creating a Room

1. Click **"Create a Room"** on the homepage
2. Enter your username
3. A unique room ID will be generated automatically
4. Share the room ID with your collaborators
5. Start coding together!

### Joining a Room

1. Click **"Join a Room"** on the homepage
2. Enter your username and the room ID
3. Join the collaborative session instantly

### Voice Communication

- **🎙️ Start Voice Call**: Click the phone icon in the chat panel
- **🔇 Mute/Unmute**: Toggle microphone during calls
- **📢 Voice Messages**: Record and send voice messages
- **🔊 Audio Playback**: Play received voice messages

---

## 🛠️ Technology Stack

<div align="center">

| Category        | Technologies                                                                                                                                                                                                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**    | ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)       |
| **Backend**     | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white) |
| **Code Editor** | ![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-0078D4?style=flat&logo=visual-studio-code&logoColor=white)                                                                                                                                                                                |
| **Real-time**   | ![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=flat&logo=webrtc&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)                                                                                                    |
| **Animations**  | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)                                                                                                                                                                                            |
| **Forms**       | ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat&logo=reacthookform&logoColor=white)                                                                                                                                                                                 |

</div>

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend URL
VITE_REACT_APP_BACKEND_URL=http://localhost:3000

# Optional: Judge0 API for code execution
RAPIDAPI_KEY=your_rapidapi_key_here
```

### Tailwind CSS

The project uses Tailwind CSS v4 with custom configurations:

```javascript
// tailwind.config.js
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8D84B2",
        secondary: "#7D84B2",
        // ... custom color palette
      },
    },
  },
};
```

---

## 📡 API Reference

### Socket Events

| Event               | Description       | Payload                         |
| ------------------- | ----------------- | ------------------------------- |
| `JOIN`              | Join a room       | `{ roomId, username }`          |
| `SYNC_CODE`         | Synchronize code  | `{ roomId, code }`              |
| `MESSAGE_SEND`      | Send chat message | `{ roomId, message, username }` |
| `VOICE_CALL_OFFER`  | Start voice call  | `{ roomId, offer, username }`   |
| `VOICE_CALL_ANSWER` | Answer voice call | `{ roomId, answer }`            |

### REST Endpoints

Currently, the application uses WebSocket connections for all real-time features. REST API endpoints may be added in future versions.

---

## 🤝 Contributing

We love contributions! Here's how you can help:

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Be respectful and inclusive

---

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><b>🔧 Socket connection fails</b></summary>

**Problem**: Cannot connect to the server

**Solution**:

1. Ensure the backend server is running on port 3000
2. Check your firewall settings
3. Verify the `VITE_REACT_APP_BACKEND_URL` environment variable
</details>

<details>
<summary><b>🎙️ Voice chat not working</b></summary>

**Problem**: Cannot hear other participants

**Solution**:

1. Check browser permissions for microphone access
2. Ensure you're using HTTPS in production
3. Verify WebRTC support in your browser
</details>

<details>
<summary><b>💻 Code not syncing</b></summary>

**Problem**: Changes not appearing for other users

**Solution**:

1. Check network connectivity
2. Refresh the page and rejoin the room
3. Ensure you're in the same room ID
</details>

---

## 📈 Roadmap

### 🎯 Version 2.0 (Coming Soon)

- [ ] **File System Integration**: Upload and manage project files
- [ ] **Git Integration**: Version control with commit history
- [ ] **Advanced AI Features**: Code completion and bug detection
- [ ] **Screen Sharing**: Share your screen with collaborators
- [ ] **Whiteboard**: Visual collaboration tools
- [ ] **Mobile App**: Native iOS and Android apps

### 🔮 Future Features

- [ ] **Docker Support**: Containerized development environments
- [ ] **Plugin System**: Extensible architecture
- [ ] **Team Management**: User roles and permissions
- [ ] **Analytics Dashboard**: Usage metrics and insights
- [ ] **Themes Marketplace**: Custom UI themes

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors & Contributors

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://github.com/muhammadyaqoobmuet.png" width="100px;" alt=""/><br>
        <sub><b>Muhammad Yaqoob</b></sub><br>
        <a href="https://github.com/muhammadyaqoobmuet">💻</a>
      </td>
      <!-- Add more contributors here -->
    </tr>
  </table>
</div>

---

## 🙏 Acknowledgments

- **Monaco Editor** for the amazing code editor experience
- **Socket.io** for real-time communication
- **Tailwind CSS** for the beautiful UI components
- **Framer Motion** for smooth animations
- **Lucide Icons** for the beautiful icon set
- **WebRTC** for peer-to-peer communication

---

## 💖 Support

If you found this project helpful, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs
- 💡 **Suggesting** new features
- 🤝 **Contributing** to the codebase
- 📢 **Sharing** with your friends and colleagues

---

<div align="center">
  <h3>🚀 Ready to start collaborating? <a href="https://codeflow-demo.com">Try CodeFlow now!</a></h3>

  Made with ❤️ by the CodeFlow team

  [![Follow on GitHub](https://img.shields.io/github/followers/your-username?style=social)](https://github.com/your-username)
  [![Twitter Follow](https://img.shields.io/twitter/follow/your-twitter?style=social)](https://twitter.com/your-twitter)
</div>
