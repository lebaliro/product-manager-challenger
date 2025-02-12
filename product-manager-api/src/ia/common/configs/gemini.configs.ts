import { ModelParams, SchemaType } from '@google/generative-ai';

const schema = {
  description: `List of information of product`,
  type: SchemaType.OBJECT,
  properties: {
    technicalDescription: {
      type: SchemaType.STRING,
      description: 'Technical Description of Product',
      nullable: false,
    },
    funcionalityDescription: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
    },
    price: {
      type: SchemaType.NUMBER,
      description: 'Price of product',
      nullable: false,
    },
  },
  required: ['technicalDescription', 'funcionalityDescription', 'price'],
};

export const enrichProductModelConfig: ModelParams = {
  model: 'gemini-2.0-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: schema,
  },
};
