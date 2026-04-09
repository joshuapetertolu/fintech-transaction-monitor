# Design Documentation

## Table of Contents

1. [Clean Architecture Separation](#1-clean-architecture-separation)
2. [Token Lifecycle & Race Conditions](#2-token-lifecycle--race-conditions)
3. [Real-Time Data Integrity](#3-real-time-data-integrity)
4. [SSL Pinning conceptual explanation](#4-ssl-pinning)

---

## 1. Clean Architecture Separation (Section 6.1)

I have organized the project into **distinct layers** to ensure that business logic, data, and UI never get tangled up. Here's what each directory does:

### **src/api/** (The API Layer)

This is the **"brain"** of the network in the app. It contains the **Centralized HTTP Client** (`client.ts`). By keeping this separate, I ensure that UI components never make direct API calls. All **401 handling** and **token injection logic** live here.

### **src/store/** (The Storage Layer)

Uses **Zustand** for state management. This is the **"Single Source of Truth."** It holds:

- **Auth Layer** (tokens)
- **Transaction Layer** (list data)

It is designed to handle **immutable updates** to prevent the "flickering" mentioned in Section 3.

### **src/features/** (The UI & Logic Layer)

I've broken the app down by features (auth, transactions, profile):

- **Screens:** Handle the layout
- **Components:** Small, reusable UI pieces
- **Logic:** The **Business Logic** (like filtering transactions or validating roles) is scoped to the specific feature it belongs to

### **src/hooks/** (Business Logic Layer)

Contains reusable logic like **`useTransactionStream.ts`**. This manages the complex **Real-Time Updates** (Section 3), handling reconciliation and preventing duplicate rows before the data even touches the UI.

### **src/utils/** (Security Layer)

Contains helpers for **Sensitive Data Protection** (Section 5.3), such as:

- Masking card numbers
- Scrubbing logs to ensure tokens are never exposed in debug mode

---

## 2. Token Lifecycle & Race Conditions (Section 1.3 & 6.2)

To handle concurrent events safely:

### **Automatic Refresh**

My interceptor checks for token expiry **before every request**.

### **The "Lock" Mechanism**

I implemented a **refresh queue**. If three different API calls happen at once and the token is expired:

1. The app **"locks"** the requests
2. Performs **one refresh**
3. **Releases** the calls

This prevents the **"infinite loop"** and **race conditions** explicitly tested in the assessment.

---

## 3. Real-Time Data Integrity (Section 3 & 6.3)

The stream emits updates every **5–8 seconds**. My architecture prevents duplicates by using a **Map-based reconciliation** in the store.

Even if the API sends a duplicate event, the store identifies the **unique ID** and ignores it, ensuring:

- The list remains **stable**
- **Scroll position is preserved**

---

## 4. SSL Pinning (Section 5.4)

### What is it?

**SSL pinning** is a security "double-check." Normally, your phone trusts any connection signed by a **"Certificate Authority" (CA)**. However, hackers can sometimes trick a phone into trusting a fake CA.

SSL Pinning prevents this by **hardcoding a specific server's "fingerprint"** (identity) directly into the app. Even if the phone thinks a connection is valid, the app will manually check if the server is actually our server. If they don't match, the app **kills the connection immediately**.

### How It Works

#### **1. Identity Storage**

We take a **"hash"** (a unique digital fingerprint) of our server's public key and save it inside the app.

#### **2. The Handshake**

When the app talks to the server, the server shows its ID.

#### **3. Verification**

The app compares the server's ID to the fingerprint we saved.

#### **4. Enforcement**

- **✓ Match:** Everything is safe; the connection continues
- **✗ Mismatch:** Someone is trying to intercept the data. The app stops the connection to keep the user safe

### Production Implementation Strategy

In a **real production environment** (like a bank), I would implement this as follows:

#### **Pinning the Public Key (Not the Certificate)**

I would pin the **"Public Key"** because certificates expire every year. If you pin the certificate, the app breaks when the certificate expires. Public keys usually stay the same, making the app more stable.

#### **Implementation Method**

I would use a **native-level library** like:

- `react-native-ssl-pinning`, or
- Configure it via the **Network Security Configuration** (Android) and **TrustKit** (iOS)

This ensures the check happens at the **lowest possible level** before any data is sent.

#### **Backup Pins**

I would always include a **"Backup Pin"** from a different Certificate Authority. This way, if our primary server has a major issue, we can switch to the backup without forcing all our users to download an app update just to log in.

---

### 📝 A Note for the Reviewers

**SSL Pinning is documented here conceptually.** In this submission, it is **not active** in the code to allow you to use tools like **Charles Proxy** or **Flipper** to inspect the network traffic during your review.

---
