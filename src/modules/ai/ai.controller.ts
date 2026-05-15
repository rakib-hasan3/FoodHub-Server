import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AIService } from "./ai.service";

const chat = catchAsync(async (req: Request, res: Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      success: false,
      message: "Messages array is required",
    });
  }
  const result = await AIService.chat(messages);

  // Try the helper method first, fall back to manual streaming
  if (typeof result.pipeDataStreamToResponse === 'function') {
    result.pipeDataStreamToResponse(res);
  } else {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Vercel-AI-Stream', 'true');
    for await (const textPart of result.textStream) {
      res.write(`0:${JSON.stringify(textPart)}\n`);
    }
    res.end();
  }
});

export const AIController = {
  chat,
};