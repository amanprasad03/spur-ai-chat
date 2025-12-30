import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function RouteError() {
  const error = useRouteError();

  let title = "Something went wrong";
  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    details = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    details = error.message;
  }

  return (
    <div className='min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-2xl bg-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-xl'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <div className='text-xl font-semibold text-rose-100'>{title}</div>
            <p className='text-sm text-slate-300 mt-1'>
              We hit a snag. Please try again.
            </p>
          </div>
          <button
            type='button'
            onClick={() => window.location.reload()}
            className='px-3 py-2 rounded-lg border border-rose-400 text-rose-50 bg-rose-900/50 text-sm font-semibold'
          >
            Reload
          </button>
        </div>

        <div className='mt-4 text-sm'>
          <div className='font-semibold text-slate-200'>Error details</div>
          <pre className='bg-slate-950 border border-slate-800 rounded-lg p-3 mt-2 text-slate-300 text-xs overflow-auto max-h-48 whitespace-pre-wrap'>
            {details}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default RouteError;
