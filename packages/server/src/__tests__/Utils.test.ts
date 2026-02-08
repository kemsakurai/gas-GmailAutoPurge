/* eslint-disable @typescript-eslint/no-explicit-any */
import Utils from "../Utils";

describe("Utils", () => {
  describe("checkNotEmpty", () => {
    test("should not throw error for non-empty string", () => {
      expect(() => {
        Utils.checkNotEmpty("hello", "Value is required");
      }).not.toThrow();
    });

    test("should throw error for empty string", () => {
      expect(() => {
        Utils.checkNotEmpty("", "Value is required");
      }).toThrow("Value is required");
    });

    test("should throw error for undefined", () => {
      expect(() => {
        Utils.checkNotEmpty(undefined as any, "Value is required");
      }).toThrow("Value is required");
    });

    test("should throw error with correct message", () => {
      const errorMessage = "Name must not be empty";
      expect(() => {
        Utils.checkNotEmpty("", errorMessage);
      }).toThrow(errorMessage);
    });
  });

  describe("getConfigSheetName", () => {
    test("should return 'Config'", () => {
      expect(Utils.getConfigSheetName()).toBe("Config");
    });

    test("should always return the same value", () => {
      const name1 = Utils.getConfigSheetName();
      const name2 = Utils.getConfigSheetName();
      expect(name1).toBe(name2);
    });
  });

  describe("convertCellValue2Boolean", () => {
    test("should return true for 'TRUE'", () => {
      expect(Utils.convertCellValue2Boolean("TRUE")).toBe(true);
    });

    test("should return true for 'true' (lowercase)", () => {
      expect(Utils.convertCellValue2Boolean("true")).toBe(true);
    });

    test("should return true for 'True' (mixed case)", () => {
      expect(Utils.convertCellValue2Boolean("True")).toBe(true);
    });

    test("should return true for '1'", () => {
      expect(Utils.convertCellValue2Boolean("1")).toBe(true);
    });

    test("should return false for '0'", () => {
      expect(Utils.convertCellValue2Boolean("0")).toBe(false);
    });

    test("should return false for 'FALSE'", () => {
      expect(Utils.convertCellValue2Boolean("FALSE")).toBe(false);
    });

    test("should return false for 'false' (lowercase)", () => {
      expect(Utils.convertCellValue2Boolean("false")).toBe(false);
    });

    test("should return false for empty string", () => {
      expect(Utils.convertCellValue2Boolean("")).toBe(false);
    });

    test("should return false for arbitrary string", () => {
      expect(Utils.convertCellValue2Boolean("hello")).toBe(false);
    });

    test("should return false for undefined", () => {
      expect(Utils.convertCellValue2Boolean(undefined as any)).toBe(false);
    });

    test("should return true for boolean true", () => {
      expect(Utils.convertCellValue2Boolean(true as any)).toBe(true);
    });

    test("should return false for boolean false", () => {
      expect(Utils.convertCellValue2Boolean(false as any)).toBe(false);
    });

    test("should be case-insensitive for TRUE", () => {
      expect(Utils.convertCellValue2Boolean("TrUe")).toBe(true);
      expect(Utils.convertCellValue2Boolean("tRUE")).toBe(true);
    });

    test("should handle whitespace in strings", () => {
      expect(Utils.convertCellValue2Boolean(" TRUE ")).toBe(false); // Not trimmed
      expect(Utils.convertCellValue2Boolean("TRUE ")).toBe(false); // Not trimmed
      expect(Utils.convertCellValue2Boolean(" TRUE")).toBe(false); // Not trimmed
    });
  });

  describe("MAX_BATCH_SIZE", () => {
    test("should be defined as constant", () => {
      expect(Utils.MAX_BATCH_SIZE).toBeDefined();
    });

    test("should be 10", () => {
      expect(Utils.MAX_BATCH_SIZE).toBe(10);
    });

    test("should be a number", () => {
      expect(typeof Utils.MAX_BATCH_SIZE).toBe("number");
    });
  });

  describe("Checkpoint management (requires GAS environment)", () => {
    test("should have getLastProcessedRowIndex method", () => {
      expect(typeof Utils.getLastProcessedRowIndex).toBe("function");
    });

    test("should have updateLastProcessedRowIndex method", () => {
      expect(typeof Utils.updateLastProcessedRowIndex).toBe("function");
    });

    test("should have resetCheckpoint method", () => {
      expect(typeof Utils.resetCheckpoint).toBe("function");
    });

    // Note: Actual Properties Service testing requires GAS environment
    // These methods will be tested during actual GAS execution
  });

  describe("buildGmailSearchQuery", () => {
    test("should build basic query with label and date", () => {
      const query = Utils.buildGmailSearchQuery("Inbox", "2024-01-01", false, false);
      expect(query).toBe("label:Inbox before:2024-01-01");
    });

    test("should add -is:starred when leaveStarredEmail is true", () => {
      const query = Utils.buildGmailSearchQuery("Inbox", "2024-01-01", true, false);
      expect(query).toBe("label:Inbox before:2024-01-01 -is:starred");
    });

    test("should add -is:important when leaveImportantEmail is true", () => {
      const query = Utils.buildGmailSearchQuery("Inbox", "2024-01-01", false, true);
      expect(query).toBe("label:Inbox before:2024-01-01 -is:important");
    });

    test("should add both -is:starred and -is:important when both are true", () => {
      const query = Utils.buildGmailSearchQuery("Inbox", "2024-01-01", true, true);
      expect(query).toBe("label:Inbox before:2024-01-01 -is:starred -is:important");
    });

    test("should handle different label names", () => {
      const query = Utils.buildGmailSearchQuery("Archive", "2023-12-31", false, false);
      expect(query).toBe("label:Archive before:2023-12-31");
    });

    test("should handle labels with special characters", () => {
      const query = Utils.buildGmailSearchQuery("Work/2024", "2024-01-15", false, false);
      expect(query).toBe("label:Work/2024 before:2024-01-15");
    });

    test("should maintain correct order of filters", () => {
      const query = Utils.buildGmailSearchQuery("Inbox", "2024-01-01", true, true);
      // Verify order: base query, then -is:starred, then -is:important
      const parts = query.split(" ");
      expect(parts[0]).toBe("label:Inbox");
      expect(parts[1]).toBe("before:2024-01-01");
      expect(parts[2]).toBe("-is:starred");
      expect(parts[3]).toBe("-is:important");
    });

    test("should handle date format correctly", () => {
      const query = Utils.buildGmailSearchQuery("Inbox", "2023-06-15", false, false);
      expect(query).toContain("before:2023-06-15");
    });

    test("should not include extra spaces", () => {
      const query = Utils.buildGmailSearchQuery("Inbox", "2024-01-01", false, false);
      expect(query).not.toMatch(/  +/); // No double spaces
    });

    test("should handle empty label gracefully", () => {
      const query = Utils.buildGmailSearchQuery("", "2024-01-01", false, false);
      expect(query).toBe("label: before:2024-01-01");
    });

    test("should create consistent query for same inputs", () => {
      const query1 = Utils.buildGmailSearchQuery("Inbox", "2024-01-01", true, true);
      const query2 = Utils.buildGmailSearchQuery("Inbox", "2024-01-01", true, true);
      expect(query1).toBe(query2);
    });
  });
});
