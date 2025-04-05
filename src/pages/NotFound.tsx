import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl mb-4">Page Not Found</p>
      <Link
        to="/"
        className="text-blue-500 underline hover:text-blue-700 transition"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
