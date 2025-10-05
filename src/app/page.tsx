import Header from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HearingTest } from "@/components/hearing-test"
import { VoiceDenoising } from "@/components/voice-denoising"
import { Ear, Mic } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Tabs defaultValue="hearing-test" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hearing-test" className="text-base py-2">
              <Ear className="mr-2 h-5 w-5" />
              Hearing Test
            </TabsTrigger>
            <TabsTrigger value="voice-denoise" className="text-base py-2">
              <Mic className="mr-2 h-5 w-5" />
              Voice Denoise
            </TabsTrigger>
          </TabsList>
          <TabsContent value="hearing-test" className="mt-6">
            <HearingTest />
          </TabsContent>
          <TabsContent value="voice-denoise" className="mt-6">
            <VoiceDenoising />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
