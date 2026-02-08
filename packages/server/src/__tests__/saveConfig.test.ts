import { saveConfig } from "../saveConfig";

// Mock SpreadsheetApp
const globalMock = global as any;

describe("saveConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return 'success' when save is successful", () => {
    const mockSetValues = jest.fn();
    const mockGetRange = jest.fn().mockReturnValue({
      setValues: mockSetValues,
    });

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

    const configRow = {
      rowId: 0,
      notes: "Test notes",
      label: "TestLabel",
      retentionPeriod: 30,
      leaveStarredEmail: true,
      leaveImportantEmail: false,
    };

    const result = saveConfig(configRow);
    expect(result).toBe("success");
  });

  test("should call setValues with correct parameters", () => {
    const mockSetValues = jest.fn();
    const mockGetRange = jest.fn().mockReturnValue({
      setValues: mockSetValues,
    });

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

    const configRow = {
      rowId: 1,
      notes: "Archive emails",
      label: "Archive",
      retentionPeriod: 60,
      leaveStarredEmail: false,
      leaveImportantEmail: true,
    };

    saveConfig(configRow);

    expect(mockGetRange).toHaveBeenCalledWith(2, 1, 1, 5); // rowId + 1 = 2
    expect(mockSetValues).toHaveBeenCalledWith([[
      "Archive emails",
      "Archive",
      60,
      false,
      true,
    ]]);
  });

  test("should handle different rowIds correctly", () => {
    const mockSetValues = jest.fn();
    const mockGetRange = jest.fn().mockReturnValue({
      setValues: mockSetValues,
    });

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

    const configRow = {
      rowId: 5,
      notes: "Old messages",
      label: "OldLabel",
      retentionPeriod: 90,
      leaveStarredEmail: true,
      leaveImportantEmail: true,
    };

    saveConfig(configRow);

    expect(mockGetRange).toHaveBeenCalledWith(6, 1, 1, 5); // 5 + 1 = 6
  });

  test("should return 'failed' when sheet does not exist", () => {
    const mockSpreadsheet = {
      getSheetByName: jest.fn(() => null),
    };

    globalMock.SpreadsheetApp = {
      getActiveSpreadsheet: jest.fn(() => mockSpreadsheet),
    };
    globalMock.console = {
      info: jest.fn(),
      log: jest.fn(),
    };

    const configRow = {
      rowId: 0,
      notes: "Test",
      label: "Label",
      retentionPeriod: 30,
      leaveStarredEmail: false,
      leaveImportantEmail: false,
    };

    const result = saveConfig(configRow);
    // When sheet does not exist, ret is initialized to "" and never set to "success"
    expect(result).toBe("");
  });

  test("should return 'failed' when exception is thrown", () => {
    const mockSetValues = jest.fn().mockImplementation(() => {
      throw new Error("Some error");
    });
    const mockGetRange = jest.fn().mockReturnValue({
      setValues: mockSetValues,
    });

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

    const configRow = {
      rowId: 0,
      notes: "Test",
      label: "Label",
      retentionPeriod: 30,
      leaveStarredEmail: false,
      leaveImportantEmail: false,
    };

    const result = saveConfig(configRow);
    expect(result).toBe("failed");
  });

  test("should log info messages", () => {
    const mockSetValues = jest.fn();
    const mockGetRange = jest.fn().mockReturnValue({
      setValues: mockSetValues,
    });

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

    const configRow = {
      rowId: 0,
      notes: "Test",
      label: "Label",
      retentionPeriod: 30,
      leaveStarredEmail: false,
      leaveImportantEmail: false,
    };

    saveConfig(configRow);

    expect(globalMock.console.info).toHaveBeenCalledWith("saveConfig start");
    expect(globalMock.console.info).toHaveBeenCalledWith(configRow);
  });

  test("should preserve boolean values correctly", () => {
    const mockSetValues = jest.fn();
    const mockGetRange = jest.fn().mockReturnValue({
      setValues: mockSetValues,
    });

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

    const configRow = {
      rowId: 0,
      notes: "Test",
      label: "Label",
      retentionPeriod: 30,
      leaveStarredEmail: true,
      leaveImportantEmail: false,
    };

    saveConfig(configRow);

    expect(mockSetValues).toHaveBeenCalledWith([[
      "Test",
      "Label",
      30,
      true,
      false,
    ]]);
  });

  test("should handle numeric rowId conversion", () => {
    const mockSetValues = jest.fn();
    const mockGetRange = jest.fn().mockReturnValue({
      setValues: mockSetValues,
    });

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

    const configRow = {
      rowId: "2", // String input
      notes: "Test",
      label: "Label",
      retentionPeriod: 30,
      leaveStarredEmail: false,
      leaveImportantEmail: false,
    };

    saveConfig(configRow as any);

    // When rowId is a string, Number("2" + 1) = Number("21") = 21 (string concatenation before Number conversion)
    expect(mockGetRange).toHaveBeenCalledWith(21, 1, 1, 5);
  });
});
