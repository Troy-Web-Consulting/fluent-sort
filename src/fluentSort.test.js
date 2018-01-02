const fluentSort = require("./fluentSort");

function getTests() {
  return [
    {
      id: 0,
      name: "Strong Monster",
      strength: 10,
      agility: 5,
      intelligence: 8,
      monsterdexOrder: 5
    },
    {
      id: 1,
      name: "Fast Monster",
      strength: 5,
      agility: 10,
      intelligence: 5,
      monsterdexOrder: 1
    },
    {
      id: 2,
      name: "Mediocre Monster",
      strength: 7.5,
      agility: 7.5,
      intelligence: 8,
      monsterdexOrder: 6
    },
    {
      id: 3,
      name: "Unimpressive Monster",
      strength: 2,
      agility: 2,
      intelligence: 2,
      monsterdexOrder: 4
    },
    {
      id: 4,
      name: "Slow Monster",
      strength: 7.5,
      agility: 3,
      intelligence: 8,
      monsterdexOrder: 17
    },
    {
      id: 5,
      name: "Smart Monster",
      strength: 3,
      agility: 7.5,
      intelligence: 15,
      monsterdexOrder: 75
    }
  ];
}

describe("basic tests", () => {
  test("sorting by id results in the correct order", () => {
    const tests = getTests();
    const sortedTests = fluentSort(tests)
      .sortBy((left, right) => {
        if (left.id < right.id) return -1;
        if (left.id > right.id) return 1;

        return 0;
      })
      .result();

    expect(sortedTests[0].name).toBe("Strong Monster");
    expect(sortedTests[1].name).toBe("Fast Monster");
    expect(sortedTests[2].name).toBe("Mediocre Monster");
    expect(sortedTests[3].name).toBe("Unimpressive Monster");
    expect(sortedTests[4].name).toBe("Slow Monster");
    expect(sortedTests[5].name).toBe("Smart Monster");
  });

  test("sorting by id manually by descending results in the correct order", () => {
    const tests = getTests();
    const sortedTests = fluentSort(tests)
      .sortBy((left, right) => {
        if (left.id > right.id) return -1;
        if (left.id < right.id) return 1;

        return 0;
      })
      .result();

    expect(sortedTests[5].name).toBe("Strong Monster");
    expect(sortedTests[4].name).toBe("Fast Monster");
    expect(sortedTests[3].name).toBe("Mediocre Monster");
    expect(sortedTests[2].name).toBe("Unimpressive Monster");
    expect(sortedTests[1].name).toBe("Slow Monster");
    expect(sortedTests[0].name).toBe("Smart Monster");
  });

  test("sorting by 1 field sets comparator pool to length of 1", () => {
    const tests = getTests();
    const sortedTests = fluentSort(tests).sortBy((left, right) => {
      if (left.id > right.id) return -1;
      if (left.id < right.id) return 1;

      return 0;
    });

    expect(sortedTests.sortComparators).toHaveLength(1);
  });

  test("sorting by 1 field gives same order as native sort (by monsterdexOrder)", () => {
    const comparator = (left, right) => {
      if (left.monsterdexOrder < right.monsterdexOrder) return -1;
      if (left.monsterdexOrder > right.monsterdexOrder) return 1;

      return 0;
    };

    const fluentTestCases = getTests();
    const nativeTestCases = getTests();

    const fluentResults = fluentSort(fluentTestCases)
      .sortBy(comparator)
      .result();

    nativeTestCases.sort(comparator);

    nativeTestCases.forEach((value, index) => {
      expect(fluentResults[index]).toEqual(value);
    });
  });

  test("sorting by 1 field in place gives same order as native sort (by monsterdexOrder)", () => {
    const comparator = (left, right) => {
      if (left.monsterdexOrder < right.monsterdexOrder) return -1;
      if (left.monsterdexOrder > right.monsterdexOrder) return 1;

      return 0;
    };

    const fluentTestCases = getTests();
    const nativeTestCases = getTests();

    fluentSort(fluentTestCases)
      .sortBy(comparator)
      .sortInPlace();

    nativeTestCases.sort(comparator);

    nativeTestCases.forEach((value, index) => {
      expect(fluentTestCases[index]).toEqual(value);
    });
  });
});

describe("thenBy tests", () => {
  test("sorting by intelligence ascending then by agility ascending results a the correct order", () => {
    const tests = getTests();
    const sortedTests = fluentSort(tests)
      .sortByField(x => x.intelligence)
      .thenByField(y => y.agility)
      .result();

    expect(sortedTests[0].name).toBe("Unimpressive Monster");
    expect(sortedTests[1].name).toBe("Fast Monster");
    expect(sortedTests[2].name).toBe("Slow Monster");
    expect(sortedTests[3].name).toBe("Strong Monster");
    expect(sortedTests[4].name).toBe("Mediocre Monster");
    expect(sortedTests[5].name).toBe("Smart Monster");
  });

  test("sorting by intelligence descending then by agility descending results a the correct order", () => {
    const tests = getTests();
    const sortedTests = fluentSort(tests)
      .sortByFieldDescending(x => x.intelligence)
      .thenByFieldDescending(y => y.agility)
      .result();

    expect(sortedTests[0].name).toBe("Smart Monster");
    expect(sortedTests[1].name).toBe("Mediocre Monster");
    expect(sortedTests[2].name).toBe("Strong Monster");
    expect(sortedTests[3].name).toBe("Slow Monster");
    expect(sortedTests[4].name).toBe("Fast Monster");
    expect(sortedTests[5].name).toBe("Unimpressive Monster");
  });

  test("sorting by intelligence ascending then by agility descending results a the correct order", () => {
    const tests = getTests();
    const comparator = (left, right) => {
      if (left.agility > right.agility) return -1;
      if (left.agility < right.agility) return 1;

      return 0;
    };

    const sortedTests = fluentSort(tests)
      .sortByField(x => x.intelligence)
      .thenByDescending(comparator)
      .result();

    expect(sortedTests[0].name).toBe("Unimpressive Monster");
    expect(sortedTests[1].name).toBe("Fast Monster");
    expect(sortedTests[2].name).toBe("Slow Monster");
    expect(sortedTests[3].name).toBe("Strong Monster");
    expect(sortedTests[4].name).toBe("Mediocre Monster");
    expect(sortedTests[5].name).toBe("Smart Monster");
  });
});

