import React, { useState } from 'react'
import CodeInput from './Components/CodeInput';
import OptimizedCode from './Components/OptimizedCode';
import "./App.css";
import ReviewPanel from './Components/ReviewPanel';   

const App = () => {
  const [reviewData, setReviewData] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const handleReviewComplete = (data) => {
    setReviewData(data);
  };

  const handleSubmit = async (code, language, source, filename) => {
    setSubmittedData({ code, language, source, filename });
    // The CodeInput will call onReviewComplete
  };

  return (
          
    <div>
      <h1>AI code reviewer</h1>
      <CodeInput onReviewComplete={handleReviewComplete} onSubmit={handleSubmit} />
      <ReviewPanel review={reviewData} />
      <OptimizedCode optimizedCode={reviewData?.optimized_code} language={submittedData?.language} />
    </div>
  )
}

export default App