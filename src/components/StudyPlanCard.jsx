export default function StudyPlanCard({ plan }) {
  return (
    <div className="border rounded p-4 shadow bg-white">
      <h3 className="font-semibold mb-2">Study Plan</h3>
      <pre className="text-sm whitespace-pre-wrap">{plan}</pre>
    </div>
  );
} 