export class CustomError extends Error {
    statusCode: number;
    internalErrorNumber?: number;

    /**
     * 創建一個CustomError實例。
     * @param {string} message - 錯誤訊息。
     * @param {number} statusCode - HTTP狀態碼。
     * @param {number} [internalErrorNumber] - 可選的內部錯誤編號。
     */
    constructor(message: string, statusCode: number, internalErrorNumber?: number) {
        // 調用基類的構造函數
        super(message);

        // 設置HTTP狀態碼
        this.statusCode = statusCode;
        // 設置內部錯誤編號（如果提供）
        this.internalErrorNumber = internalErrorNumber;

        // 恢復原型鏈
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /**
     * 將錯誤訊息轉換為JSON物件，用於HTTP回應。
     * @returns {Object} 表示錯誤的JSON物件。
     */
    toJSON() {
        return {
            message: this.message, // 錯誤訊息
            statusCode: this.statusCode, // HTTP狀態碼
            // 如果存在內部錯誤編號，則添加到JSON物件中
            ...(this.internalErrorNumber && { internalErrorNumber: this.internalErrorNumber }),
        };
    }
}
