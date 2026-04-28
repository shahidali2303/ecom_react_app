# LuxeStore | Full-Stack E-Commerce & Admin Suite 💎

LuxeStore is a high-performance, industry-standard e-commerce ecosystem. It features a premium customer-facing storefront and a secure, responsive Admin Dashboard for real-time inventory and order management.

**🔗 [Live Demo]((https://ecom-react-app-steel.vercel.app/))** | **📁 [Backend: Supabase]((https://eklwbhurycfwllreblvo.supabase.co))**

## 🚀 Key Features

### 🛒 Customer Storefront
- **Dynamic Catalog:** Real-time product browsing powered by DummyJSON & Supabase.
- **Advanced State Management:** Persistent shopping cart and wishlist using **Zustand**.
- **Secure Checkout:** Full integration with Supabase for order processing.
- **Optimized UX:** Smooth navigation and interactive feedback via `react-hot-toast`.

### 🛡️ Admin Dashboard (The "Command Center")
- **RBAC Security:** Role-Based Access Control ensuring only authorized admins can manage data.
- **Order Management:** Real-time tracking of customer orders with status update logic (Paid → Shipped → Delivered).
- **Inventory Control:** Paginated product management with low-stock visual alerts.
- **Responsive Layout:** Fully optimized for Mobile, Tablet, and Desktop management.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, React Router 6.
- **Backend-as-a-Service:** Supabase (PostgreSQL, Auth, RLS).
- **State Management:** Zustand (with Persistence).
- **Data Fetching:** TanStack Query (React Query) for caching and synchronization.
- **Styling:** CSS-in-JS / Responsive Modular Design.
- **Deployment:** Vercel.

## 🏗️ Technical Highlights

- **Supabase RLS Policies:** Implemented Row Level Security to ensure users can only see their own orders while Admins can oversee the entire database.
- **Performance:** Leveraged `range-query` pagination to maintain sub-second load times for large datasets.
- **Scalability:** Architected using a modular component pattern, making it easy to add new features or switch data sources.

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/luxestore.git](https://github.com/yourusername/luxestore.git)
