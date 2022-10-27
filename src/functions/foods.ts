import { Handler } from '@netlify/functions';
import { foods } from '../../server.json';

const handler: Handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(foods),
  };
};

export { handler };
