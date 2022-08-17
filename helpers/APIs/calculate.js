import api from ".";

export const sendDataForCalculation = async (data, id) =>
  api
    .post("/calculate", data, {
      params: {
        id: id,
      },
    })
    .then((result) => {
      return result.data;
    });
