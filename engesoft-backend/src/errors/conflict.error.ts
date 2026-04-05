export class ConflictError extends Error {
    constructor(message = 'Recurso já existe') {
        super(message);
        this.name = 'ConflictError';
    }
}
