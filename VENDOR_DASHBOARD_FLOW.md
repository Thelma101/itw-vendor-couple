# Vendor Dashboard Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      VENDOR DASHBOARD LAYOUT                        │
│  ┌──────────────┬───────────────────────────────────────────────┐  │
│  │   SIDEBAR    │             MAIN CONTENT AREA                 │  │
│  │  (390px)     │              (Outlet)                         │  │
│  │              │                                               │  │
│  │  ┌────────┐  │  ┌──────────────────────────────────────┐   │  │
│  │  │Profile │  │  │                                       │   │  │
│  │  │ Photo  │  │  │         PAGE CONTENT                  │   │  │
│  │  │        │  │  │       (Dynamic Routes)                │   │  │
│  │  └────────┘  │  │                                       │   │  │
│  │              │  │                                       │   │  │
│  │  Ogundare    │  └──────────────────────────────────────┘   │  │
│  │   Taiwo      │                                               │  │
│  │              │                                               │  │
│  │  1079 | 100K | 800                                          │  │
│  │  ───────────────                                            │  │
│  │                                                              │  │
│  │  ☑ Gallery                                                  │  │
│  │  ☐ Account Information                                      │  │
│  │  ☐ Subscription                                             │  │
│  │  ☐ Security                                                 │  │
│  │                                                              │  │
│  │  🚪 Log out                                                 │  │
│  └──────────────┴───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════

                          PAGE ROUTES FLOW

┌──────────────────────────────────────────────────────────────────────┐
│                    /vendor/gallery (Gallery)                         │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  User Profile                                                  │ │
│  │                                                                │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │ Denver Music Crew                 | [Get in touch]      │  │ │
│  │  │ Category: Music | N500,000        | ⭐ 4.6 (580)       │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │ Dove Cars Nig Ltd                 | [Get in touch]      │  │ │
│  │  │ 🚗🚗🚗🚗                          | ⭐ 4.6 (580)       │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │ Rings of Fire                     | [Get in touch]      │  │ │
│  │  │ 💍💍                              | ⭐ 4.6 (580)       │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                   │
                                   ├── Sidebar: Account Information
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│              /vendor/account (AccountInformation)                    │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  User Profile                              [Edit Info]         │ │
│  │                                                                │ │
│  │  ┌────────────────┐  ┌────────────────┐                      │ │
│  │  │ Taiwo          │  │ Ogundare       │                      │ │
│  │  └────────────────┘  └────────────────┘                      │ │
│  │                                                                │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │ Sito Graphix and Interior Decor                         │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │ ogundare.taiwo.israel@gmail.com                         │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  Social Media                                                 │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │ │
│  │  │ Facebook     │ │ Twitter      │ │ Instagram    │         │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘         │ │
│  │                                                                │ │
│  │                         [SAVE]                                 │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                   │
                                   ├── Sidebar: Subscription
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│              /vendor/subscription (SubscriptionPage)                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  My Earnings                                                   │ │
│  │  ┌────────────────────────────────────────────────────────┐    │ │
│  │  │   🍩       ₦1.1M Total                                │    │ │
│  │  │ Donut    ● Couples: ₦1,020,000                        │    │ │
│  │  │ Chart    ● Vendors: ₦80,000                           │    │ │
│  │  └────────────────────────────────────────────────────────┘    │ │
│  │                                                                │ │
│  │  Pricing Plan                                                  │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │ │
│  │  │  BASIC   │  │ STANDARD │  │ PREMIUM  │                    │ │
│  │  │  FREE    │  │  ₦20K    │  │  ₦50K    │                    │ │
│  │  │          │  │          │  │          │                    │ │
│  │  │ Current  │  │  SELECT  │  │  SELECT  │────────┐           │ │
│  │  │  Active  │  │   PLAN   │  │   PLAN   │        │           │ │
│  │  └──────────┘  └──────────┘  └──────────┘        │           │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                                        │
                                                        │ Click SELECT PLAN
                                                        ▼
┌──────────────────────────────────────────────────────────────────────┐
│               /vendor/payment (PaymentMethod)                        │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                  STANDARD                                       │ │
│  │                  PACKAGE                                        │ │
│  │                                                                │ │
│  │  You're about to subscribe to Standard plan (N50,000/year)    │ │
│  │                                                                │ │
│  │  Select Payment Method                                         │ │
│  │                                                                │ │
│  │  ○ [PAYSTACK LOGO]        ○ [FLUTTERWAVE LOGO]               │ │
│  │                                                                │ │
│  │              [Continue to Payment]────────┐                    │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                                        │
                                                        │ Submit Payment
                                                        ▼
┌──────────────────────────────────────────────────────────────────────┐
│          /vendor/subscription/success (SubscriptionSuccess)          │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              🎉🎊 CONFETTI ANIMATION 🎊🎉                      │ │
│  │                                                                │ │
│  │                      ✅                                        │ │
│  │                                                                │ │
│  │               Welcome to STANDARD Plan!                        │ │
│  │        Your subscription has been activated                    │ │
│  │                                                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │ Subscription Details                                     │ │ │
│  │  │                                                          │ │ │
│  │  │ Plan: STANDARD       Amount: ₦20K                       │ │ │
│  │  │ Billing: Annual      Next: Dec 25, 2025                 │ │ │
│  │  │                                                          │ │ │
│  │  │ Features Unlocked:                                       │ │ │
│  │  │ ✓ 10 Service Listings    ✓ Featured in Results         │ │ │
│  │  │ ✓ Unlimited Calendar     ✓ 24/7 Support                │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  │                                                                │ │
│  │  [📥 Download Receipt]  [🏠 Go to Dashboard]                  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                   │
                                   ├── Sidebar: Security
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                /vendor/security (SecurityPage)                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Security                                                       │ │
│  │                                                                │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │ Old Password                                            │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │ New Password                                            │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │ Confirm Password                                        │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │                   [UPDATE PASSWORD]                            │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

## Route Hierarchy

```
/vendor (VendorDashboardLayout)
├── /gallery (Gallery)
├── /account (AccountInformation)
├── /subscription (SubscriptionPage)
│   └── /success (SubscriptionSuccess)
├── /payment (PaymentMethod)
└── /security (SecurityPage)
```

## State Management Flow

```
SubscriptionPage
       │
       │ navigate('/vendor/payment', { state: { plan, price } })
       ▼
PaymentMethod
       │ useLocation() → receives { plan, price }
       │
       │ navigate('/vendor/subscription/success', { state: { plan, price } })
       ▼
SubscriptionSuccess
       │ useLocation() → receives { plan, price }
       │
       │ Display plan details, features, confetti
       │
       │ navigate('/vendor/gallery')
       ▼
Gallery (Dashboard Home)
```

## Key Interactions

1. **Sidebar Navigation**: Click any menu item → Update URL → Outlet renders new page
2. **Plan Selection**: Click "SELECT PLAN" → Navigate to payment with plan data
3. **Payment Submit**: Click payment method → Navigate to success with plan data
4. **Success Actions**:
   - Download Receipt → Trigger download (future implementation)
   - Go to Dashboard → Navigate back to `/vendor/gallery`

## Color Coding

- 🟢 **Teal (#00838F)**: Primary actions, active states
- 🔴 **Red (#FA144A)**: Accent, secondary actions
- ⚪ **White**: Background, cards
- 🟡 **Yellow (#eceba2)**: Earnings chart segment
- ⚫ **Dark (#002528)**: Text, headings
