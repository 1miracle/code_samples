import requirementFactory from "spec/factories/project/colo/requirementFactory";
import spacePowerReqFactory from "spec/factories/project/colo/spacePowerReqFactory";

describe("totalRackValue", () => {
  describe("when rack_space_and_powers presents", () => {
    const associations = {
      rack_space_and_powers: [
        spacePowerReqFactory.build({ count: null }),
        spacePowerReqFactory.build({ count: "// some float number" }),
        spacePowerReqFactory.build({ count: "// some float number" })
      ]
    };
    const requirement = requirementFactory.build(null, { associations });

    it("returns the result of totalRackValue", () => {
      expect(requirement.totalRackValue()).toEqual(30);
    });
  });

  describe("when without rack_space_and_powers", () => {
    const params = [
      spacePowerReqFactory.build({
        id: undefined,
        count: undefined,
        size: "type_1",
        power: undefined,
        redundant_power: true,
        circuit_id: undefined,
        deep: false,
        wide: false,
        circuit_name: undefined,
        size_name: undefined
      })
    ];
    const requirement = requirementFactory.build({ rack_space_and_powers: params }, {});

    it("returns the result of totalRackValue", () => {
      expect(requirement.totalRackValue()).toEqual(0);
    });
  });
});

describe("totalReservedPowerValue", () => {
  describe("when rack_space_and_powers presents", () => {
    const associations = {
      rack_space_and_powers: [
        spacePowerReqFactory.build({ count: null, power: "// some float number" }),
        spacePowerReqFactory.build({ count: "// some float number", power: null }),
        spacePowerReqFactory.build({ count: "// some float number", power: "// some float number" })
      ]
    };
    const requirement = requirementFactory.build(null, { associations });

    it("returns the result of totalReservedPowerValue", () => {
      expect(requirement.totalReservedPowerValue()).toEqual(50);
    });
  });

  describe("when without rack_space_and_powers", () => {
    const params = [
      spacePowerReqFactory.build({
        id: undefined,
        count: undefined,
        size: "type_1",
        power: undefined,
        redundant_power: true,
        circuit_id: undefined,
        deep: false,
        wide: false,
        circuit_name: undefined,
        size_name: undefined
      })
    ];
    const requirement = requirementFactory.build({ rack_space_and_powers: params }, {});

    it("returns the result of totalRackValue", () => {
      expect(requirement.totalReservedPowerValue()).toEqual(0);
    });
  });
});

describe("interconnectsCount", () => {
  describe("when company_interconnections presents", () => {
    const associations = {
      company_interconnections: [
        { count: null },
        { count: 30 },
        { count: 10 }
      ]
    };
    const requirement = requirementFactory.build(null, { associations });

    it("returns the result of interconnectsCount", () => {
      expect(requirement.interconnectsCount()).toEqual(40);
    });
  });

  describe("when without company_interconnections", () => {
    const params = [{
      id: undefined,
      count: undefined,
      speed_medium: undefined,
      company_id: undefined,
      company_name: undefined,
      medium: undefined
    }];
    const requirement = requirementFactory.build({ company_interconnections: params }, {});

    it("returns the result of interconnectsCount", () => {
      expect(requirement.interconnectsCount()).toEqual(0);
    });
  });
});

describe("racksRedundantPower", () => {
  describe("when rack_space_and_powers presents", () => {
    const associations = {
      rack_space_and_powers: [
        spacePowerReqFactory.build({ count: null, redundant_power: false }),
        spacePowerReqFactory.build({ count: 30, redundant_power: true }),
        spacePowerReqFactory.build({ count: 20, redundant_power: true }),
        spacePowerReqFactory.build({ count: 10, redundant_power: false }),
        spacePowerReqFactory.build({ count: 10 })
      ]
    };
    const requirement = requirementFactory.build(null, { associations });

    it("returns the result of racksRedundantPower", () => {
      expect(requirement.racksRedundantPower()).toEqual(60);
    });
  });

  describe("when without rack_space_and_powers", () => {
    const params = [
      spacePowerReqFactory.build({
        id: undefined,
        count: undefined,
        size: "standard_42u",
        power: undefined,
        redundant_power: true,
        circuit_id: undefined,
        deep: false,
        wide: false,
        circuit_name: undefined,
        size_name: undefined
      })
    ];
    const requirement = requirementFactory.build({ rack_space_and_powers: params }, {});

    it("returns the result of racksRedundantPower", () => {
      expect(requirement.racksRedundantPower()).toEqual(0);
    });
  });
});

