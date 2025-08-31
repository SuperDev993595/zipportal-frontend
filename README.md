# ZipPortal Frontend

A React-based frontend application for the ZipPortal admin dashboard, built with TypeScript and Material-UI.

## Features

- **Dashboard**: Overview with statistics and quick navigation
- **Users Management**: View, manage, and navigate to user details
- **Transactions**: Monitor and manage transaction data
- **ZIP Upload**: Drag & drop interface for uploading and processing ZIP files
- **User Details**: Individual user pages with avatar display and transaction history
- **Responsive Design**: Modern UI built with Material-UI components

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navigation.tsx  # Main navigation bar
├── pages/              # Page components
│   ├── Dashboard.tsx   # Dashboard overview
│   ├── Users.tsx       # Users list and management
│   ├── UserDetail.tsx  # Individual user details
│   ├── Transactions.tsx # Transactions list
│   └── Upload.tsx      # ZIP file upload
├── services/           # API service layer
│   └── api.ts         # Axios-based API client
├── types/              # TypeScript type definitions
│   └── index.ts       # User, Transaction, and API types
└── utils/              # Utility functions
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Dependencies

### Core
- React 18 with TypeScript
- React Router for navigation
- Material-UI for UI components

### API & Data
- Axios for HTTP requests
- React Dropzone for file uploads

### UI Components
- Material-UI Data Grid for data tables
- Material-UI Icons
- Emotion for styling

## API Integration

The frontend communicates with the backend through the following endpoints:

- **Users**: `/api/users`
- **Transactions**: `/api/transactions`
- **Upload**: `/api/upload`

## ZIP File Upload

The upload functionality supports:
- Drag & drop interface
- File validation (ZIP format only)
- Progress tracking
- Success/error feedback
- File size limits (10MB)

## Features

### Dashboard
- Real-time statistics (users, transactions, total amount)
- Quick action cards
- Navigation shortcuts

### Users Management
- Data grid with sorting and pagination
- User actions (view, edit, delete)
- Avatar display
- Status indicators

### Transactions
- Comprehensive transaction data
- Amount formatting and color coding
- Status and type chips
- User relationship display

### User Details
- Individual user profiles
- Avatar display (with fallback)
- Transaction history
- Edit and delete actions

## Development

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Update navigation in `src/components/Navigation.tsx`

### API Integration
1. Add new API methods in `src/services/api.ts`
2. Define types in `src/types/index.ts`
3. Use in your components

### Styling
- Use Material-UI's `sx` prop for component styling
- Follow the established theme in `src/App.tsx`
- Maintain consistent spacing and typography

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Serve the `build` folder using a static file server

3. Update API base URL in `src/services/api.ts` for production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Maintain consistent formatting
4. Add proper error handling
5. Test all functionality before committing
