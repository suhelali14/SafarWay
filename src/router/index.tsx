import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import { App } from "../App";
import { DashboardLayout } from "../components/dashboard/layout/dashboard-layout";
import { DashboardPage } from "../pages/dashboard";
import { PackagesPage } from "../pages/dashboard/packages";
import AddPackagePage from "../pages/dashboard/packages/add";
import ToursPage from "../pages/Tours";
import TourDetailsPage from "../pages/TourDetails";
import BookTourPage from "../pages/BookTour";

const router = createBrowserRouter([
  {
    // Main website routes
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "tours",
        element: <ToursPage />,
      },
      {
        path: "tours/:id",
        element: <TourDetailsPage />,
      },
      {
        path: "tours/:id/book",
        element: <BookTourPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    // Dashboard routes
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "packages",
        element: <PackagesPage />,
      },
      {
        path: "packages/add",
        element: <AddPackagePage />,
      },
      {
        path: "bookings",
        element: <div>Bookings Page (Coming Soon)</div>,
      },
      {
        path: "messages",
        element: <div>Messages Page (Coming Soon)</div>,
      },
      {
        path: "reviews",
        element: <div>Reviews Page (Coming Soon)</div>,
      },
      {
        path: "earnings",
        element: <div>Earnings Page (Coming Soon)</div>,
      },
      {
        path: "settings",
        element: <div>Settings Page (Coming Soon)</div>,
      },
    ],
  },
]);

export default router;
