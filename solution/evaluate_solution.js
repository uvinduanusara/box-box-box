#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { simulateRace } = require('./race_simulator');

function main() {
  const inputDir = path.join(__dirname, '..', 'data', 'test_cases', 'inputs');
  const expectedDir = path.join(__dirname, '..', 'data', 'test_cases', 'expected_outputs');
  const files = fs.readdirSync(inputDir).filter((file) => file.endsWith('.json')).sort();
  let passed = 0;

  for (const file of files) {
    const actual = simulateRace(JSON.parse(fs.readFileSync(path.join(inputDir, file), 'utf8')));
    const expected = JSON.parse(fs.readFileSync(path.join(expectedDir, file), 'utf8'));
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    if (ok) {
      passed += 1;
    }
    process.stdout.write(`${ok ? 'PASS' : 'FAIL'} ${file}\n`);
  }

  process.stdout.write(`\nPassed ${passed}/${files.length}\n`);
}

main();
