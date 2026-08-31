
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--surface) px-6">
      <div className="text-center">
        <p className="text-7xl font-bold text-(--accent)">404</p>

        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>

        <p className="mt-2 text-sm text-(--text-muted)">
          The page you're looking for doesn't exist.
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 cursor-pointer rounded-xl bg-(--accent) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--accent-strong)"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
