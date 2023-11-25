export interface IPart {
  headers: [
    {
      name: string;
      value: string;
    },
  ];
  mimeType: string;
  body: {
    data: string;
  };
  parts?: IPart[];
}

export interface IGetAllEmailsResponse {
  messages: [
    {
      id: string;
    },
  ];
}
export interface IGetEmailResponse {
  id: string;
  internalDate: string;
  snippet: string;
  payload: IPart;
}
