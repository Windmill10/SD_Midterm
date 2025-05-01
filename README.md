# Website features

## Overview
This is a simple chatroom for chatting with friends. Built with React + Vite + TypeScript + Firebase. Utilizing Material UI and CSS.anmimate for UI design. The Navbar provides all necessary pages for users to navigate.

## User manual
1. Sign Up with your Gmail account or Sign in with your Google account (No signup required for Google).
2. Create a chatroom and click on it to enter the chatroom.
3. Invite your friends to the chatroom by entering their email addresses.
4. Send messages to the chatroom.
5. You can also send GIFs using the GIF picker.
6. You can search for messages within the chatroom.
7. You can unsend your own messages by hovering over them and clicking the unsend button.
8. You can edit your profile information and avatar in the profile page.
9. Add friends by entering their email addresses in the messages page, friend lists will be shown in the profile page.


## Local Setup

Follow these steps to set up and run the project on your local machine:

1.  **Clone the Repository:**
    *   Open your terminal.
    *   Navigate to your desired project directory.
    *   Run: `git clone <repository_url>` (Replace `<repository_url>` with the actual Git repository URL).
    *   Change into the project directory: `cd Midterm`

2.  **Install Dependencies:**
    *   Run `npm install` to install the required Node.js packages.

3.  **Configure Firebase:**
    *   Create a new project or use an existing one on the [Firebase Console](https://console.firebase.google.com/).
    *   In your Firebase project settings, enable the following services:
        *   Authentication (Enable Email/Password and Google Sign-In methods)
        *   Firestore Database (Create a database)
        *   Storage (Create a storage bucket)
    *   Obtain your Firebase project configuration credentials (API Key, Auth Domain, Project ID, etc.).
    *   Create a file named `.env` in the root directory of the project.
    *   Add your Firebase credentials to the `.env` file, like this (replace placeholders with your actual values):
        ```env
        # filepath: .../Midterm/.env
        VITE_FIREBASE_API_KEY=YOUR_API_KEY
        VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
        VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
        VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
        VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
        VITE_FIREBASE_APP_ID=YOUR_APP_ID
        ```
    *   Apply the security rules found in `firestore.rules` and `storage.rules` to your Firestore Database and Storage Bucket rules sections in the Firebase Console.

4.  **Run the Development Server:**
    *   Execute `npm run dev` in the terminal
    *   Open the local URL provided in the terminal output (e.g., `http://localhost:5173`) in your web browser.

## Basic features

### Membership Mechanism
- Supports gmail sign-in and sign-out.
- Support google account sign-in and sign-out, and automatically creates a user account in the database.

### Host your Firebase page
- Is hosted with Firebase

### Database read/write

- Used firestore with proper security rules to read and write data.
- Firestore is used to store user data, chatroom data, and messages.
- Firestore storage is used to store user profile images.

### RWD

- The website is responsive and can be used on mobile devices, leveraging Material UI's responsive design features.

### GIT
  ![Git log](git_lg.png)

### Chatroom

 - Users can access and create chatrooms in message page
 - All chatrooms are private and invite only
 - Chatrooms support group chat, adding members to chatroom by email, message searching, message history, and message unsending.


 ## Advanced components

 - Is built with React + Vite + TypeScript
 - Supports google sign-in and sign-out
 - Supports chrome notifications for new messages when the window is not active
 - CSS animation is used in chatroom, messages "bounce" when new messages are rendered (`animate.css`)
 - Alert scripts (using MUI Snackbar) and console logs are used for user feedback and debugging throughout the project

 ## Bonus components
 - User profile page where users can edit their profile information (name, description, phone number, address) and avatar
 - Profile picture is uploaded to Firebase storage with basic validation (type, size)
 - Users can hover over their own message and unsend it (delete from Firestore)
 - Users can search for messages within a chatroom
 - Users can send gifs like any other message using a GIF picker (`gif-picker-react`)

 ## Additional features

 - Used Material UI theme ([`src/theme.tsx`](/Users/lee_eason/CS/SD/Midterm/src/theme.tsx)) for consistent design across the application.
 - Supports adding friends ([`src/components/chat/addfriend.tsx`](/Users/lee_eason/CS/SD/Midterm/src/components/chat/addfriend.tsx)) and members to chatroom by email ([`src/services/roomService.tsx`](/Users/lee_eason/CS/SD/Midterm/src/services/roomService.tsx)).
 - Signing in with Google account will automatically create a user account in the database ([`src/pages/login.tsx`](/Users/lee_eason/CS/SD/Midterm/src/pages/login.tsx)) with corresponding user information if one doesn't exist.
 - Auto scroll to the bottom of the chatroom when new messages are sent (unless searching) ([`src/components/chat/messageHistory.tsx`](/Users/lee_eason/CS/SD/Midterm/src/components/chat/messageHistory.tsx)).
 - Real-time message updates using Firestore `onSnapshot` listener ([`src/services/roomService.tsx`](/Users/lee_eason/CS/SD/Midterm/src/services/roomService.tsx)).
 - Custom hook `useUserMetadata` ([`src/common/findUser.tsx`](/Users/lee_eason/CS/SD/Midterm/src/common/findUser.tsx)) to fetch and manage current user's Firestore data.
 - Centralized authentication state management using React Context ([`src/context/AuthContext.tsx`](/Users/lee_eason/CS/SD/Midterm/src/context/AuthContext.tsx)).
 - Defined Firestore ([`firestore.rules`](/Users/lee_eason/CS/SD/Midterm/firestore.rules)) and Storage ([`storage.rules`](/Users/lee_eason/CS/SD/Midterm/storage.rules)) security rules.
 - Utilizes environment variables ([`.env`](/Users/lee_eason/CS/SD/Midterm/.env)) for sensitive configuration like API keys.
 - Clear project structure separating components, pages, services, context, etc.