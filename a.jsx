import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, CloudUpload } from "lucide-react";

const DocumentSummaryAssistant = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSummaryOptions, setShowSummaryOptions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLength, setSelectedLength] = useState(null);
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState([]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    handleFile(file);
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    setCurrentFile(file);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowSummaryOptions(true);
      processDocument(file);
    }, 2000);
  };

  const processDocument = (file) => {
    console.log('Processing document:', file.name);
  };

  const generateSummary = (length) => {
    setSelectedLength(length);
    setShowResults(true);

    const sampleSummary = "This is a sample summary of the document. In a real application, this would be generated based on the document content and the selected length.";
    const samplePoints = [
      "First key point from the document",
      "Second important finding",
      "Third significant detail"
    ];

    setSummary(sampleSummary);
    setKeyPoints(samplePoints);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Document Summary Assistant</h1>
          <p className="text-gray-600">Upload your documents and get smart summaries instantly</p>
        </header>

        <Card className="max-w-3xl mx-auto p-6">
          {!isProcessing && !showSummaryOptions && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <CloudUpload className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-600">Drag and drop your document here or</p>
              <Button className="mt-2">Choose File</Button>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileInput}
              />
            </div>
          )}

          {isProcessing && (
            <div className="text-center">
              <Progress value={30} className="w-[60%] mx-auto" />
              <p className="mt-4 text-gray-600">Processing your document...</p>
            </div>
          )}

          {showSummaryOptions && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Summary Length</h3>
              <Tabs defaultValue="short" className="w-full">
                <TabsList>
                  <TabsTrigger value="short" onClick={() => generateSummary('short')}>Short</TabsTrigger>
                  <TabsTrigger value="medium" onClick={() => generateSummary('medium')}>Medium</TabsTrigger>
                  <TabsTrigger value="long" onClick={() => generateSummary('long')}>Long</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {showResults && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                {summary}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Key Points:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DocumentSummaryAssistant;