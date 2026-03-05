import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { UploadCloud, FileText, Bot, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export const PdfPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        return toast.error('Please select a PDF file');
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file first');

    const formData = new FormData();
    formData.append('pdf', file);

    setLoading(true);
    setSummary('');
    setExtractedText('');

    try {
      const { data } = await axios.post('/api/pdf/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSummary(data.summary);
      setExtractedText(data.extractedText);
      toast.success('PDF analyzed successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">PDF Study Assistant</h1>
        <p className="text-gray-400">Upload a document and let AI summarize the key concepts.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#14141B] p-8 rounded-3xl border border-white/5 text-center">
            <div className="w-20 h-20 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
              <UploadCloud className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Upload Document</h3>
            <p className="text-gray-400 text-sm mb-6">Select a PDF file up to 10MB</p>
            
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="block w-full py-3 px-4 rounded-xl border-2 border-dashed border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5 cursor-pointer transition-all mb-4 text-gray-300"
            >
              {file ? file.name : 'Choose PDF File'}
            </label>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
              {loading ? 'Analyzing...' : 'Generate Summary'}
            </button>
          </div>

          {extractedText && (
            <div className="bg-[#14141B] p-6 rounded-3xl border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-gray-400" />
                <h3 className="font-bold text-gray-200">Extracted Text Preview</h3>
              </div>
              <p className="text-sm text-gray-500 line-clamp-6">{extractedText}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#14141B] p-8 rounded-3xl border border-white/5 min-h-[500px] h-full">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
              <Bot className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold">AI Summary</h2>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                <p>Reading document and generating summary...</p>
              </div>
            ) : summary ? (
              <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-purple-300">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>Upload a PDF to see the AI summary here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
