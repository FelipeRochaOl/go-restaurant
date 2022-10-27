/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import { Handler } from '@netlify/functions';
import { Event } from '@netlify/functions/dist/function/event';
import { foods } from '../../server.json';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const storage: IFoodPlate[] = [];

const createFood = (event: Event): IFoodPlate[] | IFoodPlate => {
  if (!event.body) return storage;
  const food: IFoodPlate = JSON.parse(event.body);
  const id = storage.length + 1;
  food.id = id;
  storage.push(food);
  return food;
};

const selectFood = (event: Event): IFoodPlate | undefined => {
  const urlParts = event.path.split('/');
  const id = Number(urlParts[urlParts.length - 1]);
  if (!Number.isNaN(id)) {
    return storage.find(product => product.id === id);
  }
  return undefined;
};

const selectFoodIndex = (event: Event): number => {
  const urlParts = event.path.split('/');
  const id = Number(urlParts[urlParts.length - 1]);
  return storage.findIndex(product => product.id === id);
};

const deleteFood = (event: Event): IFoodPlate => {
  if (!event.body) return {} as IFoodPlate;
  const selectedFood = selectFood(event);
  if (!selectedFood) return {} as IFoodPlate;
  storage.reduce((prevValue, currentValue) => {
    if (currentValue.id !== selectedFood.id) {
      prevValue.push(currentValue);
    }
    return prevValue;
  }, [] as IFoodPlate[]);
  return {} as IFoodPlate;
};

const updateFood = (event: Event): IFoodPlate[] | IFoodPlate => {
  if (!event.body) return storage;
  const food: IFoodPlate = JSON.parse(event.body);
  const selectedFood = selectFoodIndex(event);
  if (selectedFood === -1) return food;
  storage[selectedFood] = food;
  return storage[selectedFood];
};

const initStorage = (): void => {
  if (!storage.length) {
    foods.map(food => {
      storage.push(food);
    });
  }
};

const handler: Handler = async event => {
  initStorage();
  let response = foods as IFoodPlate[] | IFoodPlate;
  if (event.httpMethod === 'POST') {
    response = createFood(event);
  }
  if (event.httpMethod === 'PUT') {
    response = updateFood(event);
  }
  if (event.httpMethod === 'DELETE') {
    response = deleteFood(event);
  }
  return {
    statusCode: 200,
    body: response !== undefined ? JSON.stringify(response) : '',
  };
};

export { handler };
