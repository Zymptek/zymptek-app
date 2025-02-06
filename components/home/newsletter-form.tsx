'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message);
      }

      // Show success message
      toast({
        variant: "success",
        title: "Successfully Subscribed!",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>{data.message}</span>
          </div>
        ),
      });
      setEmail(''); // Clear the form
    } catch (error) {
      // Show error message
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description: (
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-white" />
            <span className="text-white">
              {error instanceof Error ? error.message : 'Failed to subscribe. Please try again.'}
            </span>
          </div>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your business email"
        className="flex-grow px-4 py-2 rounded-lg border text-brand-300 border-brand-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
        required
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className={`inline-flex items-center justify-center px-6 py-2 bg-brand-200 text-white font-semibold rounded-lg hover:bg-brand-300 transform hover:scale-105 transition-all duration-200 shadow hover:shadow-md whitespace-nowrap ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <span>Subscribe</span>
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </>
        )}
      </button>
    </form>
  );
} 