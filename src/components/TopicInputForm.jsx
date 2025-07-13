export default function TopicInputForm() {
  return (
    <form className="flex gap-2">
      <input
        type="text"
        placeholder="Enter a topic..."
        className="border px-3 py-2 rounded w-64"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Generate</button>
    </form>
  );
} 