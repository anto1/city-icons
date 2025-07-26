export default function TestPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ✅ Test Page Working!
        </h1>
        <p className="text-xl text-gray-600">
          If you can see this, routing is working correctly.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Environment: {process.env.NODE_ENV}
        </p>
      </div>
    </div>
  );
} 