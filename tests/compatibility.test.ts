import { describe, it, expect } from 'vitest';
import { checkPSUCompatibility, checkThermalCompatibility, checkBottleneck, Component } from '../src/lib/compatibility';

describe('Compatibility Logic', () => {
    describe('PSU Checks', () => {
        it('should fail if PSU is too weak for 4090', () => {
            const components: Component[] = [
                { type: 'CPU', name: 'i9-13900K', price: 0, specs: { tdp: 253 } },
                { type: 'GPU', name: 'RTX 4090', price: 0, specs: { tdp: 450 } },
                { type: 'PSU', name: 'Generic 750W', price: 0, specs: { wattage: 750 } }
            ];
            const result = checkPSUCompatibility(components);
            expect(result.compatible).toBe(false);
            expect(result.recommendedWattage).toBeGreaterThan(750);
        });

        it('should pass if PSU is sufficient', () => {
            const components: Component[] = [
                { type: 'CPU', name: 'i5-13600K', price: 0, specs: { tdp: 181 } },
                { type: 'GPU', name: 'RTX 4070', price: 0, specs: { tdp: 200 } },
                { type: 'PSU', name: 'Gold 750W', price: 0, specs: { wattage: 750 } }
            ];
            const result = checkPSUCompatibility(components);
            expect(result.compatible).toBe(true);
        });
    });

    describe('Thermal Checks', () => {
        it('should warn if high TDP CPU has weak cooler', () => {
            const components: Component[] = [
                { type: 'CPU', name: 'i9-13900K', price: 0, specs: { tdp: 253 } },
                { type: 'Cooler', name: 'Stock Cooler', price: 0, specs: {} }
            ];
            const result = checkThermalCompatibility(components);
            expect(result.compatible).toBe(false);
        });
    });

    describe('Bottleneck Checks', () => {
        it('should detect CPU bottleneck (i3 + 4090)', () => {
            const components: Component[] = [
                { type: 'CPU', name: 'i3-12100', price: 0, specs: { tdp: 60 } }, // Tier 1
                { type: 'GPU', name: 'RTX 4090', price: 0, specs: { tdp: 450 } } // Tier 4
            ];
            const result = checkBottleneck(components);
            expect(result.compatible).toBe(false);
            expect(result.reason).toContain('CPU is too weak');
        });

        it('should pass balanced build (i7 + 4080)', () => {
            const components: Component[] = [
                { type: 'CPU', name: 'i7-13700K', price: 0, specs: { tdp: 253 } }, // Tier 3
                { type: 'GPU', name: 'RTX 4080', price: 0, specs: { tdp: 320 } } // Tier 4
            ];
            const result = checkBottleneck(components);
            expect(result.compatible).toBe(true);
        });
    });
});