describe("error handling", () => {
  test("throws when fluentSort not given array", () => {
    expect(() => {
      fluentSort("01189998819991197253");
    }).toThrow();
  });

  test("throws when sortBy not given a comparator", () => {
    const tests = getTests();
    expect(() => {
      const sortedTests = fluentSort(tests).sortBy(true);
    }).toThrow();
  });

  test("throws when sortByField not given a comparator", () => {
    const tests = getTests();
    expect(() => {
      const sortedTests = fluentSort(tests).sortByField();
    }).toThrow();
  });

  test("throws when sortByFieldDescending not given a comparator", () => {
    const tests = getTests();
    expect(() => {
      const sortedTests = fluentSort(tests).sortByFieldDescending();
    }).toThrow();
  });

  test("throws when sortByDescending not given a comparator", () => {
    const tests = getTests();
    expect(() => {
      const sortedTests = fluentSort(tests).sortByDescending();
    }).toThrow();
  });

  test("throws when thenBy not given a comparator", () => {
    const tests = getTests();

    const sortedTests = fluentSort(tests).sortByFieldDescending(
      x => x.intelligence
    );

    expect(() => {
      const thenBy = sortedTests.thenBy(false);
    }).toThrow();
  });

  test("throws when thenByDescending not given a comparator", () => {
    const tests = getTests();

    const sortedTests = fluentSort(tests).sortByFieldDescending(
      x => x.intelligence
    );

    expect(() => {
      const thenBy = sortedTests.thenByDescending();
    }).toThrow();
  });

  test("throws when thenByFieldDescending not given a comparator", () => {
    const tests = getTests();

    const sortedTests = fluentSort(tests).sortByFieldDescending(
      x => x.intelligence
    );

    expect(() => {
      const thenBy = sortedTests.thenByFieldDescending();
    }).toThrow();
  });

  test("throws when thenByField not given a comparator", () => {
    const tests = getTests();

    const sortedTests = fluentSort(tests).sortByFieldDescending(
      x => x.intelligence
    );

    expect(() => {
      const thenBy = sortedTests.thenByField();
    }).toThrow();
  });

  test("throws when adding a thenBy when sortComparators is not an array", () => {
    const tests = getTests();
    const sortedTests = fluentSort(tests).sortBy((left, right) => {
      if (left.id > right.id) return -1;
      if (left.id < right.id) return 1;

      return 0;
    });

    sortedTests.sortComparators = undefined;

    expect(() => {
      const sortedTestsThenBy = sortedTests.thenByField(x => x.agility);
    }).toThrow();
  });

  test("throws when generating a result when sortComparators is not an array", () => {
    const tests = getTests();
    const sortedTests = fluentSort(tests).sortBy((left, right) => {
      if (left.id > right.id) return -1;
      if (left.id < right.id) return 1;

      return 0;
    });

    sortedTests.sortComparators = undefined;

    expect(() => {
      sortedTests.result();
    }).toThrow();
  });

  test("throws when generating result when sortComparators is empty", () => {
    const tests = getTests();
    expect(() => {
      const sortedTests = fluentSort(tests).sortBy((left, right) => {
        if (left.id > right.id) return -1;
        if (left.id < right.id) return 1;

        return 0;
      });

      sortedTests.sortComparators = [];

      sortedTests.result();
    }).toThrow();
  });
});

describe("field tests", () => {
  test("sortByField places Unimpressive Monster first", () => {
    const tests = getTests();
    const sortedTests = fluentSort(tests)
      .sortByField(x => x.intelligence)
      .result();
    const firstResult = sortedTests[0];

    expect(firstResult.name).toBe("Unimpressive Monster");
  });

  test("sortByField places Smart Monster last", () => {
    const tests = getTests();
    const sortedTests = fluentSort(tests)
      .sortByField(x => x.intelligence)
      .result();
    const lastResult = sortedTests.pop();

    expect(lastResult.name).toBe("Smart Monster");
  });

  test("sortByField descending places Smart Monster first", () => {
    const tests = getTests();
    const sortedTests = fluentSort(tests)
      .sortByFieldDescending(x => x.intelligence)
      .result();
    const firstResult = sortedTests[0];

    expect(firstResult.name).toBe("Smart Monster");
  });

  test("sortByField descending places Unimpressive Monster last", () => {
    const tests = getTests();
    const sortedTests = fluentSort(tests)
      .sortByFieldDescending(x => x.intelligence)
      .result();
    const lastResult = sortedTests.pop();

    expect(lastResult.name).toBe("Unimpressive Monster");
  });
});
