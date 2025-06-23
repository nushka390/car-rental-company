import * as insuranceService from "../../src/insurance/insurance.service";

jest.mock("../../src/insurance/insurance.service");

const testInsurance = {
  insuranceID: 1000,
  carID: 1,
  insuranceProvider: "Test Provider",
  policyNumber: "POL123",
  startDate: "2025-01-01T00:00:00.000Z",
  endDate: "2026-01-01T00:00:00.000Z",
  premium: 500.0
};

describe("Insurance Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createInsurance", () => {
    it("should create new insurance", async () => {
      (insuranceService.createInsurance as jest.Mock).mockResolvedValue({
        ...testInsurance,
        insuranceID: 1
      });

      const result = await insuranceService.createInsurance(testInsurance);
      expect(result).toMatchObject({
        insuranceID: expect.any(Number),
        insuranceProvider: testInsurance.insuranceProvider,
        policyNumber: testInsurance.policyNumber
      });
    });

    it("should throw error when missing required fields", async () => {
      (insuranceService.createInsurance as jest.Mock).mockRejectedValue(
        new Error("Missing required fields: insurance")
      );

      await expect(insuranceService.createInsurance({} as any)).rejects.toThrow(
        "Missing required fields: insurance"
      );
    });
  });

  describe("getAllInsurance", () => {
    it("should return all insurance records", async () => {
      (insuranceService.getAllInsurance as jest.Mock).mockResolvedValue([testInsurance]);

      const result = await insuranceService.getAllInsurance();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("insuranceID");
    });
  });

  describe("getInsuranceById", () => {
    it("should return insurance by id", async () => {
      (insuranceService.getInsuranceById as jest.Mock).mockResolvedValue(testInsurance);

      const result = await insuranceService.getInsuranceById(1000);
      expect(result).toMatchObject({
        insuranceID: testInsurance.insuranceID,
        insuranceProvider: testInsurance.insuranceProvider
      });
    });

    it("should throw error when insurance not found", async () => {
      (insuranceService.getInsuranceById as jest.Mock).mockRejectedValue(new Error("Insurance not found"));

      await expect(insuranceService.getInsuranceById(9999)).rejects.toThrow("Insurance not found");
    });
  });

  describe("updateInsurance", () => {
    it("should update insurance details", async () => {
      const updatedInsurance = {
        ...testInsurance,
        insuranceProvider: "Updated Provider",
        premium: 600.0
      };

      (insuranceService.updateinsurance as jest.Mock).mockResolvedValue([updatedInsurance]);

      const result = await insuranceService.updateinsurance(1000, updatedInsurance);
      expect(result[0]).toMatchObject({
        insuranceProvider: "Updated Provider",
        premium: 600.0
      });
    });
  });

  describe("deleteCar", () => {
    it("should delete insurance by car ID", async () => {
      (insuranceService.deleteCar as jest.Mock).mockResolvedValue(true);

      const result = await insuranceService.deleteCar(testInsurance.carID);
      expect(result).toBe(true);
    });

    it("should throw error when insurance not found", async () => {
      (insuranceService.deleteCar as jest.Mock).mockRejectedValue(new Error("insurance not found"));

      await expect(insuranceService.deleteCar(9999)).rejects.toThrow("insurance not found");
    });
  });
});
