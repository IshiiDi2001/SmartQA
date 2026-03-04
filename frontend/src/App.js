import { useState, useEffect } from "react";
import axios from "axios";
import ThunderIcon from "./assets/icons/thunder.png";
import BookIcon from "./assets/icons/book.png";
import PageIcon from "./assets/icons/page.png";
import StarIcon from "./assets/icons/star.png";
import TubeIcon from "./assets/icons/tube.png";
import CheckIcon from "./assets/icons/check.png";
import ShareIcon from "./assets/icons/share.png";
import DownloadIcon from "./assets/icons/download.png";
import DownIcon from "./assets/icons/down.png";
import UpIcon from "./assets/icons/up.png";
import MarkIcon from "./assets/icons/mark.png";
import LinkIcon from "./assets/icons/link.png";
import ShineIcon from "./assets/icons/shines.png";
import ShieldIcon from "./assets/icons/coverage.png";
import ClockIcon from "./assets/icons/clock.png";

function App() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [expandedTC, setExpandedTC] = useState({});
  const [generatedTestCasesField, setGeneratedTestCasesField] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    if (!token) return;

    setAccessToken(token);

    const fetchStories = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          "https://smartqa-pe5h.onrender.com/api/jira/fetch-stories",
          {
            accessToken: token,
            projectKey: process.env.REACT_APP_JIRA_PROJECT_KEY || "SQ",
          },
        );
        setStories(res.data.stories);
        setGeneratedTestCasesField(res.data.generatedTestCasesField);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch stories");
      }
      setLoading(false);
      window.history.replaceState({}, document.title, "/"); // clean URL
    };

    fetchStories();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);

      const res = await axios.post(
        "https://smartqa-pe5h.onrender.com/api/jira/generate-testcases",
        {
          stories,
        },
      );

      setTestCases(res.data.testCases);
    } catch (err) {
      console.error(err);
      alert("Failed to generate test cases");
    }

    setGenerating(false);
  };

  const toggleTC = (id) => {
    setExpandedTC((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.post(
        "https://smartqa-pe5h.onrender.com/api/export/excel",
        { testCases },
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "test-cases.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Excel export failed", error);
    }
  };

  const handleExportJira = async () => {
    try {
      await axios.post("https://smartqa-pe5h.onrender.com/api/export/jira", {
        accessToken,
        testCases,
        generatedTestCasesField,
      });

      alert("Test cases exported to Jira!");
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg px-12 py-10 text-center">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow">
            <img src={ThunderIcon} alt="Thunder" className="w-6 h-6" />
          </div>

          <div className="text-left">
            <h1 className="font-semibold text-xl text-gray-900">Smart QA</h1>
            <p className="text-xs tracking-wide text-gray-500">
              AI-POWERED TEST CASE GENERATOR
            </p>
          </div>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {stories.length === 0 && !loading && (
          <div className="flex flex-col items-center">
            {/* Icon Card */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
                <img src={LinkIcon} alt="Link" className="w-7 h-7" />
              </div>

              {/* floating sparkle */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow">
                <img src={StarIcon} alt="Generate" className="w-3 h-3" />
              </div>
            </div>

            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Connect your Jira project
            </h2>

            <p className="text-gray-500 max-w-lg mb-10">
              Link your Jira account to automatically fetch user stories and
              generate comprehensive test cases with AI.
            </p>

            {/* CTA BUTTON */}
            <a
              href="https://smartqa-pe5h.onrender.com/api/oauth/connect"
              className="inline-flex items-center gap-2
                     px-8 py-3 bg-blue-600 text-white
                     rounded-xl font-medium shadow-md
                     hover:bg-blue-700 transition"
            >
              Connect Jira →
            </a>

            <div>
              <p className="text-xs text-gray-400 mb-6">
                Note: Please Add Acceptance Criteria(with data) and Generated
                Test Cases custom fields to your Jira project. You will be
                redirected to Atlassian for authentication. We only request read
                access to fetch your stories and write access to update test
                cases. Your data is secure and never stored on our servers.
              </p>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && <p className="text-gray-600">Loading stories...</p>}

        {/* STORIES VIEW (UNCHANGED FUNCTIONALITY) */}
        {stories.length > 0 && (
          <div className="max-w-5xl mx-auto text-left">
            {/* Header */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <img src={BookIcon} alt="Stories" className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Fetched Stories
                </h2>
                <p className="text-sm text-gray-500">
                  {stories.length} stories ready for test generation
                </p>
              </div>
            </div>

            {/* MAIN CARD */}
            <div className="bg-white rounded-2xl shadow-md flex flex-col h-[70vh] overflow-hidden">
              {/* Scrollable Area */}
              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                {stories.map((story) => (
                  <div
                    key={story.key}
                    className="border rounded-xl p-6 bg-gray-50"
                  >
                    {/* Story Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-gray-400 text-lg">
                        <img
                          src={PageIcon}
                          alt="Story"
                          className="w-5 h-5 opacity-60"
                        />
                      </span>

                      <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                        {story.key}
                      </span>

                      <h3 className="font-semibold text-gray-900">
                        {story.summary}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-700 leading-relaxed mb-4 pl-9">
                      {story.description}
                    </p>

                    {/* Acceptance Criteria */}
                    <div className="pl-9">
                      <p className="text-xs font-semibold tracking-wide text-gray-600 mb-2">
                        ACCEPTANCE CRITERIA
                      </p>

                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                        {story.acceptanceCriteria
                          .split("\n")
                          .map((line) => line.replace(/^\d+\.\s*/, ""))
                          .filter((line) => line.trim() !== "")
                          .map((line, idx) => (
                            <li key={idx}>{line}</li>
                          ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Action Bar */}
              <div className="bg-gray-100 px-6 py-4 flex justify-end border-t">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600
             text-white rounded-xl hover:bg-blue-700 shadow
             disabled:bg-gray-400"
                >
                  <img src={StarIcon} alt="Generate" className="w-5 h-5" />
                  {generating ? "Generating..." : "Generate Test Cases"}
                </button>
              </div>
            </div>
          </div>
        )}

        {testCases.length > 0 && (
          <div className="max-w-5xl mx-auto mt-10 text-left">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <img src={TubeIcon} alt="TestCases" className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Generated Test Cases
              </h2>
            </div>

            {/* MAIN CARD */}
            <div className="bg-white rounded-2xl shadow-md flex flex-col h-[70vh] overflow-hidden">
              {/* ✅ Scrollable Area */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {testCases.map((story, storyIndex) => (
                  <div
                    key={storyIndex}
                    className="bg-gray-50 border rounded-xl overflow-hidden"
                  >
                    {/* Story Title */}
                    {/* Story Title */}
                    <div className="px-6 py-4 border-b bg-gray-100 flex items-center gap-2">
                      <img src={CheckIcon} alt="Story" className="w-4 h-4" />
                      <h3 className="font-semibold text-blue-600">
                        {story.storyKey} {story.storySummary}
                      </h3>
                    </div>

                    {/* Test Cases */}
                    <div className="divide-y">
                      {story.testCases.map((tc) => (
                        <div key={tc.id} className="border-b">
                          {/* CLICKABLE HEADER */}
                          <div
                            onClick={() => toggleTC(tc.id)}
                            className="p-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition"
                          >
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 text-xs font-semibold bg-gray-200 rounded-full">
                                TC-{tc.id}
                              </span>

                              <p className="font-normal text-gray-900">
                                {tc.title}
                              </p>
                            </div>

                            {/* Expand Icon */}
                            <span className="text-gray-500">
                              <img
                                src={expandedTC[tc.id] ? UpIcon : DownIcon}
                                alt="toggle"
                                className="w-4 h-4 inline"
                              />
                            </span>
                          </div>

                          {/* EXPANDABLE CONTENT */}
                          {expandedTC[tc.id] && (
                            <div className="px-6 pb-6">
                              {/* Steps */}
                              <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-500 mb-2">
                                  STEPS
                                </p>

                                <ol className="list-decimal ml-5 space-y-1 text-sm text-gray-700">
                                  {tc.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ol>
                              </div>

                              {/* Expected */}
                              <div className="bg-green-100 text-green-900 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                                <img
                                  src={MarkIcon}
                                  alt="Right"
                                  className="w-4 h-4"
                                />

                                <span className="font-semibold">
                                  Expected Result:
                                </span>

                                <span>{tc.expectedResult}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* ✅ Bottom Fixed Buttons */}
              <div className="bg-gray-100 px-6 py-4 border-t flex justify-between">
                {/* LEFT BUTTON */}
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg
  hover:bg-green-700 shadow flex items-center gap-2"
                  onClick={handleExportJira}
                >
                  <img src={ShareIcon} alt="Share" className="w-5 h-5" />
                  Export to Jira
                </button>

                {/* RIGHT BUTTON */}
                <button
                  className="px-6 py-2 bg-gray-300 text-black rounded-lg
          hover:bg-gray-400 shadow flex items-center gap-2"
                  onClick={handleExportExcel}
                >
                  <img src={DownloadIcon} alt="Download" className="w-5 h-5" />
                  Download to Excel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* ================= DIVIDER ================= */}
        <div className="border-t mt-14 mb-8"></div>

        {/* ================= FEATURES ================= */}
        <div className="grid md:grid-cols-3 gap-10 text-left">
          {/* Feature 1 */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <img src={ShineIcon} alt="Generate" className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">AI Generation</h4>
              <p className="text-sm text-gray-500">
                Auto-generate test cases from user stories
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <img src={ShieldIcon} alt="Shield" className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Full Coverage</h4>
              <p className="text-sm text-gray-500">
                Edge cases & negative scenarios
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <img src={ClockIcon} alt="Clock" className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Save Hours</h4>
              <p className="text-sm text-gray-500">
                Reduce QA planning time by 80%
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400 mt-6">
        Powered by AI · Your data stays secure
      </p>
    </div>
  );
}

export default App;
