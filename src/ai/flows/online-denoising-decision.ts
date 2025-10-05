'use server';

/**
 * @fileOverview Determines if online denoising using `noisereduce` will improve audio quality.
 *
 * - `onlineDenoisingDecision` - A function that decides whether to use the online denoising service.
 * - `OnlineDenoisingDecisionInput` - The input type for the `onlineDenoisingDecision` function.
 * - `OnlineDenoisingDecisionOutput` - The return type for the `onlineDenoisingDecision` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OnlineDenoisingDecisionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio data URI to be denoised, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OnlineDenoisingDecisionInput = z.infer<typeof OnlineDenoisingDecisionInputSchema>;

const OnlineDenoisingDecisionOutputSchema = z.object({
  shouldDenoise: z
    .boolean()
    .describe(
      'Whether the audio quality can be improved by online denoising. If true, call the online denoising service; otherwise, skip it.'
    ),
  reason: z.string().optional().describe('The reason for the decision.'),
});
export type OnlineDenoisingDecisionOutput = z.infer<typeof OnlineDenoisingDecisionOutputSchema>;

export async function onlineDenoisingDecision(
  input: OnlineDenoisingDecisionInput
): Promise<OnlineDenoisingDecisionOutput> {
  return onlineDenoisingDecisionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'onlineDenoisingDecisionPrompt',
  input: {schema: OnlineDenoisingDecisionInputSchema},
  output: {schema: OnlineDenoisingDecisionOutputSchema},
  prompt: `You are an expert audio engineer. You are responsible for determining if an audio clip can be improved with noise reduction using an online service. The online service uses the noisereduce library.

  Analyze the following audio clip and decide if it is likely that the online denoising service can improve the audio quality.

  Audio: {{media url=audioDataUri}}

  Consider these factors:
  - Is there noticeable background noise?
  - Is the primary voice clear and present?
  - Would noise reduction likely improve clarity without distorting the voice?

  Respond with a JSON object indicating whether the online denoising service should be used, and the reason for your decision.
`,
});

const onlineDenoisingDecisionFlow = ai.defineFlow(
  {
    name: 'onlineDenoisingDecisionFlow',
    inputSchema: OnlineDenoisingDecisionInputSchema,
    outputSchema: OnlineDenoisingDecisionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