describe("isReqSizePowerInvalid", () => {
  const requirement = requirementFactory.build();

  describe("when type_2 is invalid", () => {
    const rack_space_and_power = spacePowerReqFactory.build({ size: "type_2", power: "// some float number" });

    it("returns the result", () => {
      expect(requirement.isReqSizePowerInvalid(rack_space_and_power)).toEqual(false);
    });
  });

  describe("when type_3 is valid", () => {
    const rack_space_and_power = spacePowerReqFactory.build({ size: "type_3", power: "// some float number" });

    it("returns the result", () => {
      expect(requirement.isReqSizePowerInvalid(rack_space_and_power)).toEqual(true);
    });
  });

  describe("when type_4 is invalid", () => {
    const rack_space_and_power = spacePowerReqFactory.build({ size: "type_4", power: "// some float number" });

    it("returns the result", () => {
      expect(requirement.isReqSizePowerInvalid(rack_space_and_power)).toEqual(false);
    });
  });

  describe("when type_5 is valid", () => {
    const rack_space_and_power = spacePowerReqFactory.build({ size: "type_5", power: "// some float number" });

    it("returns the result", () => {
      expect(requirement.isReqSizePowerInvalid(rack_space_and_power)).toEqual(true);
    });
  });

  describe("when type_6 is invalid", () => {
    const rack_space_and_power = spacePowerReqFactory.build({ size: "type_6", power: "// some float number" });

    it("returns the result", () => {
      expect(requirement.isReqSizePowerInvalid(rack_space_and_power)).toEqual(false);
    });
  });

  describe("when type_7 is valid", () => {
    const rack_space_and_power = spacePowerReqFactory.build({ size: "type_7", power: "// some float number" });

    it("returns the result", () => {
      expect(requirement.isReqSizePowerInvalid(rack_space_and_power)).toEqual(true);
    });
  });

  describe("when typ_8 is invalid", () => {
    const rack_space_and_power = spacePowerReqFactory.build({ size: "type_8", power: "// some float number" });

    it("returns the result", () => {
      expect(requirement.isReqSizePowerInvalid(rack_space_and_power)).toEqual(false);
    });
  });
});

describe("isSizePowerInvalid", () => {
  describe("when rack_space_and_powers presents", () => {
    const associations = {
      rack_space_and_powers: [
        spacePowerReqFactory.build({ size: "type_1", power: 19.4 }),
        spacePowerReqFactory.build({ size: "type_2", power: 7.6 }),
        spacePowerReqFactory.build({ size: "type_3", power: 5 }),
        spacePowerReqFactory.build({ size: "type_4", power: 2 }),
        spacePowerReqFactory.build({ size: "type_5", power: null })
      ]
    };
    const requirement = requirementFactory.build(null, { associations });

    it("returns the result of isSizePowerInvalid", () => {
      expect(requirement.isSizePowerInvalid()).toEqual(true);
    });
  });

  describe("when without rack_space_and_powers", () => {
    const requirement = requirementFactory.build();

    it("returns the result of isSizePowerInvalid", () => {
      expect(requirement.isSizePowerInvalid()).toEqual(false);
    });
  });
});

describe("isPartialRack", () => {
  describe("when whitelabel is single provider", () => {
    const associations = {
      rack_space_and_powers: [
        spacePowerReqFactory.build({ size: "type_1", power: 19.4 }),
        spacePowerReqFactory.build({ size: "type_2", power: 7.6 }),
        spacePowerReqFactory.build({ size: "type_3", power: 5 }),
        spacePowerReqFactory.build({ size: "type_4", power: 2 }),
        spacePowerReqFactory.build({ size: "type_5", power: null })
      ]
    };
    const requirement = requirementFactory.build(null, { associations });
    const whiteLabel = { single_provider: true };

    it("returns the result of isPartialRack", () => {
      expect(requirement.isPartialRack(whiteLabel)).toEqual(false);
    });
  });

  describe("when whitelabel is not single provider", () => {
    const associations = {
      rack_space_and_powers: [
        spacePowerReqFactory.build({ size: "type_1", power: 19.4 }),
        spacePowerReqFactory.build({ size: "type_2", power: 7.6 }),
        spacePowerReqFactory.build({ size: "type_3", power: 5 }),
        spacePowerReqFactory.build({ size: "type_4", power: 2 }),
        spacePowerReqFactory.build({ size: "type_5", power: null })
      ]
    };
    const requirement = requirementFactory.build(null, { associations });
    const whiteLabel = { single_provider: false };

    it("returns the result of isPartialRack", () => {
      expect(requirement.isPartialRack(whiteLabel)).toEqual(true);
    });
  });

  describe("when one random size and without whiteLabel", () => {
    const associations = {
      rack_space_and_powers: [
        spacePowerReqFactory.build({ size: "type_1", power: 19.4 }),
        spacePowerReqFactory.build({ size: "type_2", power: 7.6 }),
        spacePowerReqFactory.build({ size: "type_3", power: 5 }),
        spacePowerReqFactory.build({ size: "type_4", power: 2 }),
        spacePowerReqFactory.build({ size: "type_5", power: null }),
        spacePowerReqFactory.build({ size: "randomTestSize" })
      ]
    };
    const requirement = requirementFactory.build(null, { associations });

    it("returns the result of isPartialRack", () => {
      expect(requirement.isPartialRack()).toEqual(false);
    });
  });
});
