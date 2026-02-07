// Game State
let gameState = {
    coins: 0,
    coinsPerTick: 1,
    earnInterval: 10000, // milliseconds between coin earnings
    prestige: 0,
    textPosition: { x: 50, y: 150 },
    writeCount: 0,
    currentSkin: 'classic',
    purchasedUpgrades: [],
    purchasedSkills: [],
    purchasedSkins: [],
    specialAbilities: [],
    freeUpgrades: false,
    selectedPath: null, // 'speed', 'power', or 'magic'
    unlockedSkills: ['skill-1'], // skills unlocked beyond the visible path
    // Ability system state
    abilityCounters: {}, // counts for ability triggers keyed by skill id
    skillMultiplier: 1, // temporary multiplier applied to coin gains
    lightningActive: false,
    mysticDoubleNext: false
};


// Pencil Skins
const skins = {
    classic: {
        name: 'Classic Pencil',
        bodyColor: '#c4a747',
        tipColor: '#2d2d2d',
        cost: 0,
        description: 'The original pencil',
        unlocked: true,
        glow: false
    },
    gold: {
        name: 'Golden Pencil',
        bodyColor: '#ffd700',
        tipColor: '#b8960f',
        cost: 5,
        description: 'Shiny gold pencil',
        unlocked: false,
        glow: true,
        glowColor: '#ffd700'
    },
    magic: {
        name: 'Magic Pencil',
        bodyColor: '#9370db',
        tipColor: '#6a4c93',
        cost: 25,
        description: 'Writes with magic!',
        unlocked: false,
        glow: true,
        glowColor: '#9370db'
    },
    crystal: {
        name: 'Crystal Pencil',
        bodyColor: '#00ced1',
        tipColor: '#008a8f',
        cost: 50,
        description: 'Sparkles with power',
        unlocked: false,
        glow: true,
        glowColor: '#00ced1'
    },
    fire: {
        name: 'Fire Pencil',
        bodyColor: '#ff4500',
        tipColor: '#cc2200',
        cost: 100,
        description: 'Burns through paper',
        unlocked: false,
        glow: true,
        glowColor: '#ff6600'
    },
    ice: {
        name: 'Frost Pencil',
        bodyColor: '#00bfff',
        tipColor: '#0073a3',
        cost: 100,
        description: 'Freezes the paper',
        unlocked: false,
        glow: true,
        glowColor: '#00bfff'
    },
     Dihencil: {
        name: 'Dihencil',
        bodyColor: '#D2B48C',
        tipColor: '#f84bd3',
        cost: 1000,
        description: 'Writes with the power of 67',
        unlocked: false,
        glow: true,
        glowColor: '#ffffff'
    },
};

