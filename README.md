# Placement Readiness System - Frontend

A modern React frontend application for a placement readiness management system built with Vite, React Router, and Tailwind CSS.

## Features

- **Role-based Authentication**: Different interfaces for admins, teachers, and students
- **Student Dashboard**: Performance tracking with interactive charts and grade analysis
- **Teacher Portal**: Test creation, marks entry, and student management
- **Admin Panel**: User management and system oversight
- **Real-time Performance Analytics**: Charts and graphs showing student progress
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **React 19** with hooks and context API
- **Vite** for fast development and building
- **React Router 7** for client-side routing
- **Tailwind CSS 4** for styling
- **Recharts** for data visualization
- **Axios** for API communication
- **Radix UI** for accessible UI components

## Quick Setup

### Prerequisites

- Node.js (v16 or higher)
- Backend API running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Placement Readiness System
VITE_APP_VERSION=1.0.0
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components (Modal, Loading, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   ├── student/        # Student-specific components
│   └── teacher/        # Teacher-specific components
├── hooks/              # Custom React hooks
│   └── useAuth.js      # Authentication hook
├── pages/              # Page components
│   ├── Dashboard.jsx   # Role-based dashboard
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # Student registration
│   ├── Tests.jsx       # Test management
│   ├── AdminPage.jsx   # Admin panel
│   └── StudentsPage.jsx # Student management
├── services/           # API services
│   └── api.js          # Axios configuration and API calls
├── utils/              # Utility functions
│   └── helpers.js      # Common helper functions
├── App.jsx             # Main app component
├── index.css           # Global styles
└── main.jsx            # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## User Roles & Features

### Students
- View personal dashboard with performance metrics
- Track test results and grades
- View performance analytics with charts
- See upcoming tests and deadlines

### Teachers
- Create and manage tests
- Enter marks for students
- View student performance
- Manage assigned subjects

### Administrators
- Manage users (students and teachers)
- Create subjects and assign teachers
- View system-wide analytics
- Oversee all system operations

## API Integration

The frontend communicates with the backend API through:

- **Authentication**: JWT token-based authentication
- **Role-based Access**: Different API endpoints for different user roles
- **Real-time Data**: Automatic token refresh and error handling
- **Optimistic Updates**: Immediate UI updates with error rollback

## Performance Features

- **Student Analytics**: Interactive charts showing performance trends
- **Grade Distribution**: Visual representation of grades across subjects
- **Subject-wise Performance**: Detailed breakdowns by subject
- **Monthly Progress**: Time-based performance tracking

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable styled components
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: (Coming soon)

## Development

### Adding New Components

1. Create component in appropriate directory
2. Use TypeScript for better development experience
3. Follow the existing patterns for API calls and state management
4. Add proper error handling and loading states

### State Management

- **Authentication**: Context API with useAuth hook
- **Local State**: useState for component-level state
- **API State**: Custom hooks for data fetching

### Testing

```bash
npm test
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your web server
3. Configure your web server to handle client-side routing
4. Update environment variables for production API URL

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Check if backend is running on port 5000
2. **Authentication Issues**: Clear localStorage and login again
3. **Build Errors**: Delete node_modules and run npm install

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
