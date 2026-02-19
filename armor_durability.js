class ArmorDurabilityDisplay {
    constructor() {
        this.config = { enabled: true, showOwnArmor: true, showEnemyArmor: true, updateRate: 100 };
        this.playerArmor = { helmet: { durability: 0, maxDurability: 0 }, chestplate: { durability: 0, maxDurability: 0 }, leggings: { durability: 0, maxDurability: 0 }, boots: { durability: 0, maxDurability: 0 } };
        this.enemyPlayers = new Map();
    }

    getDurabilityPercentage(durability, maxDurability) {
        if (maxDurability === 0) return 1.0;
        return durability / maxDurability;
    }

    getDurabilityColor(percentage) {
        if (percentage > 0.8) return { r: 34, g: 204, b: 34 };
        if (percentage > 0.6) return { r: 102, g: 204, b: 0 };
        if (percentage > 0.4) return { r: 204, g: 204, b: 34 };
        if (percentage > 0.2) return { r: 204, g: 102, b: 0 };
        return { r: 204, g: 34, b: 34 };
    }

    formatDurability(durability, maxDurability) {
        if (maxDurability === 0) return "No Armor";
        const percentage = this.getDurabilityPercentage(durability, maxDurability);
        return `${Math.floor(percentage * 100)}% (${durability}/${maxDurability})`;
    }

    updatePlayerArmor(armorSlot, durability, maxDurability) {
        if (this.playerArmor[armorSlot]) {
            this.playerArmor[armorSlot].durability = durability;
            this.playerArmor[armorSlot].maxDurability = maxDurability;
        }
    }

    updateEnemyArmor(playerName, armorData) {
        if (!this.enemyPlayers.has(playerName)) {
            this.enemyPlayers.set(playerName, {});
        }
        const player = this.enemyPlayers.get(playerName);
        Object.assign(player, armorData);
    }

    renderArmorOverlay(canvas, context) {
        if (!this.config.enabled || !this.config.showOwnArmor) return;
        const startX = 10;
        const startY = 10;
        const lineHeight = 20;
        context.font = "12px Minecraft";
        const armorSlots = ['helmet', 'chestplate', 'leggings', 'boots'];
        const armorNames = { helmet: 'Helmet', chestplate: 'Chestplate', leggings: 'Leggings', boots: 'Boots' };
        armorSlots.forEach((slot, index) => {
            const armor = this.playerArmor[slot];
            if (armor.maxDurability > 0) {
                const percentage = this.getDurabilityPercentage(armor.durability, armor.maxDurability);
                const color = this.getDurabilityColor(percentage);
                const y = startY + (index * lineHeight);
                context.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
                context.fillText(armorNames[slot] + ': ' + this.formatDurability(armor.durability, armor.maxDurability), startX, y);
                const barWidth = 100;
                const barHeight = 8;
                context.fillStyle = 'rgba(0,0,0,0.5)';
                context.fillRect(startX, y + 5, barWidth, barHeight);
                context.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
                context.fillRect(startX, y + 5, barWidth * percentage, barHeight);
                context.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
                context.strokeRect(startX, y + 5, barWidth, barHeight);
            }
        });
    }

    renderEnemyArmorDisplay(canvas, context, playerName, x, y) {
        if (!this.config.enabled || !this.config.showEnemyArmor) return;
        if (!this.enemyPlayers.has(playerName)) return;
        const player = this.enemyPlayers.get(playerName);
        context.font = "10px Minecraft";
        context.fillStyle = 'rgba(255,255,255,0.8)';
        if (player.helmet && player.helmet.maxDurability > 0) {
            const color = this.getDurabilityColor(this.getDurabilityPercentage(player.helmet.durability, player.helmet.maxDurability));
            context.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
            context.fillText('H', x - 5, y - 20);
        }
    }

    getArmorStatus() {
        const status = {};
        const armorSlots = ['helmet', 'chestplate', 'leggings', 'boots'];
        armorSlots.forEach(slot => {
            const armor = this.playerArmor[slot];
            status[slot] = { percentage: this.getDurabilityPercentage(armor.durability, armor.maxDurability), formatted: this.formatDurability(armor.durability, armor.maxDurability) };
        });
        return status;
    }

    setEnabled(enabled) {
        this.config.enabled = enabled;
    }

    toggleOwnArmorDisplay() {
        this.config.showOwnArmor = !this.config.showOwnArmor;
    }

    toggleEnemyArmorDisplay() {
        this.config.showEnemyArmor = !this.config.showEnemyArmor;
    }
}

const armorDisplay = new ArmorDurabilityDisplay();
if (typeof window !== 'undefined') {
    window.armorDisplay = armorDisplay;
}
module.exports = ArmorDurabilityDisplay;
