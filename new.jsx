import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const features = [
  {
    image: "https://firebasestorage.googleapis.com/v0/b/widecanvas-d0dd4.appspot.com/o/additional-images%2Fa.jpg?alt=media&token=e34e1e35-606c-4341-be4a-d16d9406ab1b",
    title: "Easy Upload",
    description: "Drag & drop or browse your files. We support PDF and images.",
  },
  {
    image: "https://firebasestorage.googleapis.com/v0/b/widecanvas-d0dd4.appspot.com/o/additional-images%2Fb.png?alt=media&token=192e15c0-fc20-4fd0-becb-f509b71ec81c",
    title: "Smart Analysis",
    description: "Advanced AI analyzes your document content thoroughly.",
  },
  {
    image: "https://firebasestorage.googleapis.com/v0/b/widecanvas-d0dd4.appspot.com/o/additional-images%2Fc.jpg?alt=media&token=2c1c014e-a407-489f-a64a-b53e46e06bfb",
    title: "Instant Summary",
    description: "Get comprehensive summaries with key points highlighted.",
  },
];

export default function DocSummarizer() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [keyPoints, setKeyPoints] = useState([]);
  const [summaryLength, setSummaryLength] = useState("short");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    await handleFile(file);
  };

  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    await handleFile(file);
  };

  const handleFile = async (file) => {
    if (!file) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file (JPG, PNG)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', 'user123');
      formData.append('appSlug', 'doc-summarizer-123');

      const uploadResponse = await fetch('https://r0c8kgwocscg8gsokogwwsw4.zetaverse.one/storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer LZaUNSkvWpXMgM3RAXrkLz6gRgh2'
        },
        body: formData
      });

      const uploadResult = await uploadResponse.json();

      if (uploadResult.success) {
        const aiResponse = await fetch('https://r0c8kgwocscg8gsokogwwsw4.zetaverse.one/ai', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer LZaUNSkvWpXMgM3RAXrkLz6gRgh2',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: [{
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Please analyze this document and provide a summary with key points"
                },
                {
                  type: "image_url",
                  image_url: {
                    url: uploadResult.url
                  }
                }
              ]
            }]
          })
        });

        const aiResult = await aiResponse.json();
        
        if (aiResult.message) {
          setSummary(aiResult.message);
          const points = aiResult.message.split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(point => point.substring(1).trim());
          setKeyPoints(points);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your document",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast({
        title: "Copied!",
        description: "Summary copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/widecanvas-d0dd4.appspot.com/o/logos%2Fsdfghj.jpg?alt=media&token=551aed22-db05-4d3d-a3d4-2b9661db4958"
                alt="DocSummarizer Logo"
                className="h-8 w-auto mr-3"
              />
              <span className="text-xl font-semibold text-primary">DocSummarizer AI</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Smart Document Summary Assistant
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform your documents into concise, intelligent summaries with our AI-powered tool.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:-translate-y-1 transition-transform duration-300">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-secondary mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div
              className={`border-2 border-dashed border-primary rounded-lg p-8 text-center cursor-pointer ${
                isDragging ? "bg-primary/10" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <i className="bi bi-cloud-upload text-4xl text-primary mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Drag & Drop your document here
              </h3>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <Button>Browse Files</Button>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, JPG, PNG
              </p>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Summary Length
              </h4>
              <RadioGroup
                value={summaryLength}
                onValueChange={setSummaryLength}
                className="flex space-x-4"
              >
                {["short", "medium", "long"].map((length) => (
                  <div key={length} className="flex items-center space-x-2">
                    <RadioGroupItem value={length} id={length} />
                    <Label htmlFor={length} className="capitalize">
                      {length}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </Card>

          <Card className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-gray-600">Analyzing your document...</p>
              </div>
            ) : summary ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Generated Summary
                  </h3>
                  <Button variant="ghost" onClick={copyToClipboard}>
                    <i className="bi bi-clipboard mr-1"></i> Copy
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600">{summary}</p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Key Points
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {keyPoints.map((point, index) => (
                      <li key={index} className="mb-2">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <i className="bi bi-file-text text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-500">Upload a document to see the summary</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}