"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { onlineDenoisingDecision, OnlineDenoisingDecisionOutput } from '@/ai/flows/online-denoising-decision';
import { Mic, Square, Loader2, Sparkles, RotateCcw } from 'lucide-react';

type DenoiseState = 'idle' | 'recording' | 'processing' | 'denoised';

export function VoiceDenoising() {
  const [denoiseState, setDenoiseState] = useState<DenoiseState>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [denoisedAudioBlob, setDenoisedAudioBlob] = useState<Blob | null>(null);
  const [decision, setDecision] = useState<OnlineDenoisingDecisionOutput | null>(null);
  const [timer, setTimer] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setDenoiseState('processing');
        processAudio(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setDenoiseState('recording');
      setTimer(0);
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({ variant: 'destructive', title: 'Recording failed', description: 'Could not access microphone. Please grant permission.' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && denoiseState === 'recording') {
      mediaRecorderRef.current.stop();
      if(timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const processAudio = async (blob: Blob) => {
    toast({ title: "Processing audio...", description: "Analyzing for noise reduction." });
    try {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            // Simulate on-device processing delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const aiDecision = await onlineDenoisingDecision({ audioDataUri: base64Audio });
            setDecision(aiDecision);

            if (aiDecision.shouldDenoise) {
                toast({ title: "Online Denoising Applied", description: "AI recommended and applied noise reduction." });
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate online processing
                setDenoisedAudioBlob(blob); // In real app, this would be the processed blob
            } else {
                 toast({ title: "Online Denoising Skipped", description: aiDecision.reason });
                 setDenoisedAudioBlob(blob);
            }
            setDenoiseState('denoised');
        };
    } catch(error) {
        console.error("AI decision failed:", error);
        toast({ variant: "destructive", title: "AI analysis failed", description: "Defaulting to original audio." });
        setDenoisedAudioBlob(blob);
        setDenoiseState('denoised');
    }
  };

  const reset = () => {
    setDenoiseState('idle');
    setAudioBlob(null);
    setDenoisedAudioBlob(null);
    setDecision(null);
    setTimer(0);
  };
  
  useEffect(() => {
    return () => {
      if(timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  }, []);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>AI Voice Denoising</CardTitle>
        <CardDescription>Record your voice, and our AI will decide if noise reduction can improve it.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6 min-h-[300px]">
        {denoiseState === 'idle' && (
          <Button size="lg" onClick={startRecording}>
            <Mic className="mr-2 h-5 w-5" /> Start Recording
          </Button>
        )}
        {denoiseState === 'recording' && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-lg font-medium text-muted-foreground">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Recording... {new Date(timer * 1000).toISOString().slice(14, 19)}
            </div>
            <Button size="lg" variant="destructive" onClick={stopRecording}>
              <Square className="mr-2 h-5 w-5" /> Stop Recording
            </Button>
          </div>
        )}
        {denoiseState === 'processing' && (
            <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium">AI is analyzing your audio...</p>
                <p className="text-muted-foreground">This may take a moment.</p>
            </div>
        )}
        {denoiseState === 'denoised' && audioBlob && (
          <div className="w-full space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-muted-foreground">Original</h3>
              <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
            </div>
            <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-primary"><Sparkles className="h-5 w-5" /> Denoised Version</h3>
                {decision && (
                    <p className="text-sm text-muted-foreground italic">AI decision: "{decision.reason}"</p>
                )}
                <audio src={URL.createObjectURL(denoisedAudioBlob || audioBlob)} controls className="w-full" />
            </div>
            <div className="text-center pt-4">
                <Button onClick={reset} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" /> Record Another
                </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
