# **App Name**: AudioClear

## Core Features:

- Hearing Test: Conduct a hearing test across a range of frequencies (125 Hz to 8 kHz) and record the lowest audible sound level.
- Local Result Saving: Store hearing test results locally, including timestamps and graphical visualization of audiogram data.
- Voice Recording: Record audio from the device’s microphone for voice denoising.
- On-Device Denoising: Apply noise reduction using a lightweight algorithm such as RNNoise or a TensorFlow Lite speech enhancement model directly on the device for minimal latency.
- Online Denoising Tool: Connect to a Python backend with FastAPI to perform noise reduction using the noisereduce library. The AI tool decides if noisereduce can enhance audio quality
- A/B Comparison: Play back original vs. denoised audio for comparison using a simple and intuitive UI.
- History Review: View a history of past hearing test results with visualizations, for trend analysis and tracking.

## Style Guidelines:

- Primary color: Light Blue (#ADD8E6) evoking clarity and auditory focus.
- Background color: Very light Blue (#F0F8FF), providing a clean, neutral backdrop.
- Accent color: Soft green (#90EE90) to highlight interactive elements and signal audio improvements.
- Body and headline font: 'Inter', a grotesque-style sans-serif, for a modern and objective feel.
- Use minimalist, clear icons representing hearing, sound waves, and audio controls.
- A clean, intuitive layout focusing on accessibility, with clear sections for hearing tests and noise reduction features.
- Subtle animations to indicate audio processing and test completion, enhancing user feedback without distraction.