// Upgrades System
const upgrades = [
    {
        id: 'faster-writing-1',
        name: 'Speedy Scribbles',
        description: '+$0.5 per tick',
        cost: 2,
        effect: () => { gameState.coinsPerTick += 0.5; }
    },
    {
        id: 'faster-writing-2',
        name: 'Super Speed',
        description: '+$1 per tick',
        cost: 5,
        effect: () => { gameState.coinsPerTick += 1; }
    },
    {
        id: 'lucky-hand',
        name: 'Lucky Hand',
        description: 'x2 coins per tick',
        cost: 10,
        effect: () => { gameState.coinsPerTick *= 2; }
    },
    {
        id: 'quick-hands',
        name: 'Quick Hands',
        description: 'Earn every 8s instead of 10s',
        cost: 15,
        effect: () => { gameState.earnInterval = 8000; restartMoneyLoop(); }
    },
    {
        id: 'infinite-ink',
        name: 'Infinite Ink',
        description: 'x2 coins per tick',
        cost: 25,
        effect: () => { gameState.coinsPerTick *= 2; }
    },
    {
        id: 'auto-write',
        name: 'Auto Write',
        description: '+$2 per tick',
        cost: 50,
        effect: () => { gameState.coinsPerTick += 2; }
    },
    {
        id: 'lightning-speed',
        name: 'Lightning Speed',
        description: 'Earn every 5s instead of 8s',
        cost: 60,
        effect: () => { gameState.earnInterval = 5000; restartMoneyLoop(); }
    },
    {
        id: 'golden-touch',
        name: 'Golden Touch',
        description: 'x3 coins per tick',
        cost: 100,
        effect: () => { gameState.coinsPerTick *= 3; }
    },
    {
        id: 'time-warp',
        name: 'Time Warp',
        description: 'Earn every 3s instead of 5s',
        cost: 150,
        effect: () => { gameState.earnInterval = 3000; restartMoneyLoop(); }
    },
    {
        id: 'mega-boost',
        name: 'Mega Boost',
        description: '+$5 per tick',
        cost: 200,
        effect: () => { gameState.coinsPerTick += 5; }
    },
    {
        id: 'instant-wealth',
        name: 'Instant Wealth',
        description: 'Earn every 1s instead of 3s',
        cost: 300,
        effect: () => { gameState.earnInterval = 1000; restartMoneyLoop(); }
    },
    {
        id: 'supreme-power',
        name: 'Supreme Power',
        description: 'x5 coins per tick',
        cost: 500,
        effect: () => { gameState.coinsPerTick *= 5; }
    },
    // Additional 50 upgrades
    {
        id: 'elite-grip',
        name: 'Elite Grip',
        description: '+$10 per tick',
        cost: 600,
        effect: () => { gameState.coinsPerTick += 10; }
    },
    {
        id: 'cosmic-speed',
        name: 'Cosmic Speed',
        description: 'Earn every 750ms',
        cost: 700,
        effect: () => { gameState.earnInterval = 750; restartMoneyLoop(); }
    },
    {
        id: 'prismatic-touch',
        name: 'Prismatic Touch',
        description: 'x6 coins per tick',
        cost: 800,
        effect: () => { gameState.coinsPerTick *= 6; }
    },
    {
        id: 'quantum-scribe',
        name: 'Quantum Scribe',
        description: '+$20 per tick',
        cost: 900,
        effect: () => { gameState.coinsPerTick += 20; }
    },
    {
        id: 'hypersonic',
        name: 'Hypersonic Writer',
        description: 'Earn every 500ms',
        cost: 1000,
        effect: () => { gameState.earnInterval = 500; restartMoneyLoop(); }
    },
    {
        id: 'transcendent-power',
        name: 'Transcendent Power',
        description: 'x7 coins per tick',
        cost: 1200,
        effect: () => { gameState.coinsPerTick *= 7; }
    },
    {
        id: 'infinity-touch',
        name: 'Infinity Touch',
        description: '+$50 per tick',
        cost: 1400,
        effect: () => { gameState.coinsPerTick += 50; }
    },
    {
        id: 'lightspeed-hand',
        name: 'Lightspeed Hand',
        description: 'Earn every 350ms',
        cost: 1600,
        effect: () => { gameState.earnInterval = 350; restartMoneyLoop(); }
    },
    {
        id: 'dimensional-writer',
        name: 'Dimensional Writer',
        description: 'x8 coins per tick',
        cost: 1800,
        effect: () => { gameState.coinsPerTick *= 8; }
    },
    {
        id: 'divine-grip',
        name: 'Divine Grip',
        description: '+$75 per tick',
        cost: 2000,
        effect: () => { gameState.coinsPerTick += 75; }
    },
    {
        id: 'warp-drive',
        name: 'Warp Drive',
        description: 'Earn every 250ms',
        cost: 2200,
        effect: () => { gameState.earnInterval = 250; restartMoneyLoop(); }
    },
    {
        id: 'eternal-power',
        name: 'Eternal Power',
        description: 'x9 coins per tick',
        cost: 2400,
        effect: () => { gameState.coinsPerTick *= 9; }
    },
    {
        id: 'omnipotent-scribe',
        name: 'Omnipotent Scribe',
        description: '+$100 per tick',
        cost: 2600,
        effect: () => { gameState.coinsPerTick += 100; }
    },
    {
        id: 'instant-gratification',
        name: 'Instant Gratification',
        description: 'Earn every 200ms',
        cost: 2800,
        effect: () => { gameState.earnInterval = 200; restartMoneyLoop(); }
    },
    {
        id: 'celestial-touch',
        name: 'Celestial Touch',
        description: 'x10 coins per tick',
        cost: 3000,
        effect: () => { gameState.coinsPerTick *= 10; }
    },
    {
        id: 'stellar-grip',
        name: 'Stellar Grip',
        description: '+$150 per tick',
        cost: 3200,
        effect: () => { gameState.coinsPerTick += 150; }
    },
    {
        id: 'ultrafast',
        name: 'Ultrafast Writer',
        description: 'Earn every 150ms',
        cost: 3400,
        effect: () => { gameState.earnInterval = 150; restartMoneyLoop(); }
    },
    {
        id: 'apex-power',
        name: 'Apex Power',
        description: 'x11 coins per tick',
        cost: 3600,
        effect: () => { gameState.coinsPerTick *= 11; }
    },
    {
        id: 'supreme-grip',
        name: 'Supreme Grip',
        description: '+$200 per tick',
        cost: 3800,
        effect: () => { gameState.coinsPerTick += 200; }
    },
    {
        id: 'quantum-speed',
        name: 'Quantum Speed',
        description: 'Earn every 125ms',
        cost: 4000,
        effect: () => { gameState.earnInterval = 125; restartMoneyLoop(); }
    },
    {
        id: 'cosmic-power',
        name: 'Cosmic Power',
        description: 'x12 coins per tick',
        cost: 4200,
        effect: () => { gameState.coinsPerTick *= 12; }
    },
    {
        id: 'legendary-scribe',
        name: 'Legendary Scribe',
        description: '+$300 per tick',
        cost: 4400,
        effect: () => { gameState.coinsPerTick += 300; }
    },
    {
        id: 'supersonic-hand',
        name: 'Supersonic Hand',
        description: 'Earn every 100ms',
        cost: 4600,
        effect: () => { gameState.earnInterval = 100; restartMoneyLoop(); }
    },
    {
        id: 'ultimate-power',
        name: 'Ultimate Power',
        description: 'x13 coins per tick',
        cost: 4800,
        effect: () => { gameState.coinsPerTick *= 13; }
    },
    {
        id: 'mythic-grip',
        name: 'Mythic Grip',
        description: '+$400 per tick',
        cost: 5000,
        effect: () => { gameState.coinsPerTick += 400; }
    },
    {
        id: 'infinite-speed',
        name: 'Infinite Speed',
        description: 'Earn every 90ms',
        cost: 5200,
        effect: () => { gameState.earnInterval = 90; restartMoneyLoop(); }
    },
    {
        id: 'god-power',
        name: 'God Power',
        description: 'x14 coins per tick',
        cost: 5400,
        effect: () => { gameState.coinsPerTick *= 14; }
    },
    {
        id: 'titan-grip',
        name: 'Titan Grip',
        description: '+$500 per tick',
        cost: 5600,
        effect: () => { gameState.coinsPerTick += 500; }
    },
    {
        id: 'overdrive',
        name: 'Overdrive',
        description: 'Earn every 75ms',
        cost: 5800,
        effect: () => { gameState.earnInterval = 75; restartMoneyLoop(); }
    },
    {
        id: 'arcane-power',
        name: 'Arcane Power',
        description: 'x15 coins per tick',
        cost: 6000,
        effect: () => { gameState.coinsPerTick *= 15; }
    },
    {
        id: 'eldritch-scribe',
        name: 'Eldritch Scribe',
        description: '+$600 per tick',
        cost: 6200,
        effect: () => { gameState.coinsPerTick += 600; }
    },
    {
        id: 'velocity-touch',
        name: 'Velocity Touch',
        description: 'Earn every 60ms',
        cost: 6400,
        effect: () => { gameState.earnInterval = 60; restartMoneyLoop(); }
    },
    {
        id: 'nexus-power',
        name: 'Nexus Power',
        description: 'x16 coins per tick',
        cost: 6600,
        effect: () => { gameState.coinsPerTick *= 16; }
    },
    {
        id: 'essence-grip',
        name: 'Essence Grip',
        description: '+$750 per tick',
        cost: 6800,
        effect: () => { gameState.coinsPerTick += 750; }
    },
    {
        id: 'meteor-speed',
        name: 'Meteor Speed',
        description: 'Earn every 50ms',
        cost: 7000,
        effect: () => { gameState.earnInterval = 50; restartMoneyLoop(); }
    },
    {
        id: 'void-power',
        name: 'Void Power',
        description: 'x17 coins per tick',
        cost: 7200,
        effect: () => { gameState.coinsPerTick *= 17; }
    },
    {
        id: 'shadow-grip',
        name: 'Shadow Grip',
        description: '+$1000 per tick',
        cost: 7400,
        effect: () => { gameState.coinsPerTick += 1000; }
    },
    {
        id: 'ethereal-speed',
        name: 'Ethereal Speed',
        description: 'Earn every 40ms',
        cost: 7600,
        effect: () => { gameState.earnInterval = 40; restartMoneyLoop(); }
    },
    {
        id: 'absolute-power',
        name: 'Absolute Power',
        description: 'x18 coins per tick',
        cost: 7800,
        effect: () => { gameState.coinsPerTick *= 18; }
    },
    {
        id: 'infinite-grip',
        name: 'Infinite Grip',
        description: '+$1500 per tick',
        cost: 8000,
        effect: () => { gameState.coinsPerTick += 1500; }
    },
    {
        id: 'blinding-speed',
        name: 'Blinding Speed',
        description: 'Earn every 30ms',
        cost: 8200,
        effect: () => { gameState.earnInterval = 30; restartMoneyLoop(); }
    },
    {
        id: 'supreme-deity',
        name: 'Supreme Deity',
        description: 'x20 coins per tick',
        cost: 8400,
        effect: () => { gameState.coinsPerTick *= 20; }
    },
    {
        id: 'universal-touch',
        name: 'Universal Touch',
        description: '+$2000 per tick',
        cost: 8600,
        effect: () => { gameState.coinsPerTick += 2000; }
    },
    {
        id: 'time-manipulation',
        name: 'Time Manipulation',
        description: 'Earn every 25ms',
        cost: 8800,
        effect: () => { gameState.earnInterval = 25; restartMoneyLoop(); }
    },
    {
        id: 'reality-power',
        name: 'Reality Power',
        description: 'x25 coins per tick',
        cost: 9000,
        effect: () => { gameState.coinsPerTick *= 25; }
    },
    {
        id: 'existence-grip',
        name: 'Existence Grip',
        description: '+$3000 per tick',
        cost: 9200,
        effect: () => { gameState.coinsPerTick += 3000; }
    },
    {
        id: 'fractal-writer',
        name: 'Fractal Writer',
        description: 'Earn every 20ms',
        cost: 9400,
        effect: () => { gameState.earnInterval = 20; restartMoneyLoop(); }
    },
    {
        id: 'omniscient-power',
        name: 'Omniscient Power',
        description: 'x30 coins per tick',
        cost: 9600,
        effect: () => { gameState.coinsPerTick *= 30; }
    },
    {
        id: 'final-grip',
        name: 'Final Grip',
        description: '+$5000 per tick',
        cost: 9800,
        effect: () => { gameState.coinsPerTick += 5000; }
    },
    {
        id: 'infinite-momentum',
        name: 'Infinite Momentum',
        description: 'Earn every 10ms',
        cost: 10000,
        effect: () => { gameState.earnInterval = 10; restartMoneyLoop(); }
    }
];

