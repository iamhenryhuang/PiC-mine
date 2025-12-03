export interface Component {
    type: 'CPU' | 'GPU' | 'RAM' | 'Motherboard' | 'PSU' | 'Storage' | 'Cooler' | 'Case';
    name: string;
    price: number;
    specs?: {
        tdp?: number; // Watts
        vram?: number; // GB
        socket?: string;
        formFactor?: string;
        length?: number; // mm
        slots?: number;
        cores?: number;
        threads?: number;
        clock?: number; // GHz
        efficiency?: string; // 80+ Gold, etc.
        wattage?: number; // For PSU
        airFlow?: number; // CFM
        radiatorSize?: number; // mm
    };
}

export function calculateTotalPower(components: Component[]): number {
    let totalTDP = 0;
    components.forEach(comp => {
        if (comp.specs?.tdp) {
            totalTDP += comp.specs.tdp;
        }
    });
    // Add buffer for other components (fans, drives, mobo) - roughly 50-100W
    return totalTDP + 100;
}

export function checkPSUCompatibility(components: Component[]): { compatible: boolean; reason?: string; recommendedWattage: number } {
    const totalPower = calculateTotalPower(components);
    const psu = components.find(c => c.type === 'PSU');

    // Safety margin: PSU should be at least 1.2x total power, or +100-200W
    // For high-end GPUs (4090), we need more headroom for transients.
    const gpu = components.find(c => c.type === 'GPU');
    let safetyFactor = 1.2;

    if (gpu?.name.includes('4090') || gpu?.name.includes('4080')) {
        safetyFactor = 1.3; // Higher transient spikes
    }

    const recommendedWattage = Math.ceil((totalPower * safetyFactor) / 50) * 50; // Round up to nearest 50W

    if (!psu) {
        return { compatible: false, reason: 'No PSU found', recommendedWattage };
    }

    if (!psu.specs?.wattage) {
        // If we can't parse wattage, assume it's missing data but don't fail hard if it's just a string match issue in a real app.
        // But here we want strict logic.
        return { compatible: false, reason: 'PSU wattage unknown', recommendedWattage };
    }

    if (psu.specs.wattage < recommendedWattage) {
        return {
            compatible: false,
            reason: `PSU wattage ${psu.specs.wattage}W is too low. Recommended: ${recommendedWattage}W (Total TDP: ${totalPower}W)`,
            recommendedWattage
        };
    }

    return { compatible: true, recommendedWattage };
}

export function checkThermalCompatibility(components: Component[]): { compatible: boolean; reason?: string } {
    const cpu = components.find(c => c.type === 'CPU');
    const cooler = components.find(c => c.type === 'Cooler');

    if (!cpu || !cooler) return { compatible: true }; // Can't check

    // Simple heuristic: High TDP CPU needs AIO or high-end air
    if (cpu.specs?.tdp && cpu.specs.tdp > 120) {
        if (cooler.name.toLowerCase().includes('stock') || !cooler.specs?.radiatorSize && !cooler.name.toLowerCase().includes('noctua') && !cooler.name.toLowerCase().includes('assassin')) {
            // Very basic check. In reality, we'd check cooler TDP rating.
            // Assuming AIOs have radiatorSize
            return { compatible: false, reason: 'High TDP CPU requires liquid cooling or high-end air cooler.' };
        }
    }

    // Check Case vs Cooler height/size (simplified)
    const pcCase = components.find(c => c.type === 'Case');
    if (pcCase && cooler.specs?.radiatorSize) {
        // Assume case name contains supported sizes or we have data. 
        // For now, just a placeholder logic.
        if (pcCase.name.toLowerCase().includes('itx') && cooler.specs.radiatorSize > 240) {
            return { compatible: false, reason: 'Large AIO might not fit in ITX case.' };
        }
    }

    return { compatible: true };
}

export function checkBottleneck(components: Component[]): { compatible: boolean; reason?: string; bottleneckScore: number } {
    const cpu = components.find(c => c.type === 'CPU');
    const gpu = components.find(c => c.type === 'GPU');

    if (!cpu || !gpu) return { compatible: true, bottleneckScore: 0 };

    // Extremely simplified bottleneck logic based on "tier"
    // In a real app, we'd use benchmark scores.
    let cpuTier = 0;
    if (cpu.name.includes('i9') || cpu.name.includes('Ryzen 9')) cpuTier = 4;
    else if (cpu.name.includes('i7') || cpu.name.includes('Ryzen 7')) cpuTier = 3;
    else if (cpu.name.includes('i5') || cpu.name.includes('Ryzen 5')) cpuTier = 2;
    else cpuTier = 1;

    let gpuTier = 0;
    if (gpu.name.includes('4090') || gpu.name.includes('4080')) gpuTier = 4;
    else if (gpu.name.includes('4070')) gpuTier = 3;
    else if (gpu.name.includes('4060') || gpu.name.includes('3060')) gpuTier = 2;
    else gpuTier = 1;

    // CPU should be within 1 tier of GPU generally
    const diff = gpuTier - cpuTier;

    if (diff > 1) {
        return { compatible: false, reason: 'CPU is too weak for this GPU (Bottleneck risk)', bottleneckScore: diff * 10 };
    }
    if (diff < -2) {
        // GPU too weak for CPU is usually fine, just wasted CPU potential for gaming, but maybe okay for productivity.
        // We'll warn anyway.
        return { compatible: true, reason: 'GPU is significantly weaker than CPU', bottleneckScore: Math.abs(diff) * 5 };
    }

    return { compatible: true, bottleneckScore: 0 };
}
