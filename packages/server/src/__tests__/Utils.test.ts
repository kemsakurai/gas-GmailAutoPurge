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
});