// Skill Tree - Branching System
const skillTree = [
    {
        id: 'skill-1',
        name: 'Enhanced Focus',
        description: 'Focus on writing',
        cost: 0,
        effect: () => { gameState.specialAbilities.push('enhanced_focus'); },
        skinUnlock: 'gold',
        parent: null
    },
    // Branch 1: Speed Path
    {
        id: 'skill-2a',
        name: 'Lightning Fingers',
        description: '+$0.5/10s',
        cost: 1,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick += 0.5; },
        parent: 'skill-1',
        branch: 'speed'
    },
    {
        id: 'skill-3a',
        name: 'Hyperdrive',
        description: 'x2 coins per tick',
        cost: 2,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick *= 2; },
        parent: 'skill-2a',
        branch: 'speed'
    },
    {
        id: 'skill-4a',
        name: 'Infinite Speed',
        description: 'x3 coins per tick',
        cost: 5,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick *= 3; },
        parent: 'skill-3a',
        branch: 'speed'
    },
    // Branch 2: Power Path
    {
        id: 'skill-2b',
        name: 'Mighty Grip',
        description: '+$1/10s',
        cost: 1,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick += 1; },
        skinUnlock: 'magic',
        parent: 'skill-1',
        branch: 'power'
    },
    {
        id: 'skill-3b',
        name: 'Unstoppable Force',
        description: '+$2/10s',
        cost: 2,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick += 2; },
        parent: 'skill-2b',
        branch: 'power'
    },
    {
        id: 'skill-4b',
        name: 'Godly Power',
        description: 'x4 coins per tick',
        cost: 5,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick *= 4; },
        skinUnlock: 'fire',
        parent: 'skill-3b',
        branch: 'power'
    },
    // Branch 3: Magic Path
    {
        id: 'skill-2c',
        name: 'Mystic Touch',
        description: '+$0.7/10s + Effects',
        cost: 1,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick += 0.7; gameState.specialAbilities.push('mystic'); },
        skinUnlock: 'magic',
        parent: 'skill-1',
        branch: 'magic'
    },
    {
        id: 'skill-3c',
        name: 'Enchanted Pen',
        description: 'x1.8 coins per tick',
        cost: 2,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick *= 1.8; },
        parent: 'skill-2c',
        branch: 'magic'
    },
    {
        id: 'skill-4c',
        name: 'Cosmic Mastery',
        description: 'x2.5 coins per tick',
        cost: 5,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick *= 2.5; },
        skinUnlock: 'ice',
        parent: 'skill-3c',
        branch: 'magic'
    },
    // Branch 1 Extended: Speed Path
    {
        id: 'skill-5a',
        name: 'Speed Demon',
        description: '+$1/10s',
        cost: 8,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick += 1; },
        parent: 'skill-4a',
        branch: 'speed'
    },
    {
        id: 'skill-6a',
        name: 'Velocity Master',
        description: 'x4 coins per tick',
        cost: 12,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick *= 4; },
        parent: 'skill-5a',
        branch: 'speed'
    },
    // Branch 2 Extended: Power Path
    {
        id: 'skill-5b',
        name: 'Infinite Strength',
        description: '+$5/10s',
        cost: 8,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick += 5; },
        parent: 'skill-4b',
        branch: 'power'
    },
    {
        id: 'skill-6b',
        name: 'Omnipotence',
        description: 'x5 coins per tick',
        cost: 12,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick *= 5; },
        parent: 'skill-5b',
        branch: 'power'
    },
    // Branch 3 Extended: Magic Path
    {
        id: 'skill-5c',
        name: 'Arcane Mastery',
        description: 'x2 coins per tick',
        cost: 8,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick *= 2; gameState.specialAbilities.push('arcane'); },
        parent: 'skill-4c',
        branch: 'magic'
    },
    {
        id: 'skill-6c',
        name: 'Supreme Sorcerer',
        description: 'x6 coins per tick',
        cost: 12,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick *= 6; gameState.specialAbilities.push('supreme_sorcery'); },
        parent: 'skill-5c',
        branch: 'magic'
    },
    // Hidden unlock skills (appear after first prestige purchase on each branch)
    {
        id: 'skill-bonus-1',
        name: 'Ancient Knowledge',
        description: '+$10/10s',
        cost: 15,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick += 10; },
        parent: null,
        branch: 'hidden',
        unlockAfter: 1
    },
    {
        id: 'skill-bonus-2',
        name: 'Forbidden Arts',
        description: 'x7 coins per tick',
        cost: 15,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick *= 7; },
        parent: null,
        branch: 'hidden',
        unlockAfter: 2
    },
    {
        id: 'skill-bonus-3',
        name: 'Eternal Blessing',
        description: '+$20/10s',
        cost: 20,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick += 20; },
        parent: null,
        branch: 'hidden',
        unlockAfter: 3
    },
    {
        id: 'skill-bonus-4',
        name: 'Divine Intervention',
        description: 'x8 coins per tick',
        cost: 20,
        costType: 'prestige',
        effect: () => { gameState.coinsPerTick *= 8; },
        parent: null,
        branch: 'hidden',
        unlockAfter: 4
    }
];

