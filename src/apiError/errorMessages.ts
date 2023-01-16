export const getInvalidEndpointMessage = (method: string, url: string) =>
  `Cannot ${method} ${url}`;

export const getIdNotFoundMessage = (id: string) =>
  `User with id ${id} not found`;
