# TapNova NFC — Smart Card & Inquiry Platform

A modern, high-conversion website for an NFC card business specializing in **Google Reviews, Portfolios, Social/vCard sharing, and Custom Contactless Solutions**. Built with a clean, luxury **glassmorphism** aesthetic (frosted glass, subtle glows, and refined typography — simple and professional, not funky).

---

## 🌟 Key Features

### 1. Business Inquiries & Product Showcase
- **Google 5-Star Review Cards**: One tap directly launches the Google Maps 5-star review dialog to multiply client ratings.
- **Creative Portfolio Cards**: Photographers, models, designers, and agencies can share 4K galleries, showreels, and booking links.
- **Digital Business & Social vCard**: Tap to save contacts directly to phonebooks + Instagram, LinkedIn, and WhatsApp links.
- **Custom Smart Solutions**: Event badges, restaurant table menus, hotel Wi-Fi taps, and custom chip encoding.
- **Interactive 3D/Glass Card Visualizer**: Front & back flip with real-time material textures (Matte Stealth Black, Brushed Silver, Nordic Wood, Transparent Acrylic, Brushed Gold).
- **Interactive Smartphone Tap Simulator**: Lets visitors click to experience what their customers see when tapping an NFC card with sound/haptic feedback.
- **Card Builder & Volume Pricing Calculator**: Real-time quantity discounts, logo upload preview, and 1-click **WhatsApp direct order** & inquiry submission.

### 2. Customer Portal & Reviews with Video Testimonials
- **Customer Email Login**: Customers can log in using their email, save their identity, and view their review status.
- **Star Rating (1 to 5 Stars)** with review headlines and feedback stories.
- **Customer Video Uploads**: Customers can upload video clips (`.mp4`, `.webm`, `.mov`) or attach video URLs to showcase the card in action.
- **Customer Photo Uploads**: Attach photos of the card or before/after metrics.
- **Integrated Video Player Modal**: Plays customer video testimonials seamlessly.

### 3. Business Owner Admin Command Center (CMS & Moderation)
- **Review & Video Moderation Authority**:
  - Delete any customer review entirely.
  - **Remove videos specifically** from reviews if inappropriate while retaining the written review text.
  - Remove attached images.
  - Toggle "Featured" badge on high-impact testimonials.
- **Website Content CMS**:
  - Edit hero announcement bar, main title, and subheadings.
  - **Add or upload new Hero banner images** directly from your local drive.
  - Update WhatsApp business phone number, inquiry email, and studio address.
  - Add new NFC products or edit prices, descriptions, and upload product card images.
- **Inbound Customer Inquiries CRM**:
  - View all leads, requested card types, quantities, and customer notes.
  - 1-click WhatsApp instant reply pre-filled with order details.
  - Update lead status (`New`, `In Progress`, `Completed`).

---

## 🔐 Admin Access Credentials
- **Access Link**: Click the **"Admin"** button in the top navigation bar or the footer link.
- **Default Passcode**: `admin123`
*(You can customize the passcode directly in the Admin Panel or in `src/services/storage.js`)*.

---

## 🚀 How to Run the Website

### Option 1: 1-Click Startup (Recommended for Windows)
Simply double-click the **[`start-server.bat`](file:///c:/Users/301461/Desktop/NFC/start-server.bat)** file in this folder. It will:
1. Verify Node.js and packages.
2. Launch the local web server.
3. Automatically open **`http://localhost:3000/`** in your default web browser!

---

### Option 2: Command Line
```bash
# 1. Install dependencies (already installed)
npm install

# 2. Run dev server
npm run dev

# 3. Build for production
npm run build
```

Your live platform is running at: **`http://localhost:3000/`**