// Game loop tracking
let moneyEarningInterval = null;

function restartMoneyLoop() {
    // Clear existing interval
    if (moneyEarningInterval) {
        clearInterval(moneyEarningInterval);
    }
    // Start new interval with updated earnInterval
    moneyEarningInterval = setInterval(() => {
        addMoney();
    }, gameState.earnInterval);
}

function drawPencil(x, y) {
    const skin = skins[gameState.currentSkin];
    const length = 70;
    const width = 12;
    const tipLength = 18;
    
    // Save context for rotation
    ctx.save();
    ctx.translate(x + length / 2, y + width / 2);
    ctx.rotate(Math.PI); // Rotate 180 degrees to face left with tip on left
    ctx.translate(-(x + length / 2), -(y + width / 2));
    
    // Draw shadow beneath pencil
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x + length / 2, y + width + 4, length / 2.2, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw glow effect if applicable
    if (skin.glow) {
        ctx.fillStyle = skin.glowColor;
        ctx.globalAlpha = 0.3;
        ctx.shadowColor = skin.glowColor;
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.beginPath();
        ctx.moveTo(x + 2, y + width / 2);
        ctx.lineTo(x + length - tipLength - 2, y + 2);
        ctx.lineTo(x + length - 2, y + width / 2);
        ctx.lineTo(x + length - tipLength - 2, y + width - 2);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
    
    // Draw wood body with realistic gradient
    const woodGradient = ctx.createLinearGradient(x, y, x, y + width);
    woodGradient.addColorStop(0, 'rgba(230, 200, 120, 1)');
    woodGradient.addColorStop(0.2, skin.bodyColor);
    woodGradient.addColorStop(0.5, skin.bodyColor);
    woodGradient.addColorStop(0.8, skin.bodyColor);
    woodGradient.addColorStop(1, 'rgba(160, 130, 70, 1)');
    
    ctx.fillStyle = woodGradient;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 2);
    ctx.lineTo(x + length - tipLength - 3, y + 2);
    ctx.lineTo(x + length - tipLength + 2, y + width / 2);
    ctx.lineTo(x + length - tipLength - 3, y + width - 2);
    ctx.lineTo(x + 2, y + width - 2);
    ctx.closePath();
    ctx.fill();
    
    // Draw wood grain lines for texture
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 0.4;
    for (let i = 0; i < 7; i++) {
        const offset = i * 10;
        ctx.beginPath();
        ctx.moveTo(x + 8 + offset, y + 1);
        ctx.quadraticCurveTo(x + 10 + offset, y + width / 2, x + 8 + offset, y + width - 1);
        ctx.stroke();
    }
    
    // Draw vertical growth rings
    ctx.strokeStyle = 'rgba(130, 100, 50, 0.15)';
    ctx.lineWidth = 0.3;
    for (let i = 0; i < 4; i++) {
        const offset = i * 17;
        ctx.beginPath();
        ctx.moveTo(x + 15 + offset, y + 2);
        ctx.lineTo(x + 15 + offset, y + width - 2);
        ctx.stroke();
    }
    
    // Draw shiny metal ferrule (band near eraser)
    const ferruleGradient = ctx.createLinearGradient(x + length - tipLength - 16, y, x + length - tipLength - 16, y + width);
    ferruleGradient.addColorStop(0, '#ffffff');
    ferruleGradient.addColorStop(0.15, '#f0f0f0');
    ferruleGradient.addColorStop(0.35, '#d0d0d0');
    ferruleGradient.addColorStop(0.5, '#a8a8a8');
    ferruleGradient.addColorStop(0.65, '#c0c0c0');
    ferruleGradient.addColorStop(0.85, '#e0e0e0');
    ferruleGradient.addColorStop(1, '#b0b0b0');
    
    ctx.fillStyle = ferruleGradient;
    ctx.fillRect(x + length - tipLength - 16, y, 16, width);
    
    // Draw ferrule edges with depth
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(x + length - tipLength - 16, y + 0.5);
    ctx.lineTo(x + length - tipLength, y + 0.5);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(x + length - tipLength - 16, y + width - 0.5);
    ctx.lineTo(x + length - tipLength, y + width - 0.5);
    ctx.stroke();
    
    // Draw pink eraser with gradient
    const eraserGradient = ctx.createLinearGradient(x + length - tipLength, y, x + length - tipLength + 5, y);
    eraserGradient.addColorStop(0, '#f0a8a0');
    eraserGradient.addColorStop(0.5, '#e08080');
    eraserGradient.addColorStop(1, '#d86060');
    
    ctx.fillStyle = eraserGradient;
    ctx.fillRect(x + length - tipLength, y, 5, width);
    
    // Draw eraser highlight
    ctx.fillStyle = 'rgba(255, 220, 220, 0.5)';
    ctx.fillRect(x + length - tipLength + 0.5, y + 0.5, 2.5, 2);
    
    // Draw eraser edge shadow
    ctx.strokeStyle = 'rgba(100, 50, 50, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x + length - tipLength + 5, y + 1);
    ctx.lineTo(x + length - tipLength + 5, y + width - 1);
    ctx.stroke();
    
    // Draw sharp pencil tip with high quality shading
    const tipGradient = ctx.createLinearGradient(x + length - tipLength + 5, y + width / 2, x + length - 1, y + width / 2);
    tipGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    tipGradient.addColorStop(0.3, skin.tipColor);
    tipGradient.addColorStop(0.7, skin.tipColor);
    tipGradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = tipGradient;
    ctx.beginPath();
    ctx.moveTo(x + length - tipLength + 5, y + 0.5);
    ctx.lineTo(x + length - 2, y + width / 2);
    ctx.lineTo(x + length - tipLength + 5, y + width - 0.5);
    ctx.closePath();
    ctx.fill();
    
    // Draw tip outline edges for sharpness
    ctx.strokeStyle = skin.tipColor;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(x + length - tipLength + 5, y + 0.5);
    ctx.lineTo(x + length - 2, y + width / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + length - tipLength + 5, y + width - 0.5);
    ctx.lineTo(x + length - 2, y + width / 2);
    ctx.stroke();
    
    // Draw sharp point highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x + length - 2.5, y + width / 2, 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw lead core visible in tip
    ctx.fillStyle = 'rgba(50, 50, 50, 0.6)';
    ctx.beginPath();
    ctx.moveTo(x + length - tipLength + 5.5, y + width / 2 - 0.8);
    ctx.lineTo(x + length - 3, y + width / 2);
    ctx.lineTo(x + length - tipLength + 5.5, y + width / 2 + 0.8);
    ctx.closePath();
    ctx.fill();
    
    // Draw top highlight on wood body
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 1.5);
    ctx.lineTo(x + length - tipLength - 5, y + 1.5);
    ctx.stroke();
    
    // Draw bottom shadow on wood body
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 4, y + width - 1.5);
    ctx.lineTo(x + length - tipLength - 5, y + width - 1.5);
    ctx.stroke();
    
    // Draw subtle center reflection for 3D effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x + 4, y + width / 2 - 0.5);
    ctx.lineTo(x + length - tipLength - 5, y + width / 2 - 0.5);
    ctx.stroke();
    
    // Restore context
    ctx.restore();
}

