export default function QuizCard({ quiz }) {
  return (
    <div className="border rounded p-4 shadow bg-white">
      <h3 className="font-semibold mb-2">Quiz</h3>
      <pre className="text-sm whitespace-pre-wrap">{quiz}</pre>
    </div>
  );
} 