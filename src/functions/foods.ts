/* eslint-disable no-param-reassign */
import { Handler } from '@netlify/functions';
import { Event } from '@netlify/functions/dist/function/event';
import { foods } from '../../server.json';

interface IFoodProps {
  foodsData: IFoodPlate[];
  event: Event;
}

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const createFood = ({
  foodsData,
  event,
}: IFoodProps): IFoodPlate[] | IFoodPlate => {
  if (!event.body) return foodsData;
  const food: IFoodPlate = JSON.parse(event.body);
  foodsData.push(food);
  return food;
};

const selectFood = ({
  foodsData,
  event,
}: IFoodProps): IFoodPlate | undefined => {
  const urlParts = event.path.split('/');
  const id = Number(urlParts[urlParts.length - 1]);
  if (!Number.isNaN(id)) {
    return foodsData.find(product => product.id === id);
  }
  return undefined;
};

const deleteFood = ({ foodsData, event }: IFoodProps): IFoodPlate => {
  if (!event.body) return {} as IFoodPlate;
  const selectedFood = selectFood({ foodsData, event });
  if (!selectedFood) return {} as IFoodPlate;
  foodsData.reduce((prevValue, currentValue) => {
    if (currentValue.id !== selectedFood.id) {
      prevValue.push(currentValue);
    }
    return prevValue;
  }, [] as IFoodPlate[]);
  return {} as IFoodPlate;
};

const updateFood = ({
  foodsData,
  event,
}: IFoodProps): IFoodPlate[] | IFoodPlate => {
  if (!event.body) return foodsData;
  const food: IFoodPlate = JSON.parse(event.body);
  const selectedFood = selectFood({ foodsData, event });
  if (!selectedFood) return foodsData;
  foodsData.map(foodData => {
    if (foodData.id === selectedFood.id) {
      foodData.name = food.name;
      foodData.image = food.image;
      foodData.price = food.price;
      foodData.description = food.description;
      foodData.available = food.available;
    }
    return foodData;
  });
  return food;
};

const handler: Handler = async event => {
  let response = foods as IFoodPlate[] | IFoodPlate;
  if (event.httpMethod === 'POST') {
    response = createFood({ foodsData: foods, event });
  }
  if (event.httpMethod === 'PUT') {
    response = updateFood({ foodsData: foods, event });
  }
  if (event.httpMethod === 'DELETE') {
    response = deleteFood({ foodsData: foods, event });
  }
  return {
    statusCode: 200,
    body: response !== undefined ? JSON.stringify(response) : '',
  };
};

export { handler };
