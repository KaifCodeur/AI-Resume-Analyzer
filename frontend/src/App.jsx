import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import ResumeUpload from "./components/ResumeUpload/ResumeUpload";

function App() {
  return (
    <>
      <Navbar />

      <Hero
  title="Professional AI Resume Analyzer"
  description="Analyze your resume with AI, improve your ATS score, and receive personalized suggestions."
/>

      
      <ResumeUpload />
    </>
  );
}

export default App;