"use client";

import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { HearingTestResult, AudiogramDataPoint } from '@/lib/types';
import AudiogramChart from './audiogram-chart';
import { Play, Square, Ear, Save, RotateCcw } from 'lucide-react';

const TEST_FREQUENCIES = [125, 250, 500, 1000, 2000, 4000, 8000];
const STARTING_DB = 0;
const MIN_DB = -10;
const MAX_DB = 80;
const DB_STEP_DOWN = 5;
const DB_STEP_UP = 10;
const HEARING_RESULTS_KEY = 'audioclear_hearing_results';

type TestState = 'idle' | 'running' | 'finished';

export function HearingTest() {
  const [testState, setTestState] = useState<TestState>('idle');
  const [currentFrequencyIndex, setCurrentFrequencyIndex] = useState(0);
  const [currentDb, setCurrentDb] = useState(STARTING_DB);
  const [results, setResults] = useState<AudiogramDataPoint[]>([]);
  const [heardOnce, setHeardOnce] = useState(false);

  const synth = useRef<Tone.MonoSynth | null>(null);
  const toneTimeout = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    synth.current = new Tone.MonoSynth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 1, release: 0.1 },
    }).toDestination();
    return () => {
      if (toneTimeout.current) clearTimeout(toneTimeout.current);
      synth.current?.dispose();
    };
  }, []);

  const playTone = (freq: number, db: number) => {
    if (toneTimeout.current) clearTimeout(toneTimeout.current);
    if (!synth.current) return;
    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }
    // Simple mapping of dB HL to volume. This is not perceptually linear.
    const volume = db - 70;
    synth.current.volume.value = volume;
    synth.current.frequency.value = freq;
    synth.current.triggerAttack(freq);
    toneTimeout.current = setTimeout(() => synth.current?.triggerRelease(), 1200);
  };

  const startTest = async () => {
    try {
      await Tone.start();
      setTestState('running');
      setResults([]);
      setCurrentFrequencyIndex(0);
      setCurrentDb(STARTING_DB);
      setHeardOnce(false);
      setTimeout(() => playTone(TEST_FREQUENCIES[0], STARTING_DB), 500);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Audio Error', description: 'Could not start audio context.' });
    }
  };

  const stopTest = () => {
    synth.current?.triggerRelease();
    setTestState('idle');
  };
  
  const moveToNextFrequency = (threshold: number) => {
    const newResult = { frequency: TEST_FREQUENCIES[currentFrequencyIndex], decibel: Math.max(MIN_DB, Math.min(MAX_DB, threshold)) };
    const updatedResults = [...results, newResult].sort((a, b) => a.frequency - b.frequency);
    setResults(updatedResults);

    if (currentFrequencyIndex < TEST_FREQUENCIES.length - 1) {
      setCurrentFrequencyIndex(prev => prev + 1);
      setCurrentDb(STARTING_DB);
      setHeardOnce(false);
      setTimeout(() => playTone(TEST_FREQUENCIES[currentFrequencyIndex + 1], STARTING_DB), 500);
    } else {
      setTestState('finished');
      toast({ title: 'Test Complete!', description: 'Your hearing test results are ready.' });
    }
  };


  const nextStep = (heard: boolean) => {
    if (testState !== 'running') return;
    synth.current?.triggerRelease();

    if (heard) {
      if (heardOnce) {
        // Second time hearing it, threshold found.
        moveToNextFrequency(currentDb);
      } else {
        // First time hearing it, go down and confirm.
        setHeardOnce(true);
        const newDb = currentDb - DB_STEP_DOWN;
        setCurrentDb(newDb);
        setTimeout(() => playTone(TEST_FREQUENCIES[currentFrequencyIndex], newDb), 500);
      }
    } else { // Didn't hear
      if (heardOnce) {
        // Was descending, but missed it. Threshold is the previous level.
        moveToNextFrequency(currentDb + DB_STEP_DOWN);
      } else {
        // Still ascending.
        const newDb = currentDb + DB_STEP_UP;
        if (newDb > MAX_DB) {
          // Can't hear even at max volume, record max and move on.
          moveToNextFrequency(MAX_DB);
        } else {
          setCurrentDb(newDb);
          setTimeout(() => playTone(TEST_FREQUENCIES[currentFrequencyIndex], newDb), 500);
        }
      }
    }
  };
  
  const saveResults = () => {
    try {
      const newResult: HearingTestResult = {
        id: new Date().toISOString(),
        timestamp: Date.now(),
        results: results
      };
      const existingResultsRaw = localStorage.getItem(HEARING_RESULTS_KEY);
      const existingResults: HearingTestResult[] = existingResultsRaw ? JSON.parse(existingResultsRaw) : [];
      localStorage.setItem(HEARING_RESULTS_KEY, JSON.stringify([...existingResults, newResult]));
      toast({ title: "Results Saved", description: "Your test results have been saved locally." });
    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed", description: "Could not save results." });
    }
  };

  const progress = (currentFrequencyIndex / TEST_FREQUENCIES.length) * 100;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Audiometry Test</CardTitle>
        <CardDescription>Use headphones in a quiet room. Press the button when you hear a tone.</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] flex items-center justify-center">
        {testState === 'idle' && (
          <div className="text-center p-8">
            <Button size="lg" onClick={startTest}>
              <Play className="mr-2 h-5 w-5" /> Start Test
            </Button>
          </div>
        )}
        {testState === 'running' && (
          <div className="flex flex-col items-center gap-6 w-full">
            <p className="text-lg font-medium text-muted-foreground">Testing: {TEST_FREQUENCIES[currentFrequencyIndex]} Hz</p>
            <Progress value={progress} className="w-full" />
            <div className="flex gap-4">
              <Button size="lg" className="px-10 py-8" onClick={() => nextStep(true)}>
                <Ear className="mr-2 h-6 w-6" /> I Hear It
              </Button>
               <Button size="lg" variant="outline" className="px-10 py-8" onClick={() => nextStep(false)}>
                I Don't Hear It
              </Button>
            </div>
            <Button variant="destructive" onClick={stopTest} className="mt-4">
              <Square className="mr-2 h-5 w-5" /> Stop Test
            </Button>
          </div>
        )}
        {testState === 'finished' && (
          <div className="flex flex-col items-center gap-4 w-full">
            <AudiogramChart data={results} />
          </div>
        )}
      </CardContent>
      {testState === 'finished' && (
         <CardFooter className="flex justify-center gap-4 border-t pt-6">
            <Button onClick={saveResults}>
              <Save className="mr-2 h-4 w-4" /> Save Results
            </Button>
            <Button variant="outline" onClick={() => setTestState('idle')}>
              <RotateCcw className="mr-2 h-4 w-4" /> Test Again
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
