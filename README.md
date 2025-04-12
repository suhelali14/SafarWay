# 🌍 SafarWay - Multi-Vendor Travel Booking Platform

SafarWay is a modern travel booking platform that connects travelers with verified travel agencies, offering curated travel packages and experiences.

## ✨ Features

- 🔐 **Role-Based Authentication**
  - Customer registration and login
  - Agency registration and verification
  - JWT-based secure authentication

- 🎯 **Smart Search & Filtering**
  - Location-based package search
  - Date range selection
  - Guest count management
  - Package type filtering
  - Real-time search suggestions

- 💼 **Agency Dashboard**
  - Package management
  - Booking overview
  - Customer insights
  - Analytics and reports
  - Profile management

- 👤 **Customer Features**
  - Package browsing and booking
  - Booking management
  - Travel history
  - Favorite packages
  - Reviews and ratings

- 🎨 **Modern UI/UX**
  - Responsive design
  - Smooth animations
  - Intuitive navigation
  - Dark/Light mode support
  - Mobile-first approach

## 🚀 Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - shadcn/ui
  - React Router v6
  - React Query
  - React Hook Form
  - date-fns

- **Development Tools**
  - Vite
  - ESLint
  - Prettier
  - PostCSS
  - Husky (Git hooks)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/safarway.git
   cd safarway
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=your_api_url
   VITE_MAPBOX_TOKEN=your_mapbox_token
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_MAPBOX_TOKEN` | Mapbox API token for maps | Yes |

### API Integration

The frontend expects the following API endpoints:

```typescript
/api/auth/login            // POST - User login
/api/auth/register         // POST - User registration
/api/auth/verify-email     // POST - Email verification
/api/packages             // GET - List packages
/api/packages/:id         // GET - Package details
/api/bookings            // POST - Create booking
/api/user/profile        // GET/PUT - User profile
```

## 📱 Responsive Design

SafarWay is built with a mobile-first approach and supports the following breakpoints:

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🎨 Theme Customization

### Colors

```typescript
colors: {
  primary: '#ff6200',    // SafarWay Orange
  secondary: '#1a1a1a',  // Dark Gray
  accent: '#ffd700',     // Gold
}
```

### Typography

- Primary Font: Inter
- Heading Font: Poppins
- Monospace: JetBrains Mono

## 🔒 Security

- JWT-based authentication
- Protected routes
- Role-based access control
- Input validation
- XSS protection
- CSRF protection

## 🧪 Testing

Run tests:
```bash
npm run test          # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test:coverage # Generate coverage report
```

## 📝 Code Style

- ESLint configuration
- Prettier setup
- TypeScript strict mode
- Import sorting
- Consistent naming conventions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Project Lead: [Name]
- UI/UX Design: [Name]
- Frontend Development: [Name]
- Backend Development: [Name]

## 📞 Support

For support, email support@safarway.com or join our Slack channel.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [React Icons](https://react-icons.github.io/react-icons/) for the icon set