function drawPencilWriting() {
    // Clear canvas with dark background
    ctx.fillStyle = '#1e3a4a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw subtle grid lines
    ctx.strokeStyle = 'rgba(42, 90, 127, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Prepare text
    let text = '';
    for (let i = 0; i < gameState.writeCount; i++) {
        text += '67 ';
    }

    // Draw text "67"
    ctx.fillStyle = '#ffffff';
    ctx.font = '400 24px "Segoe UI", sans-serif';
    
    // Wrap text
    let x = 20;
    let y = 50;
    let words = text.split(' ');
    let lastX = x;
    let lastY = y;

    for (let word of words) {
        if (x + ctx.measureText(word).width > canvas.width - 20) {
            x = 20;
            y += 30;
            if (y > canvas.height - 50) break;
        }
        
        // Draw text
        ctx.fillText(word, x, y);
        lastX = x + ctx.measureText(word).width;
        lastY = y;
        x += ctx.measureText(word + ' ').width;
    }
    
    // Draw pencil at the farthest 67
    drawPencil(lastX + 5, lastY - 15);
}

function updateMoneyDisplay() {
    const coinsEl = document.getElementById('money');
    const coinsPerTickEl = document.getElementById('moneyPerTick');
    const prestigeEl = document.getElementById('prestige');
    
    if (coinsEl) {
        coinsEl.textContent = gameState.coins.toFixed(2);
    }
    if (coinsPerTickEl) {
        coinsPerTickEl.textContent = `Per 10s: $${gameState.coinsPerTick.toFixed(2)}`;
    }
    if (prestigeEl) {
        prestigeEl.textContent = `✦ Prestige: ${gameState.prestige}`;
    }
}

function addMoney() {
    gameState.coins += gameState.coinsPerTick;
    gameState.writeCount += 1;
    updateMoneyDisplay();
    drawPencilWriting();
    
    // Check if prestige threshold reached
    if (gameState.coins >= 1000) {
        grantPrestige();
    }
    
    // Create floating coin animation
    const coinAnimation = document.createElement('div');
    coinAnimation.className = 'money-animation';
    coinAnimation.textContent = `+$${gameState.coinsPerTick.toFixed(2)}`;
    document.querySelector('.paper').appendChild(coinAnimation);
    setTimeout(() => coinAnimation.remove(), 1000);
}

function grantPrestige() {
    gameState.prestige += Math.floor(gameState.coins / 1000);
    gameState.coins = gameState.coins % 1000;
    gameState.purchasedUpgrades = [];
    updateMoneyDisplay();
    renderShop();
}

