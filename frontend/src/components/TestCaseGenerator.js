import React, { useState } from "react";

const TestCaseGenerator = ({ stories }) => {
  const [loading, setLoading] = useState(false);
  const [testCases, setTestCases] = useState([]);

  const generateTestCases = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/jira/generate-test-cases",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stories }),
        },
      );
      const data = await response.json();
      setTestCases(data.testCases || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="mb-6">
      <button onClick={generateTestCases} disabled={loading}>
        {loading ? "Generating..." : "Generate Test Cases"}
      </button>

      {testCases.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Generated Test Cases</h3>
          <ul className="space-y-2">
            {testCases.map((tc, idx) => (
              <li key={idx} className="p-3 bg-gray-100 rounded">
                <b>{tc.title}</b>
                <p>Steps: {tc.steps.join(", ")}</p>
                <p>Expected Result: {tc.expectedResult}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestCaseGenerator;
