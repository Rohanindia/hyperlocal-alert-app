import { describe, it, expect } from 'vitest';

function classifyAlert(description) {
  const text = description.toLowerCase();
  let hazardType = 'other', severity = 'low';
  if (text.includes('flood') || text.includes('water')) { hazardType = 'flood'; severity = 'critical'; }
  else if (text.includes('fire') || text.includes('smoke')) { hazardType = 'fire'; severity = 'critical'; }
  else if (text.includes('accident') || text.includes('crash')) { hazardType = 'accident'; severity = 'medium'; }
  else if (text.includes('traffic') || text.includes('jam')) { hazardType = 'traffic'; severity = 'medium'; }
  else if (text.includes('gas') || text.includes('leak')) { hazardType = 'gas leak'; severity = 'critical'; }
  else if (text.includes('power') || text.includes('outage')) { hazardType = 'power outage'; severity = 'low'; }
  const summary = description.substring(0, 50);
  return { hazardType, severity, summary };
}

describe('classifyAlert', () => {
  it('classifies flood correctly', () => {
    const result = classifyAlert('flood on main road');
    expect(result.hazardType).toBe('flood');
    expect(result.severity).toBe('critical');
  });

  it('classifies traffic correctly', () => {
    const result = classifyAlert('traffic jam near station');
    expect(result.hazardType).toBe('traffic');
    expect(result.severity).toBe('medium');
  });

  it('classifies gas leak correctly', () => {
    const result = classifyAlert('gas leak near apartment');
    expect(result.hazardType).toBe('gas leak');
    expect(result.severity).toBe('critical');
  });

  it('handles unknown hazard', () => {
    const result = classifyAlert('something strange happened');
    expect(result.hazardType).toBe('other');
    expect(result.severity).toBe('low');
  });

  it('summary is max 50 chars', () => {
    const result = classifyAlert('this is a very long description that goes on and on');
    expect(result.summary.length).toBeLessThanOrEqual(50);
  });
});
