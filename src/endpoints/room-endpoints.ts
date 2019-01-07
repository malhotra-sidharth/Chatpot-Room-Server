import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { ExtApiModules, ExtApiTypes } from '../extapis';

injectable(EndpointModules.Room.List,
  [ EndpointModules.Utils.WrapAync,
    ExtApiModules.AuthReq.MembersByNos ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    getMembersByNos: ExtApiTypes.AuthReq.MembersByNos): Promise<EndpointTypes.Endpoint> =>
  ({
    uri: '/rooms',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      wrapAsync(async (req, res, next) => {
        await getMembersByNos([32, 33]);
        res.status(200).json({});
      })
    ]
  }));

injectable(EndpointModules.Room.Create,
  [ EndpointModules.Utils.WrapAync ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync): Promise<EndpointTypes.Endpoint> => ({
    uri: '/room',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        res.status(200).json({});
      })
    ]
  }));

injectable(EndpointModules.Room.Join,
  [ EndpointModules.Utils.WrapAync ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync): Promise<EndpointTypes.Endpoint> => ({
    uri: '/room/:room_token/join',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        res.status(200).json({});
      })
    ]
  }));

injectable(EndpointModules.Room.Leave,
  [ EndpointModules.Utils.WrapAync ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync): Promise<EndpointTypes.Endpoint> => ({
    uri: '/room/:room_token/leave',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        res.status(200).json({});
      })
    ]
  }));