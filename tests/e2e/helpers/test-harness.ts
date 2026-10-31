/**
 * Lightweight, robust E2E test harness for TypeScript / Node.js
 * Zero external runtime dependencies.
 */

export interface TestCaseResult {
  suite: string;
  name: string;
  passed: boolean;
  durationMs: number;
  error?: Error;
}

export interface SuiteResult {
  name: string;
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  tests: TestCaseResult[];
}

export interface TestRunnerResult {
  tierName: string;
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  suites: SuiteResult[];
}

let currentSuite = "Default Suite";
const pendingTests: Array<{ suite: string; name: string; fn: () => void | Promise<void> }> = [];

export function describe(name: string, fn: () => void): void {
  const prevSuite = currentSuite;
  currentSuite = name;
  try {
    fn();
  } finally {
    currentSuite = prevSuite;
  }
}

export function it(name: string, fn: () => void | Promise<void>): void {
  pendingTests.push({ suite: currentSuite, name, fn });
}

export class Expectation<T = any> {
  constructor(private actual: T, private isNot = false) {}

  get not(): Expectation<T> {
    return new Expectation(this.actual, !this.isNot);
  }

  toBe(expected: any): void {
    const pass = Object.is(this.actual, expected);
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to be ${JSON.stringify(expected)}`);
    }
  }

  toEqual(expected: any): void {
    const pass = JSON.stringify(this.actual) === JSON.stringify(expected);
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to equal ${JSON.stringify(expected)}`);
    }
  }

  toBeTruthy(): void {
    const pass = Boolean(this.actual);
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to be truthy`);
    }
  }

  toBeFalsy(): void {
    const pass = !this.actual;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to be falsy`);
    }
  }

  toContain(item: any): void {
    let pass = false;
    if (typeof this.actual === "string" && typeof item === "string") {
      pass = this.actual.includes(item);
    } else if (Array.isArray(this.actual)) {
      pass = this.actual.includes(item);
    }
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to contain ${JSON.stringify(item)}`);
    }
  }

  toMatch(regex: RegExp): void {
    const pass = typeof this.actual === "string" && regex.test(this.actual);
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected "${this.actual}" ${this.isNot ? "not " : ""}to match ${regex}`);
    }
  }

  toBeGreaterThan(expected: number): void {
    const pass = typeof this.actual === "number" && this.actual > expected;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${this.actual} ${this.isNot ? "not " : ""}to be greater than ${expected}`);
    }
  }

  toBeGreaterThanOrEqual(expected: number): void {
    const pass = typeof this.actual === "number" && this.actual >= expected;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${this.actual} ${this.isNot ? "not " : ""}to be >= ${expected}`);
    }
  }

  toBeLessThan(expected: number): void {
    const pass = typeof this.actual === "number" && this.actual < expected;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${this.actual} ${this.isNot ? "not " : ""}to be less than ${expected}`);
    }
  }

  toBeLessThanOrEqual(expected: number): void {
    const pass = typeof this.actual === "number" && this.actual <= expected;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${this.actual} ${this.isNot ? "not " : ""}to be <= ${expected}`);
    }
  }

  toThrow(expectedMessage?: string | RegExp): void {
    if (typeof this.actual !== "function") {
      throw new Error("Expected function for toThrow assertion");
    }
    let threw = false;
    let thrownError: any = null;
    try {
      (this.actual as Function)();
    } catch (err) {
      threw = true;
      thrownError = err;
    }
    if (this.isNot ? threw : !threw) {
      throw new Error(`Expected function ${this.isNot ? "not " : ""}to throw an error`);
    }
    if (threw && expectedMessage) {
      const msg = thrownError?.message || String(thrownError);
      if (typeof expectedMessage === "string" && !msg.includes(expectedMessage)) {
        throw new Error(`Expected error message to include "${expectedMessage}", got "${msg}"`);
      } else if (expectedMessage instanceof RegExp && !expectedMessage.test(msg)) {
        throw new Error(`Expected error message to match ${expectedMessage}, got "${msg}"`);
      }
    }
  }
}

export function expect<T = any>(actual: T): Expectation<T> {
  return new Expectation(actual);
}

export async function runRegisteredTests(tierName: string): Promise<TestRunnerResult> {
  const testsToRun = [...pendingTests];
  pendingTests.length = 0; // Clear for next run

  const suitesMap = new Map<string, SuiteResult>();
  const startTime = Date.now();

  console.log(`\n======================================================================`);
  console.log(`  RUNNING TEST SUITE: ${tierName}`);
  console.log(`======================================================================\n`);

  for (const t of testsToRun) {
    if (!suitesMap.has(t.suite)) {
      suitesMap.set(t.suite, {
        name: t.suite,
        total: 0,
        passed: 0,
        failed: 0,
        durationMs: 0,
        tests: []
      });
      console.log(`\n[Suite] ${t.suite}`);
    }
    const suite = suitesMap.get(t.suite)!;
    const testStart = Date.now();
    let passed = false;
    let testError: Error | undefined = undefined;

    try {
      await t.fn();
      passed = true;
      suite.passed++;
      console.log(`  \x1b[32m✓\x1b[0m ${t.name}`);
    } catch (err: any) {
      passed = false;
      suite.failed++;
      testError = err instanceof Error ? err : new Error(String(err));
      console.log(`  \x1b[31m✗\x1b[0m ${t.name}`);
      console.log(`    \x1b[31mError: ${testError.message}\x1b[0m`);
    }

    const testDuration = Date.now() - testStart;
    suite.total++;
    suite.durationMs += testDuration;
    suite.tests.push({
      suite: t.suite,
      name: t.name,
      passed,
      durationMs: testDuration,
      error: testError
    });
  }

  const durationMs = Date.now() - startTime;
  const suites = Array.from(suitesMap.values());
  const total = suites.reduce((acc, s) => acc + s.total, 0);
  const passed = suites.reduce((acc, s) => acc + s.passed, 0);
  const failed = suites.reduce((acc, s) => acc + s.failed, 0);

  console.log(`\n----------------------------------------------------------------------`);
  console.log(`  ${tierName} Summary: ${passed}/${total} passed (${failed} failed) in ${durationMs}ms`);
  console.log(`----------------------------------------------------------------------\n`);

  return {
    tierName,
    total,
    passed,
    failed,
    durationMs,
    suites
  };
}
