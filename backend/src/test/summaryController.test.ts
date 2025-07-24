/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGenerateContent } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
}));

import { handleRunSummary } from "../controllers/summaryController.js";

const createMockReq = (body?: any) =>
  ({
    body: body ?? {},
  }) as any;

const createMockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const next = vi.fn();

describe("Summary Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-api-key";
  });

  describe("handleRunSummary", () => {
    it("should generate summary successfully with valid input", async () => {
      const req = createMockReq({
        input: "Test forum posts about CS1010 module",
      });
      const res = createMockRes();

      const mockSummary = `
        Grading Scheme: Final exam 50%, assignments 30%, participation 20%
        Lecturer: Prof Smith is engaging and explains concepts clearly
        Workload & Difficulty: Moderate workload with weekly assignments
        Tips to Do Well: Attend tutorials and practice past year papers
        Bell Curve: Generally lenient grading curve
      `;

      mockGenerateContent.mockResolvedValue({
        text: mockSummary,
      });

      await handleRunSummary(req, res, next);

      expect(mockGenerateContent).toHaveBeenCalledWith({
        contents: expect.stringContaining(
          "Test forum posts about CS1010 module",
        ),
        model: "gemini-2.5-flash",
      });
      expect(res.json).toHaveBeenCalledWith(mockSummary);
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle academic module related input correctly", async () => {
      const req = createMockReq({
        input: "Students discussing CS2030 programming methodology",
      });
      const res = createMockRes();

      mockGenerateContent.mockResolvedValue({
        text: "Academic module summary generated",
      });

      await handleRunSummary(req, res, next);

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.contents).toContain(
        "imagine you are an expert on NUS modules",
      );
      expect(callArgs.contents).toContain("Grading Scheme:");
      expect(callArgs.contents).toContain("Lecturer:");
      expect(callArgs.contents).toContain("Workload & Difficulty:");
      expect(callArgs.contents).toContain("Tips to Do Well:");
      expect(callArgs.contents).toContain("Bell Curve:");
    });

    it("should handle non-academic input correctly", async () => {
      const req = createMockReq({
        input: "General discussion about campus food",
      });
      const res = createMockRes();

      mockGenerateContent.mockResolvedValue({
        text: "Brief summary of campus food discussion in 4-5 sentences.",
      });

      await handleRunSummary(req, res, next);

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.contents).toContain(
        "just give a brief summary in 4-5 sentences",
      );
      expect(res.json).toHaveBeenCalledWith(
        "Brief summary of campus food discussion in 4-5 sentences.",
      );
    });

    it("should handle insufficient information response", async () => {
      const req = createMockReq({
        input: "Very limited information about some module",
      });
      const res = createMockRes();

      mockGenerateContent.mockResolvedValue({
        text: "Not enough information to summarise.",
      });

      await handleRunSummary(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        "Not enough information to summarise.",
      );
    });

    it("should handle missing input in request body", async () => {
      const req = createMockReq({});
      const res = createMockRes();

      mockGenerateContent.mockResolvedValue({
        text: "Summary with undefined input",
      });

      await handleRunSummary(req, res, next);

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.contents).toContain("undefined");
    });

    it("should handle empty string input", async () => {
      const req = createMockReq({
        input: "",
      });
      const res = createMockRes();

      mockGenerateContent.mockResolvedValue({
        text: "Not enough information to summarise.",
      });

      await handleRunSummary(req, res, next);

      expect(mockGenerateContent).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        "Not enough information to summarise.",
      );
    });

    it("should throw error when Gemini returns no text", async () => {
      const req = createMockReq({
        input: "Test input",
      });
      const res = createMockRes();

      mockGenerateContent.mockResolvedValue({
        text: null,
      });

      await handleRunSummary(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "No output text returned from Gemini response.",
        }),
      );
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should throw error when Gemini returns undefined text", async () => {
      const req = createMockReq({
        input: "Test input",
      });
      const res = createMockRes();

      mockGenerateContent.mockResolvedValue({
        text: undefined,
      });

      await handleRunSummary(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "No output text returned from Gemini response.",
        }),
      );
    });

    it("should handle Gemini API errors", async () => {
      const req = createMockReq({
        input: "Test input",
      });
      const res = createMockRes();

      const apiError = new Error("Gemini API failed");
      mockGenerateContent.mockRejectedValue(apiError);

      await handleRunSummary(req, res, next);

      expect(next).toHaveBeenCalledWith(apiError);
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle network timeout errors", async () => {
      const req = createMockReq({
        input: "Test input",
      });
      const res = createMockRes();

      const timeoutError = new Error("Request timeout");
      mockGenerateContent.mockRejectedValue(timeoutError);

      await handleRunSummary(req, res, next);

      expect(next).toHaveBeenCalledWith(timeoutError);
    });

    it("should use correct Gemini model", async () => {
      const req = createMockReq({
        input: "Test input",
      });
      const res = createMockRes();

      mockGenerateContent.mockResolvedValue({
        text: "Test response",
      });

      await handleRunSummary(req, res, next);

      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gemini-2.5-flash",
        }),
      );
    });

    it("should include structured format in prompt for academic content", async () => {
      const req = createMockReq({
        input: "CS3230 Design and Analysis of Algorithms discussion",
      });
      const res = createMockRes();

      mockGenerateContent.mockResolvedValue({
        text: "Structured academic summary",
      });

      await handleRunSummary(req, res, next);

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.contents).toContain("Use the following format");
      expect(callArgs.contents).toContain(
        "avoid repetition or vague statements",
      );
    });

    it("should handle very long input text", async () => {
      const longInput = "A".repeat(10000) + " module discussion";
      const req = createMockReq({
        input: longInput,
      });
      const res = createMockRes();

      mockGenerateContent.mockResolvedValue({
        text: "Summary of long input",
      });

      await handleRunSummary(req, res, next);

      expect(mockGenerateContent).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith("Summary of long input");
    });

    it("should handle special characters in input", async () => {
      const req = createMockReq({
        input: "Module discussion with special chars: @#$%^&*()[]{}|;:,.<>?",
      });
      const res = createMockRes();

      mockGenerateContent.mockResolvedValue({
        text: "Summary with special characters handled",
      });

      await handleRunSummary(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        "Summary with special characters handled",
      );
    });

    it("should log input for debugging", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const req = createMockReq({
        input: "Test logging input",
      });
      const res = createMockRes();

      mockGenerateContent.mockResolvedValue({
        text: "Test response",
      });

      await handleRunSummary(req, res, next);

      expect(consoleSpy).toHaveBeenCalledWith("handleRunSummary called");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Running summary with input:",
        "Test logging input",
      );

      consoleSpy.mockRestore();
    });

    it("should log errors for debugging", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const req = createMockReq({
        input: "Test input",
      });
      const res = createMockRes();

      const error = new Error("Test error");
      mockGenerateContent.mockRejectedValue(error);

      await handleRunSummary(req, res, next);

      expect(consoleErrorSpy).toHaveBeenCalledWith("Gemini API error:", error);

      consoleErrorSpy.mockRestore();
    });
  });
});
