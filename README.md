# AuthHB

A cross-platform authentication application built with **React Native, Expo, React Native Web, and Firebase Authentication**.

The application supports Google Authentication and Email/Password Authentication. Access is restricted to users with an official `@hbplus.fit` email address.

## Features

- Google Authentication
- Email/Password Login
- Create Account
- Forgot Password
- Domain-based access restriction
- Protected Home page
- Firebase Authentication
- User profile storage in Cloud Firestore
- Logout functionality
- Responsive Web UI
- React Native + React Native Web

## Tech Stack

- React Native
- Expo
- Expo Router
- React Native Web
- Firebase Authentication
- Cloud Firestore
- TypeScript

## Authentication Flow

1. User opens the application.
2. User can sign in using:
   - Google
   - Email and Password
3. After authentication, the user's email domain is checked.
4. Only users with an `@hbplus.fit` email address are allowed.
5. Unauthorized users are shown:

   `Access restricted. Please login using your official domain email.`

6. Authorized users are redirected to the protected Home page.
7. Users can logout from the Home page.

## Domain Restriction

The application allows access only to users whose email ends with:

```text
@hbplus.fit
```

The domain is checked after Firebase authentication using the authenticated user's email address.

This prevents unauthorized accounts such as personal Gmail accounts from accessing the application.

## Firestore

User information is stored in Cloud Firestore under:

```text
users/{uid}
```

Each user document contains:

```text
uid
name
email
createdAt
```

Firestore security rules restrict users to their own profile data and enforce the required domain restrictions.

## Project Structure

```text
AuthHB/
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   └── home.tsx
│   │
│   ├── config/
│   │   └── firebase.ts
│   │
│   └── services/
│       └── auth.ts
│
├── firestore.rules
├── app.json
├── package.json
└── README.md
```

## Running Locally

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

For Web:

```bash
npx expo start --web
```

## Environment Variables

The project uses Expo public environment variables for Google OAuth configuration.

Create a `.env` file:

```env
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id
```

Do not commit private credentials or secrets to the repository.

## Build Verification

The project was verified using:

```bash
npx tsc --noEmit
```

and:

```bash
npx expo export --platform web
```

Both checks completed successfully.

## Future Improvements

- Deploy the web application using Netlify.
- Add additional authentication providers if required.
- Improve UI and accessibility based on user feedback.

## Author

Nikhil Munda
