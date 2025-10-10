import { useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { blobToBase64 } from '../utils/audioUtils';

interface UseGeminiRecapProps {
  onRecapUpdate: (chunk: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGeminiRecap = ({
  onRecapUpdate,
  setIsLoading,
  setError,
}: UseGeminiRecapProps) => {
  const generateRecap = useCallback(async (audioBlob: Blob | null) => {
    if (!audioBlob) {
      setError('No audio data provided for recap.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const base64Data = await blobToBase64(audioBlob);
      const audioPart = {
        inlineData: { data: base64Data, mimeType: audioBlob.type || 'audio/webm' },
      };

      const promptPart = {
        text: `
**Role:**
You are a professional **PMO/Meeting Analyst** with extensive experience in taking minutes and summarizing multilingual meetings. You are proficient in speech-to-text, speaker diarization, and extracting decisions and actionable items.

**Objective:**
Create a clear, accurate, and actionable **Meeting Recap** in English, within **1–2 pages (~800–1200 words)**, ensuring:
*   100% of **decisions** and **agreed-upon tasks** are captured.
*   **Action Items** include: *Task, Owner, Deadline (YYYY-MM-DD), Priority, Dependency, and Source Timestamp*.
*   The executive summary allows absentees to grasp the key points in **≤ 60 seconds**.

**Context:**
The input is a **meeting audio file** (language can be Vietnamese, English, or mixed). It may involve multiple speakers and varying audio quality. The recap is for the project team and leadership; it must be neutral, confidential, and must not infer beyond what is heard. The output language should be English.

**Step-by-Step Instructions:**
1.  **Transcribe & Diarize:** Mentally process the audio into text with **timestamps** for each utterance and **identify speakers** (Speaker A, Speaker B, or by name if clearly stated). Mark difficult sections as **[inaudible mm:ss]** or **[unclear mm:ss]**.
2.  **Identify Structure:** Infer the meeting's **Agenda** if not explicitly stated. List **Participants & their roles** if mentioned.
3.  **Extract Decisions:** Isolate all finalized decisions. For each, note the decision, who agreed (if specified), and the source **timestamp**.
4.  **Extract Action Items:** Identify all committed tasks. For each task, extract the **Task description, Owner, Deadline (YYYY-MM-DD), Priority (High/Medium/Low), Dependencies, any relevant Notes, and the source Timestamp (mm:ss)**. If an Owner or Deadline is not mentioned, use **[TBD]**.
5.  **Identify Risks & Issues:** Document any mentioned risks, issues, or blockers, along with any proposed mitigation strategies.
6.  **Draft Executive Summary:** Write a concise summary (5-8 bullet points or a short paragraph, under 120 words) covering the meeting's context, 3-5 key conclusions, and the top 3 priority actions.
7.  **Assemble the Recap:** Populate the HTML template below using the extracted information. Ensure all content is neutral, concise, and directly from the audio. Do not add your own opinions or speculate.

**Output Format:**
You MUST generate the output as a single HTML block. Strictly adhere to the HTML structure, titles, and formatting provided below. Do NOT include any Markdown code block delimiters like \`\`\`html or \`\`\` in the output. Use the information extracted from the audio according to the instructions above to fill in the corresponding sections of this HTML template.

---
<h2><strong>Project Progress Meeting Recap – [Use current date in YYYY-MM-DD format]</strong></h2>
<p>&nbsp;</p>
<h3><strong>Executive Summary</strong></h3>
<p><em>(Write the concise summary here, as per instruction #6. It should help a reader understand the key outcomes in under 60 seconds.)</em></p>
<p>&nbsp;</p>
<h3><strong>Decisions / Agreements</strong></h3>
<ul>
    <li><em>(List the key decisions or agreements finalized during the meeting. Use '•' bullet points. Example: "Finalized Option A for landing page, A/B test to start 2025-09-22 (02:14).")</em></li>
</ul>
<p>&nbsp;</p>
<h3><strong>Action Items</strong></h3>
<table>
    <thead>
        <tr>
            <th>Task</th>
            <th>Owner</th>
            <th>Deadline (YYYY-MM-DD)</th>
            <th>Priority</th>
            <th>Dependency</th>
            <th>Notes</th>
            <th>Source (mm:ss)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><em>(Task Name 1)</em></td>
            <td><em>(Owner 1 or [TBD])</em></td>
            <td><em>(Deadline 1 or [TBD])</em></td>
            <td><em>(Priority 1)</em></td>
            <td><em>(Dependency 1)</em></td>
            <td><em>(Notes 1)</em></td>
            <td><em>(Source Timestamp 1)</em></td>
        </tr>
        <tr>
            <td><em>(Task Name 2)</em></td>
            <td><em>(Owner 2 or [TBD])</em></td>
            <td><em>(Deadline 2 or [TBD])</em></td>
            <td><em>(Priority 2)</em></td>
            <td><em>(Dependency 2)</em></td>
            <td><em>(Notes 2)</em></td>
            <td><em>(Source Timestamp 2)</em></td>
        </tr>
    </tbody>
</table>
<p>&nbsp;</p>
<h3><strong>Risks &amp; Issues</strong></h3>
<ul>
    <li><strong>Issue 1:</strong> <em>(Issue Name 1)</em>
        <ul>
            <li><strong>Impact:</strong> <em>(Describe the impact of the risk/issue on the project.)</em></li>
            <li><strong>Resolution:</strong> <em>(State the proposed resolution steps or next actions.)</em></li>
        </ul>
    </li>
</ul>
<p>&nbsp;</p>
<h3><strong>Next Meeting</strong></h3>
<p><em>Time: (YYYY-MM-DD) at (HH:MM) or [TBD]</em></p>
<p><em>Proposed Agenda: (List the proposed agenda items.)</em></p>
<p>&nbsp;</p>
<h3><strong>Appendix (Attendees)</strong></h3>
<p><em>(List the names and roles of the meeting attendees if identified.)</em></p>
---

**MANDATORY CONSTRAINTS:**
1.  **Language:** The final output content MUST be 100% professional, clear, and coherent **English**.
2.  **Formatting:** Strictly adhere to the HTML structure, titles, and formatting provided below. Do NOT add, remove, or change titles.
3.  **Accuracy & Neutrality:** Only record information present in the meeting. Use **'[TBD]'** or **'[Not mentioned]'** for missing information. Do not speculate.
4.  **Confidentiality:** Do not insert any external data or information not present in the audio.
5.  **Length:** Keep the entire recap concise (under 1200 words) and the Executive Summary under 120 words.

Below is the audio recording of the meeting:`
      };

      const contents = { parts: [promptPart, audioPart] };

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: contents,
      });

      for await (const chunk of responseStream) {
        onRecapUpdate(chunk.text);
      }

    } catch (err) {
      console.error('Error generating recap from audio:', err);
      setError('An error occurred during recap generation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [onRecapUpdate, setIsLoading, setError]);

  return { generateRecap };
};