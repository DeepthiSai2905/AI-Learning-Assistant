export default function InterviewCard({ questions }) {
  return (
    <div className="border rounded p-4 shadow bg-white">
      <h3 className="font-semibold mb-2">Interview Q&A</h3>
      <pre className="text-sm whitespace-pre-wrap">{questions}</pre>
    </div>
  );
} 