function buyUpgrade(upgradeId) {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || gameState.purchasedUpgrades.includes(upgradeId)) return;
    
    if (gameState.coins >= upgrade.cost) {
        gameState.coins -= upgrade.cost;
        gameState.purchasedUpgrades.push(upgradeId);
        upgrade.effect();
        updateMoneyDisplay();
        renderShop();
    }
}

function buySkill(skillId) {
    const skill = skillTree.find(s => s.id === skillId);
    if (!skill || gameState.purchasedSkills.includes(skillId)) return;
    
    const costType = skill.costType || 'coins';
    const currency = costType === 'prestige' ? gameState.prestige : gameState.coins;
    
    if (currency >= skill.cost) {
        if (costType === 'prestige') {
            gameState.prestige -= skill.cost;
        } else {
            gameState.coins -= skill.cost;
        }
        
        gameState.purchasedSkills.push(skillId);
        
        // Check if this is a path selection (skill-2a/b/c)
        if (skillId === 'skill-2a' || skillId === 'skill-2b' || skillId === 'skill-2c') {
            const pathMap = { 'skill-2a': 'speed', 'skill-2b': 'power', 'skill-2c': 'magic' };
            gameState.selectedPath = pathMap[skillId];
        }
        
        // Unlock 2 more skills after each prestige skill purchase
        if (costType === 'prestige') {
            const purchasedCount = gameState.purchasedSkills.filter(id => {
                const s = skillTree.find(sk => sk.id === id);
                return s && s.costType === 'prestige';
            }).length;
            
            // Unlock new skills every purchase
            const bonusSkillsToUnlock = skillTree.filter(s => 
                s.branch === 'hidden' && 
                s.unlockAfter && 
                s.unlockAfter <= purchasedCount &&
                !gameState.unlockedSkills.includes(s.id)
            );
            bonusSkillsToUnlock.forEach(s => gameState.unlockedSkills.push(s.id));
        }
        
        // Unlock associated skin
        if (skill.skinUnlock && skins[skill.skinUnlock]) {
            skins[skill.skinUnlock].unlocked = true;
        }
        
        skill.effect();

        // Grant a special ability for every skill purchased.
        // Use skill.specialAbility if provided; otherwise auto-generate one.
        const abilityId = skill.specialAbility || `ability-${skill.id}`;
        if (abilityId && !gameState.specialAbilities.includes(abilityId)) {
            gameState.specialAbilities.push(abilityId);
        }
        updateMoneyDisplay();
        renderShop();
        renderSkillTree();
        renderSkinShop();
    }
}

function buySkin(skinKey) {
    const skin = skins[skinKey];
    if (!skin || gameState.purchasedSkins.includes(skinKey)) return;
    
    if (gameState.coins >= skin.cost) {
        gameState.coins -= skin.cost;
        gameState.purchasedSkins.push(skinKey);
        gameState.currentSkin = skinKey;
        updateMoneyDisplay();
        drawPencilWriting();
        renderSkinShop();
    }
}

function selectSkin(skinKey) {
    if (gameState.purchasedSkins.includes(skinKey) || skins[skinKey].unlocked) {
        gameState.currentSkin = skinKey;
        drawPencilWriting();
        renderSkinShop();
    }
}

function renderShop() {
    const shopDiv = document.getElementById('shop');
    if (!shopDiv) return; // Safety check
    shopDiv.innerHTML = '';

    upgrades.forEach(upgrade => {
        const isOwned = gameState.purchasedUpgrades.includes(upgrade.id);
        const canAfford = gameState.freeUpgrades ? !isOwned : (gameState.coins >= upgrade.cost && !isOwned);

        const item = document.createElement('div');
        item.className = `upgrade-item ${isOwned ? 'owned' : ''}`;
        item.innerHTML = `
            <h4>${upgrade.name}</h4>
            <p>${upgrade.description}</p>
            <div class="upgrade-cost">${isOwned ? '✓ Owned' : (gameState.freeUpgrades ? 'FREE' : `$${upgrade.cost.toFixed(2)}`)}</div>
        `;

        if (canAfford) {
            item.onclick = () => buyUpgrade(upgrade.id);
            item.style.cursor = 'pointer';
            item.style.opacity = '1';
        } else if (isOwned) {
            item.style.cursor = 'not-allowed';
            item.style.opacity = '0.7';
        } else {
            item.style.cursor = 'not-allowed';
            item.style.opacity = '0.5';
        }

        shopDiv.appendChild(item);
    });
}

