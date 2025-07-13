export default function ProgressTracker({ progress }) {
  return (
    <div className="border rounded p-4 shadow bg-white">
      <h3 className="font-semibold mb-2">Progress</h3>
      <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(progress, null, 2)}</pre>
    </div>
  );
} 