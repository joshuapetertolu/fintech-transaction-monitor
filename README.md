# Fintech Transaction Monitor (Mobile)

A high-performance, secure mobile application built with **React Native (Expo)**, **TypeScript**, and **Zustand**. This application demonstrates senior-level engineering patterns, specifically focusing on real-time data reconciliation, secure session management, and OWASP security mitigations.

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Expo Go** app on your mobile device (iOS/Android)

### Installation

Follow these steps to get the application running:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-link>
   cd <folder-name>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npx expo start
   ```

4. **Scan the QR Code:**
   - Open the **Expo Go** app on your iOS/Android device
   - Scan the QR code displayed in your terminal
   - The app will load automatically on your device

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React Native (Expo) |
| **Language** | TypeScript (Strict Mode) |
| **State Management** | Zustand (Immutable state patterns) |
| **Networking** | Axios with centralized Interceptors |
| **Security** | Expo Secure Store (Keychain/EncryptedSharedPreferences) |
| **Icons/UI** | Lucide React Native / Expo Icons |

---

## 🏗 Key Features & Assessment Requirements

### 1. Authentication & Security (Section 1 & 5)

#### **Secure Storage**
Tokens are **never stored in plain text**. We utilize **hardware-backed encryption** for JWT storage.

#### **Auto-Refresh**
Implemented a robust **"Single-Flight"** refresh logic to handle token expiry without race conditions.

#### **OWASP Awareness**
Mitigation strategies for the **Top 10 mobile risks**, including:
- SSL Pinning (Conceptual)
- Sensitive Data Scrubbing

---

### 2. Real-Time Transaction Stream (Section 3)

#### **Zero-Flicker Reconciliation**
Handled via a custom merge strategy in the `useTransactionStream` hook.

#### **Duplicate Prevention**
Automatic filtering of duplicate event IDs from the stream.

#### **Performance**
Optimized list rendering to:
- Preserve scroll position
- Avoid unnecessary re-renders during high-frequency updates

---

### 3. Admin Functionality (Section 4)

#### **RBAC (Role-Based Access Control)**
- Conditional UI rendering
- Store-level gatekeeping for `admin` vs `analyst` roles

#### **Optimistic UI**
- Instant feedback for flagging and notes
- Automatic rollback mechanism on API failure

---

## 📄 Documentation

For a deep dive into the architectural decisions, security implementation details (including the SSL Pinning explanation), and race condition handling, please refer to:

### 👉 [DESIGN_DOC.md](./DESIGN_DOC.md)

This document covers:
- Clean Architecture Separation
- Token Lifecycle & Race Conditions
- Real-Time Data Integrity
- SSL Pinning Strategy

---

## 🧪 Testing the "Session Hijack"

To test the **401 Unauthorized** handling:

1. **Log in** to the app
2. **Trigger the "Simulate Expiry"** action (found in the settings/debug menu)
3. **Observe** the app automatically:
   - Attempting a background refresh
   - Successfully retrying the failed request

This demonstrates the app's resilience against session expiration and unauthorized access attempts.

---

## 📂 Project Structure

```
src/
├── api/          # Centralized HTTP client & interceptors
├── store/        # Zustand state management (Auth & Transactions)
├── features/     # Feature-based modules (auth, transactions, profile)
├── hooks/        # Reusable business logic (useTransactionStream)
└── utils/        # Security helpers & utilities
```

---

## 🔒 Security Features

- ✅ Hardware-backed token encryption
- ✅ Automatic token refresh with race condition prevention
- ✅ Sensitive data masking (card numbers, logs)
- ✅ OWASP Top 10 mobile security mitigations
- ✅ SSL Pinning (conceptual implementation)

---

## 📝 License

This project is part of a technical assessment and is for demonstration purposes only.