function renderSkillTree() {
    const skillDiv = document.getElementById('skillTree');
    if (!skillDiv) return;
    skillDiv.innerHTML = '';

    if (skillTree.length === 0) return;

    // Organize skills by parent
    const skillsByParent = {};
    skillTree.forEach(skill => {
        const parentId = skill.parent;
        if (!skillsByParent[parentId]) {
            skillsByParent[parentId] = [];
        }
        skillsByParent[parentId].push(skill);
    });

    // Create container for tree visualization
    const treeContainer = document.createElement('div');
    treeContainer.style.display = 'flex';
    treeContainer.style.flexDirection = 'column';
    treeContainer.style.alignItems = 'center';
    treeContainer.style.gap = '30px';

    // Render root skill
    const rootSkill = skillTree[0];
    const isPurchased = gameState.purchasedSkills.includes(rootSkill.id);
    const canAfford = gameState.coins >= rootSkill.cost && !isPurchased;

    const rootNode = document.createElement('div');
    rootNode.className = `skill-node ${isPurchased ? 'purchased' : ''}`;
    rootNode.style.maxWidth = '180px';
    rootNode.innerHTML = `
        <h5>${rootSkill.name}</h5>
        <p>${rootSkill.description}</p>
        <div class="skill-cost">${isPurchased ? '✓ Learned' : `$${rootSkill.cost.toFixed(2)}`}</div>
    `;

    if (canAfford) {
        rootNode.onclick = () => buySkill(rootSkill.id);
        rootNode.style.cursor = 'pointer';
    } else {
        rootNode.style.opacity = isPurchased ? '0.7' : '0.5';
    }

    treeContainer.appendChild(rootNode);

    // If root is purchased, render branching paths
    if (isPurchased) {
        const branches = skillsByParent[rootSkill.id] || [];
        
        // Create branches container
        const branchesContainer = document.createElement('div');
        branchesContainer.style.display = 'flex';
        branchesContainer.style.gap = '40px';
        branchesContainer.style.justifyContent = 'center';
        branchesContainer.style.position = 'relative';
        branchesContainer.style.width = '100%';
        branchesContainer.style.paddingTop = '20px';

        // Create SVG for tree lines
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        branchesContainer.appendChild(svg);

        // Create branch columns
        branches.forEach((firstSkill, branchIdx) => {
            const branchColumn = document.createElement('div');
            branchColumn.style.display = 'flex';
            branchColumn.style.flexDirection = 'column';
            branchColumn.style.gap = '20px';
            branchColumn.style.alignItems = 'center';
            branchColumn.style.minWidth = '200px';

            // Check if this branch is locked (another path was chosen)
            const isPathLocked = gameState.selectedPath && gameState.selectedPath !== firstSkill.branch;

            // Branch title
            const branchTitle = document.createElement('div');
            branchTitle.style.fontSize = '0.85em';
            branchTitle.style.color = isPathLocked ? '#666' : '#6aa8cc';
            branchTitle.style.fontWeight = 'bold';
            branchTitle.style.textTransform = 'uppercase';
            branchTitle.style.letterSpacing = '1px';
            branchTitle.textContent = `${firstSkill.branch.charAt(0).toUpperCase() + firstSkill.branch.slice(1)} Path`;
            if (isPathLocked) {
                branchTitle.textContent += ' (Locked)';
            } else if (gameState.selectedPath === firstSkill.branch) {
                branchTitle.textContent += ' ✓';
                branchTitle.style.color = '#4ade80';
            }
            branchColumn.appendChild(branchTitle);

            // Render skill chain (will be disabled if path is locked)
            renderSkillChain(firstSkill, branchColumn, skillsByParent, isPathLocked);

            branchesContainer.appendChild(branchColumn);
        });

        // Draw connecting lines from root to branches
        setTimeout(() => {
            const rootRect = rootNode.getBoundingClientRect();
            const branchCols = branchesContainer.querySelectorAll('div[style*="flex-direction: column"]');
            
            branchCols.forEach(col => {
                const colRect = col.getBoundingClientRect();
                const containerRect = branchesContainer.getBoundingClientRect();
                
                // Convert to relative coordinates
                const x1 = rootRect.left - containerRect.left + rootRect.width / 2;
                const y1 = rootRect.top - containerRect.top + rootRect.height;
                const x2 = colRect.left - containerRect.left + colRect.width / 2;
                const y2 = colRect.top - containerRect.top - 10;
                
                // Draw line
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.setAttribute('stroke', '#6aa8cc');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('opacity', '0.5');
                svg.appendChild(line);
            });
        }, 100);

        treeContainer.appendChild(branchesContainer);
    }

    // Display unlocked bonus skills
    if (gameState.unlockedSkills.length > 1) { // More than just the root skill
        const bonusSection = document.createElement('div');
        bonusSection.style.marginTop = '30px';
        bonusSection.style.borderTop = '2px solid #6aa8cc';
        bonusSection.style.paddingTop = '20px';
        bonusSection.style.width = '100%';

        const bonusTitle = document.createElement('h4');
        bonusTitle.textContent = '🎁 Special Abilities';
        bonusTitle.style.textAlign = 'center';
        bonusTitle.style.color = '#fbbf24';
        bonusTitle.style.marginBottom = '20px';
        bonusSection.appendChild(bonusTitle);

        const bonusGrid = document.createElement('div');
        bonusGrid.style.display = 'grid';
        bonusGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr))';
        bonusGrid.style.gap = '15px';
        bonusGrid.style.justifyItems = 'center';

        gameState.unlockedSkills.forEach(skillId => {
            const bonusSkill = skillTree.find(s => s.id === skillId && s.branch === 'hidden');
            if (!bonusSkill) return;

            const isPurchased = gameState.purchasedSkills.includes(skillId);
            const costType = bonusSkill.costType || 'coins';
            const currency = costType === 'prestige' ? gameState.prestige : gameState.coins;
            const canAfford = currency >= bonusSkill.cost && !isPurchased;

            const node = document.createElement('div');
            node.className = `skill-node ${isPurchased ? 'purchased' : ''}`;
            node.style.maxWidth = '150px';
            const costLabel = costType === 'prestige' ? '◆' : '$';
            node.innerHTML = `
                <h5 style="font-size: 0.85em;">${bonusSkill.name}</h5>
                <p style="font-size: 0.7em;">${bonusSkill.description}</p>
                <div class="skill-cost">${isPurchased ? '✓ Learned' : `${costLabel}${bonusSkill.cost}`}</div>
            `;

            if (canAfford) {
                node.onclick = () => buySkill(skillId);
                node.style.cursor = 'pointer';
                node.style.opacity = '1';
            } else if (isPurchased) {
                node.style.opacity = '0.7';
            } else {
                node.style.opacity = '0.5';
                node.style.cursor = 'not-allowed';
            }

            bonusGrid.appendChild(node);
        });

        bonusSection.appendChild(bonusGrid);
        treeContainer.appendChild(bonusSection);
    }

    skillDiv.appendChild(treeContainer);
}

