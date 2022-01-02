import { Document, Schema, Model, model } from 'mongoose';

interface SecretSchema extends Document {
    urlId: string;
    secret: string;
}

const secretSchema: Schema<SecretSchema> = new Schema({
    urlId: String,
    secret: String,
});

export const SecretModel: Model<SecretSchema> = model('Secrets', secretSchema);
