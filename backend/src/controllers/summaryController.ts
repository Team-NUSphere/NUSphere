import { LangflowClient } from "@datastax/langflow-client";
import { NextFunction, Request, Response } from "express"; 

const langflowId = "1315d082-bbb5-4f2e-a74f-1afa324ac7c8";
const flowId = "712494cc-3d04-40d3-bc30-547233bff6eb";
const apiKey = process.env.LANGFLOW_API_KEY;

const client = new LangflowClient({ langflowId, apiKey });
const flow = client.flow(flowId);

export const handleRunSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("handleRunSummary called");
  try {
    const { input } = req.body;
    console.log("Running summary flow with input in controller:", input);
    const result = await flow.run(input);
    const text = result.chatOutputText();
    if (!text) {
      throw new Error("No output text returned from Langflow response.");
    }
    res.json( text );
  } catch (error) {
    next(error);
  }
};
