export default class Distribution {
    min: number;
    max: number;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    generateIntegerInDistribution(): number {
        return Math.floor(Math.random() * Math.ceil(this.max)) + Math.floor(this.min);
    }
}