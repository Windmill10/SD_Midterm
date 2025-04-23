# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

component hierarchy
```mermaid
App
├── AuthProvider (context)
├── Router
│   ├── Navbar (persistent)
│   └── Routes
│       ├── AuthPage (public)
│       │   ├── SignUp / SignIn
│       │   └── GoogleSignIn
│       └── HomePage (protected with AuthGuard)
│           ├── RoomList
│           │   ├── RoomItem(s)
│           │   └── CreateRoom (Modal)
│           └── ChatRoomPage
│               ├── ChatWindow
│               │   └── MessageList
│               │       └── MessageItem(s)
│               └── MessageInput
│                   └── EmojiPicker
```
Bonus Components (at most 10%)
- User profile (1%)
- Profile picture (1%)
- Send image (1%)
- Send video (1%)
- Chatbot (2%)
- Block User (2%)
- Unsend message (3%)
- Search for message (3%)
- Send gif from Tenor API (3%)

/rooms
  /{roomId}
    - name: string
    - description: string
    - createdAt: timestamp
    - createdBy: userId
    - isPrivate: boolean
    /members
      /{userId}: true
    /messages
      /{messageId}
        - text: string
        - senderId: userId
        - timestamp: timestamp