function renderSkillChain(skill, parentContainer, skillsByParent, isPathLocked = false) {
    const isPurchased = gameState.purchasedSkills.includes(skill.id);
    const costType = skill.costType || 'coins';
    const currency = costType === 'prestige' ? gameState.prestige : gameState.coins;
    const canAfford = currency >= skill.cost && !isPurchased;
    const isAvailable = gameState.purchasedSkills.includes(skill.parent) && !isPathLocked;
    
    const costText = costType === 'prestige' ? skill.cost : `$${skill.cost.toFixed(2)}`;

    const node = document.createElement('div');
    node.className = `skill-node ${!isAvailable ? 'locked' : ''} ${isPurchased ? 'purchased' : ''}`;
    node.style.maxWidth = '170px';
    const costLabel = costType === 'prestige' ? '◆' : '$';
    node.innerHTML = `
        <h5 style="font-size: 0.9em;">${skill.name}</h5>
        <p style="font-size: 0.75em;">${skill.description}</p>
        <div class="skill-cost">${isPurchased ? '✓ Learned' : `${costLabel}${costText}`}</div>
    `;

    if (canAfford && isAvailable) {
        node.onclick = () => buySkill(skill.id);
        node.style.cursor = 'pointer';
        node.style.opacity = '1';
    } else if (!isAvailable) {
        node.style.opacity = '0.3';
        node.style.cursor = 'not-allowed';
    } else if (isPurchased) {
        node.style.opacity = '0.7';
    } else {
        node.style.opacity = '0.5';
    }

    parentContainer.appendChild(node);

    // If this skill is purchased, render its children
    if (isPurchased) {
        const children = skillsByParent[skill.id] || [];
        children.forEach(child => {
            renderSkillChain(child, parentContainer, skillsByParent, isPathLocked);
        });
    }
}

function renderSkinShop() {
    const skinGrid = document.getElementById('skinGrid');
    skinGrid.innerHTML = '';

    Object.entries(skins).forEach(([key, skin]) => {
        const isOwned = gameState.purchasedSkins.includes(key) || skin.unlocked;
        const isSelected = gameState.currentSkin === key;
        const canAfford = gameState.coins >= skin.cost;

        const item = document.createElement('div');
        item.className = `skin-item ${isOwned ? 'owned' : ''} ${isSelected ? 'selected' : ''}`;
        
        // Create mini pencil preview
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = 100;
        previewCanvas.height = 40;
        const previewCtx = previewCanvas.getContext('2d');
        
        // Draw preview background
        previewCtx.fillStyle = '#223f52';
        previewCtx.fillRect(0, 0, 100, 40);
        
        // Draw mini pencil
        previewCtx.fillStyle = skin.bodyColor;
        previewCtx.fillRect(10, 15, 25, 4);
        previewCtx.fillStyle = skin.tipColor;
        previewCtx.beginPath();
        previewCtx.moveTo(35, 15);
        previewCtx.lineTo(43, 17);
        previewCtx.lineTo(35, 19);
        previewCtx.fill();
        
        // Add glow if applicable
        if (skin.glow) {
            previewCtx.fillStyle = skin.glowColor;
            previewCtx.globalAlpha = 0.2;
            previewCtx.fillRect(8, 13, 30, 8);
            previewCtx.globalAlpha = 1;
        }
        
        item.appendChild(previewCanvas);
        item.innerHTML += `
            <h4>${skin.name}</h4>
            <p>${skin.description}</p>
            <div class="skin-cost">${isOwned ? '✓ Owned' : `$${skin.cost.toFixed(2)}`}</div>
        `;

        if (isOwned) {
            item.onclick = () => selectSkin(key);
            item.style.cursor = 'pointer';
        } else if (canAfford) {
            item.onclick = () => buySkin(key);
            item.style.cursor = 'pointer';
        } else {
            item.style.opacity = '0.6';
            item.style.cursor = 'not-allowed';
        }

        skinGrid.appendChild(item);
    });
}

function toggleSkillTree() {
    const modal = document.getElementById('skillTreeModal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        renderSkillTree();
    }
}

function toggleSkinShop() {
    const modal = document.getElementById('skinShop');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        renderSkinShop();
    }
}

// Admin Panel Functions
function toggleAdminPanel() {
    const modal = document.getElementById('adminPanel');
    const controls = document.getElementById('adminControls');
    modal.classList.toggle('hidden');
    if (modal.classList.contains('hidden')) {
        controls.style.display = 'none';
        document.getElementById('adminCode').value = '';
    }
}

function verifyAdminCode() {
    const code = document.getElementById('adminCode').value;
    const controls = document.getElementById('adminControls');
    
    if (code === '3843') {
        controls.style.display = 'block';
        alert('Admin access granted!');
    } else {
        alert('Incorrect code!');
        document.getElementById('adminCode').value = '';
    }
}

function adminGiveCoins() {
    gameState.coins += 1000000;
    updateMoneyDisplay();
    renderShop();
    alert('Added 1,000,000 coins!');
}

function adminGivePrestige() {
    gameState.prestige += 100;
    updateMoneyDisplay();
    alert('Added 100 prestige!');
}

function adminFreeUpgrades() {
    gameState.freeUpgrades = !gameState.freeUpgrades;
    renderShop();
    alert(`Free upgrades: ${gameState.freeUpgrades ? 'ON' : 'OFF'}`);
}

function saveGame() {
    const saveData = {
        coins: gameState.coins,
        coinsPerTick: gameState.coinsPerTick,
        earnInterval: gameState.earnInterval,
        prestige: gameState.prestige,
        writeCount: gameState.writeCount,
        currentSkin: gameState.currentSkin,
        purchasedUpgrades: gameState.purchasedUpgrades,
        purchasedSkills: gameState.purchasedSkills,
        purchasedSkins: gameState.purchasedSkins,
        specialAbilities: gameState.specialAbilities
    };
    localStorage.setItem('pencilGameSave', JSON.stringify(saveData));
}

function loadGame() {
    const saveData = localStorage.getItem('pencilGameSave');
    if (saveData) {
        const loaded = JSON.parse(saveData);
        Object.assign(gameState, loaded);
        updateMoneyDisplay();
        drawPencilWriting();
        renderShop();
        renderSkillTree();
    }
}

// Initialize game
window.addEventListener('load', () => {
    // Initialize canvas now that DOM is ready
    canvas = document.getElementById('paperCanvas');
    ctx = canvas.getContext('2d');

    // Update display first to show correct initial values
    updateMoneyDisplay();

    // Start fresh with default state (remove this line if you want to restore saved progress)
    // loadGame();

    renderShop();
    renderSkillTree();
    drawPencilWriting();

    // Main game loop - earn money at dynamic interval
    restartMoneyLoop();

    // Continuously update shop and money display
    setInterval(() => {
        updateMoneyDisplay();
        renderShop();
    }, 500);

    // Redraw canvas when window resizes
    window.addEventListener('resize', drawPencilWriting);
});
