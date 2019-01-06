import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';

export { EndpointTypes } from './types';
export { EndpointModules } from './modules';

// register endpoints to container.
injectable(EndpointModules.Endpoints,
  [EndpointModules.Room.Create,
    EndpointModules.Room.List],
  async (create: EndpointTypes.Endpoint,
    list: EndpointTypes.Endpoint) => ([
      create, list
    ]));