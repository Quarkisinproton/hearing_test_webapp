"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HearingTestResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AudiogramChart from '@/components/audiogram-chart';
import { ArrowLeft, Trash2, History as HistoryIcon, Waves } from 'lucide-react';

const HEARING_RESULTS_KEY = 'audioclear_hearing_results';

export default function HistoryPage() {
  const [results, setResults] = useState<HearingTestResult[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedResults = localStorage.getItem(HEARING_RESULTS_KEY);
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);
  
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all hearing test history? This action cannot be undone.')) {
      localStorage.removeItem(HEARING_RESULTS_KEY);
      setResults([]);
    }
  };

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
            <Button asChild variant="ghost" size="icon" className="mr-2">
                <Link href="/" aria-label="Back to home">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
            </Button>
            <Waves className="h-7 w-7 mr-3 text-primary" />
            <h1 className="text-2xl font-bold font-headline tracking-tight">Test History</h1>
            {results.length > 0 && (
                <Button variant="destructive" size="sm" onClick={clearHistory} className="ml-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> Clear History
                </Button>
            )}
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
            {results.length === 0 ? (
            <Card className="text-center py-16 shadow-lg">
                <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                    <HistoryIcon className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="mt-4">No History Found</CardTitle>
                <CardDescription>You haven't completed any hearing tests yet.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button asChild className="mt-4">
                    <Link href="/">Start a New Test</Link>
                </Button>
                </CardContent>
            </Card>
            ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
                {results.sort((a,b) => b.timestamp - a.timestamp).map((result) => (
                <AccordionItem value={result.id} key={result.id} className="border-b-0">
                    <Card className="shadow-md">
                        <AccordionTrigger className="text-lg px-6 py-4 hover:no-underline">
                            Test from {new Date(result.timestamp).toLocaleString()}
                        </AccordionTrigger>
                        <AccordionContent className="px-2 pb-2">
                        <AudiogramChart data={result.results} />
                        </AccordionContent>
                    </Card>
                </AccordionItem>
                ))}
            </Accordion>
            )}
        </div>
      </main>
    </div>
  )
}
