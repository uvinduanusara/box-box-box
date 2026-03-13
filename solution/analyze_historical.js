#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function loadHistoricalRaces() {
  const dir = path.join(__dirname, '..', 'data', 'historical_races');
  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json')).sort();
  const races = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    races.push(...JSON.parse(fs.readFileSync(filePath, 'utf8')));
  }

  return races;
}

function summarize(races) {
  const summary = {
    races: races.length,
    tracks: new Map(),
    stopCounts: new Map(),
    temperatures: new Set(),
  };

  for (const race of races) {
    summary.tracks.set(
      race.race_config.track,
      (summary.tracks.get(race.race_config.track) ?? 0) + 1
    );
    summary.temperatures.add(race.race_config.track_temp);

    for (const strategy of Object.values(race.strategies)) {
      const count = strategy.pit_stops.length;
      summary.stopCounts.set(count, (summary.stopCounts.get(count) ?? 0) + 1);
    }
  }

  return {
    races: summary.races,
    tracks: Object.fromEntries([...summary.tracks.entries()].sort()),
    stopCounts: Object.fromEntries([...summary.stopCounts.entries()].sort((a, b) => a[0] - b[0])),
    temperatures: [...summary.temperatures].sort((a, b) => a - b),
  };
}

function main() {
  const races = loadHistoricalRaces();
  process.stdout.write(`${JSON.stringify(summarize(races), null, 2)}\n`);
}

main();
