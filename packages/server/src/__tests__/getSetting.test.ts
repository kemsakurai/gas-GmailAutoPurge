/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSetting } from "../getSetting";

// Mock SpreadsheetApp and console
const globalMock = global as any;

describe("getSetting", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks for each test
    const mockGetRange = jest.fn();
    const mockSheet = {
      getRange: mockGetRange,
      getLastColumn: jest.fn(() => 5),
    };

    const mockSpreadsheet = {
      getSheetByName: jest.fn(() => mockSheet),
    };

    globalMock.SpreadsheetApp = {
      getActiveSpreadsheet: jest.fn(() => mockSpreadsheet),
    };

    globalMock.console = {
      info: jest.fn(),
      log: jest.fn(),
    };
  });

  test("should return an object with correct properties", () => {
    const mockGetRange = jest.fn();
    const mockTitle = ["Notes", "label", "Retention period", "Leave starred email", "Leave important email"];
    const mockRow = ["Test notes", "TestLabel", 30, "TRUE", "FALSE"];

    const mockSheet = {
      getRange: mockGetRange,
      getLastColumn: jest.fn(() => 5),
    };

    const mockSpreadsheet = {
      getSheetByName: jest.fn(() => mockSheet),
    };

    globalMock.SpreadsheetApp = {
      getActiveSpreadsheet: jest.fn(() => mockSpreadsheet),
    };

    mockGetRange
      .mockReturnValueOnce({
        getValues: jest.fn(() => [mockTitle]),
      })
      .mockReturnValueOnce({
        getValues: jest.fn(() => [mockRow]),
      });

    const result = getSetting(0);

    expect(result).toEqual({
      rowId: 0,
      Notes: "Test notes",
      label: "TestLabel",
      "Retention period": 30,
      "Leave starred email": "TRUE",
      "Leave important email": "FALSE",
    });
  });

  test("should handle different rowIds correctly", () => {
    const mockGetRange = jest.fn();
    const mockTitle = ["Notes", "label", "Retention period", "Leave starred email", "Leave important email"];
    const mockRow = ["Archive emails", "Archive", 60, "FALSE", "TRUE"];

    const mockSheet = {
      getRange: mockGetRange,
      getLastColumn: jest.fn(() => 5),
    };

    const mockSpreadsheet = {
      getSheetByName: jest.fn(() => mockSheet),
    };

    globalMock.SpreadsheetApp = {
      getActiveSpreadsheet: jest.fn(() => mockSpreadsheet),
    };

    mockGetRange
      .mockReturnValueOnce({
        getValues: jest.fn(() => [mockTitle]),
      })
      .mockReturnValueOnce({
        getValues: jest.fn(() => [mockRow]),
      });

    const result = getSetting(2);

    expect(result).toEqual({
      rowId: 2,
      Notes: "Archive emails",
      label: "Archive",
      "Retention period": 60,
      "Leave starred email": "FALSE",
      "Leave important email": "TRUE",
    });
  });

  test("should handle empty sheet gracefully", () => {
    const mockSpreadsheet = {
      getSheetByName: jest.fn(() => null), // No sheet found
    };

    globalMock.SpreadsheetApp = {
      getActiveSpreadsheet: jest.fn(() => mockSpreadsheet),
    };

    const result = getSetting(0);
    expect(result).toEqual({});
  });

  test("should convert rowId correctly (0-based)", () => {
    const mockGetRange = jest.fn();
    const mockTitle = ["Notes", "label", "Retention period", "Leave starred email", "Leave important email"];
    const mockRow = ["Emails 1", "Label1", 10, "TRUE", "FALSE"];

    const mockSheet = {
      getRange: mockGetRange,
      getLastColumn: jest.fn(() => 5),
    };

    const mockSpreadsheet = {
      getSheetByName: jest.fn(() => mockSheet),
    };

    globalMock.SpreadsheetApp = {
      getActiveSpreadsheet: jest.fn(() => mockSpreadsheet),
    };

    mockGetRange
      .mockReturnValueOnce({
        getValues: jest.fn(() => [mockTitle]),
      })
      .mockReturnValueOnce({
        getValues: jest.fn(() => [mockRow]),
      });

    getSetting(1); // Should read row 2 (rowId + 1)

    expect(mockGetRange).toHaveBeenCalledWith(2, 1, 1, 5); // Row 2
  });

  test("should log info messages", () => {
    const mockGetRange = jest.fn();
    const mockTitle = ["Notes", "label", "Retention period", "Leave starred email", "Leave important email"];
    const mockRow = ["Test", "Label", 10, "TRUE", "FALSE"];

    const mockSheet = {
      getRange: mockGetRange,
      getLastColumn: jest.fn(() => 5),
    };

    const mockSpreadsheet = {
      getSheetByName: jest.fn(() => mockSheet),
    };

    globalMock.SpreadsheetApp = {
      getActiveSpreadsheet: jest.fn(() => mockSpreadsheet),
    };

    mockGetRange
      .mockReturnValueOnce({
        getValues: jest.fn(() => [mockTitle]),
      })
      .mockReturnValueOnce({
        getValues: jest.fn(() => [mockRow]),
      });

    getSetting(0);

    expect(globalMock.console.info).toHaveBeenCalledWith("getSetting start");
  });
});
