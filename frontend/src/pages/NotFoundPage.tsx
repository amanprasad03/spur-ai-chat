import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className='min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center px-4 py-12'>
      <div className='text-6xl font-bold text-indigo-400'>404</div>
      <div className='text-2xl font-semibold mt-3'>Page not found</div>
      <p className='text-slate-300 mt-2 mb-6 text-center max-w-md'>
        We couldn't find the page you're looking for. It may have been moved or
        deleted.
      </p>
      <Link
        to='/'
        className='px-4 py-2 rounded-xl border border-indigo-500 bg-indigo-600 text-slate-50 font-semibold'
      >
        Go back home
      </Link>
    </div>
  );
}

export default NotFoundPage;
